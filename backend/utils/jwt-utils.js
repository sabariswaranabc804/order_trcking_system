const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secret key for JWT (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'zeal-travels-secret-key';

// Encryption key for sensitive payload data (must be exactly 32 bytes for AES-256)
// Using crypto.scryptSync to derive a 32-byte key from any string
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)
  : crypto.scryptSync('zeal-travels-encryption-key', 'salt', 32);

// Encrypt sensitive data
function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt sensitive data
function decryptData(encryptedText) {
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedData = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// Generate JWT token with all data encrypted
function generateToken(user) {
  // Encrypt all user data
  const userData = {
    id: user.user_Code,
    deliveryman_id: user.deliveryman_id,
    company_Id: user.company_Id,
    userType: user.user_Type_ID,
    email:user.email_ID,
    name:user.user_Name
    
  };
  
  const encryptedData = encryptData(userData);
  
  // Create payload with just the encrypted data
  const payload = {
    data: encryptedData,
    // Include a timestamp for token freshness check
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify JWT token and decrypt data
function verifyToken(token) {
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Decrypt the data
    if (decoded.data) {
      const userData = decryptData(decoded.data);
      if (userData) {
        // Return the decrypted user data
        return { ...userData, iat: decoded.iat, exp: decoded.exp };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

module.exports = { generateToken, verifyToken };