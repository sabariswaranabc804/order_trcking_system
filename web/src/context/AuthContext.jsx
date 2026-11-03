import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const apiUrl=import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  //console.log("setuser",user);
  
  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${apiUrl}/auth/me`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            /* console.log("user",data.user); */
            
            // Auto-redirect if on login page and already authenticated
            if (location.pathname === '/' || location.pathname === '/login') {
              redirectBasedOnUserType(data.user);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        /* console.error('Auth check failed:', error); */
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname]);

  // Helper function to redirect based on user type
  const redirectBasedOnUserType = (user) => {
    if (!user) return;
    //console.log("re",user);
    
    if ((user.user_type)||(user.userType)  === 4) {
      navigate('/anchor');
    } else if ((user.user_type)||(user.userType) === 1) {
      navigate('/superadmin');
    } 
    else if ((user.user_type)||(user.userType) === 3) {
      navigate('/superadmin');
    } else if ((user.user_type)||(user.userType)===2) {
      navigate('/admin');
    }
    else if ((user.user_type)||(user.userType)===5) {
      navigate('/user');
    }
  };

  // Login function
  const login = (userData) => {
    setUser(userData);
    redirectBasedOnUserType(userData);
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Logout failed');
      }
    } catch (error) {
      /* console.error('Logout failed:', error); */
      setError('Network error during logout');
    } finally {
      setLoading(false);
    }
  };

  // Function to get user profile data
  const getUserProfile = async () => {
    try {
      setLoading(true);
      
      // First check if we already have user data in state
      if (user) {
        return user;
      }

      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user); // Update the user state
          return data.user;
        } else {
          throw new Error('No user data in response');
        }
      } else {
        // Handle specific status codes
        if (response.status === 401) {
          navigate('/'); // Redirect to login if unauthorized
          throw new Error('Please login to continue');
        } else {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
      }
    } catch (error) {
      /* console.error('Profile fetch error:', error); */
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login, 
      logout,
      getUserProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);