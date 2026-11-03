import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { ThemeContextProvider } from "./theme/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback"; // adjust the path accordingly

function App() {
  return (
    <Router>
      <ThemeContextProvider>
        <AuthProvider>
          <Provider store={store}>
            <CartProvider>
              <WishlistProvider>
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onReset={() => {
                    // Optionally reset state here or reload
                    window.location.reload();
                  }}
                >
                  <AppRoutes />
                </ErrorBoundary>
              </WishlistProvider>
            </CartProvider>
          </Provider>
        </AuthProvider>
      </ThemeContextProvider>
    </Router>
  );
}

export default App;
