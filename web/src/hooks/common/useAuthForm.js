import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import authService from '../../service/common/authService';

const useAuthForm = () => {
  const { login: loginAuth } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: null,
    mobile: '',
    otp: ['', '', '', '', '', '']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOTPChange = (index, value) => {
    // Only allow single digit numbers
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 1);
    
    const newOTP = [...formData.otp];
    newOTP[index] = sanitizedValue;
    setFormData(prev => ({
      ...prev,
      otp: newOTP
    }));

    // Auto-focus next input only if a digit was entered
    if (sanitizedValue && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAuthenticate = async () => {
    if (loading) return; // Prevent multiple clicks

    // Basic validation
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return;
      }
      if (!formData.mobile.trim()) {
        toast.error('Mobile number is required');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const data = await authService.sendOTP(formData.email);

        if (data.success) {
          setShowOTP(true);
          toast.success('OTP sent to your email');
        } else {
          toast.error(data.message || 'Failed to send OTP');
        }
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          dob: formData.dob,
          mobile: formData.mobile
        };

        const data = await authService.register(userData);

        if (data.success) {
          setShowOTP(true);
          toast.success('Registration successful! OTP sent to your email');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpLoading) return; // Prevent multiple clicks

    // Validate OTP
    const otpValue = formData.otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setOtpLoading(true);
    try {
      const data = await authService.verifyOTP(formData.email, otpValue);

      if (data.success) {
        loginAuth(data.user);

        // Redirect based on user type
        if (data.user.user_type === 1) {
          navigate('/superadmin');
        } else if (data.user.user_type === 2) {
          navigate('/admin');
        } else if (data.user.user_type === 3) {
          navigate('/Owner');
        } else if (data.user.user_type === 4) {
          navigate('/anchor');
        } else if (data.user.user_type === 5) {
          navigate('/user');
        } else {
          navigate('/401');
        }

        toast.success('Login successful!');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setOtpLoading(false);
    }
  };

  const toggleAuthMode = (e) => {
    e.preventDefault();
    if (loading || otpLoading) return; // Prevent mode change during loading

    setIsLogin(!isLogin);
    setShowOTP(false);
    setLoading(false);
    setOtpLoading(false);
    setFormData(prev => ({
      ...prev,
      name: '',
      email: '',
      dob: null,
      mobile: '',
      otp: ['', '', '', '', '', '']
    }));
  };

  return {
    isLogin,
    showOTP,
    formData,
    loading,
    otpLoading,
    handleChange,
    handleOTPChange,
    handleAuthenticate,
    handleSubmit,
    toggleAuthMode
  };
};

export default useAuthForm;