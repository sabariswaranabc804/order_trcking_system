// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
// import { resetCart } from '../cart/cartSlice'; // Adjust the import path as needed
// import { resetWishlist } from '../wishlist/wishlistSlice'; // Adjust the import path as needed
// // Check if user is already logged in (from localStorage)
const initialState = {
  userID: localStorage.getItem('userID') || 0,
  user_type: localStorage.getItem('user_type') ||0, // Add user_type to initial state
  company_Id: localStorage.getItem('company_Id') || 0, 
  deliveryman_id:localStorage.getItem('deliveryman_id') || 0,// Add company_Id to initial state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { userID, user_type,company_Id,deliveryman_id } = action.payload;
      state.userID = userID;
      state.user_type = user_type;
      state.company_Id = company_Id; // Store company_Id in state
      state.deliveryman_id=deliveryman_id
      localStorage.setItem('userID', userID);
      localStorage.setItem('user_type', user_type);
      localStorage.setItem('company_Id', company_Id); // Store company_Id in localStorage
      localStorage.setItem('deliveryman_id', deliveryman_id);
    },
    setCompanyId: (state, action) => {
      state.company_Id = action.payload;
      localStorage.setItem('company_Id', action.payload); // Store company_Id in localStorage
    },
    logout: (state) => {
      state.userID = null;
      state.user_type = null;
      state.company_Id = 0; // Clear company_Id on logout
      localStorage.removeItem('userID');
      localStorage.removeItem('user_type');
      localStorage.removeItem('company_Id'); // Remove company_Id from localStorage
      localStorage.removeItem('deliveryman_id');


      // // Dispatch reset actions
      // action.payload.dispatch(resetCart());
      // action.payload.dispatch(resetWishlist());
    },
  },
});

export const { login, logout, setCompanyId } = userSlice.actions;

export default userSlice.reducer;
