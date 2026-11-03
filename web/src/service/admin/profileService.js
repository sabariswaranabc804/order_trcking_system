import API_URL from '../../config';

// Fetch user profile data by user ID
export const fetchUserProfile = async (userID) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userID}`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (error) {
    // console.error('Failed to fetch user data:', error);
    throw error;
  }
};