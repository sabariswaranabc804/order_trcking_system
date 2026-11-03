import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { ThemeContextProvider } from './theme/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext.jsx';

// React functional component with TypeScript
const App: React.FC = () => {
  return (
    <Router>
      <ThemeContextProvider>
        <AuthProvider>
          <Provider store={store}>
            <CartProvider>
              <WishlistProvider>
               
                  <AppRoutes />
             
              </WishlistProvider>
            </CartProvider>
          </Provider>
        </AuthProvider>
      </ThemeContextProvider>
    </Router>
  );
};

export default App;