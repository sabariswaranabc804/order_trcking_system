import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Box,
  useTheme,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { useWishlistStatus } from "../../../hooks/user/useWishlistStatus";
import API_URL from "../../../config";

function ServiceCard({ service }) {
  const theme = useTheme();
  const { dispatch: cartDispatch } = useCart();
  const { user } = useAuth();
  const customerId = user?.user_code;
  const navigate = useNavigate();

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStatus(
    customerId,
    service.servSubType_Id
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSelectItem = () => {
    if (!customerId) {
      Swal.fire({
        icon: "warning",
        title: "Please log in",
        text: "You need to log in to add items to your Cart.",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setQuantity(1);
    cartDispatch({ type: "ADD_TO_CART", payload: service });
    setSnackbarMessage(`${service.servSubType_Name} added to Bucket.`);
    setToastOpen(true);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    cartDispatch({ type: "ADD_TO_CART", payload: service });
    setSnackbarMessage(`Quantity updated to ${newQuantity}`);
    setToastOpen(true);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      cartDispatch({ type: "UPDATE_QUANTITY", payload: { id: service.servSubType_Id, quantity: newQuantity } });
      setSnackbarMessage(`Quantity updated to ${newQuantity}`);
      setToastOpen(true);
    } else if (quantity === 1) {
      setQuantity(0);
      cartDispatch({ type: "REMOVE_FROM_CART", payload: { id: service.servSubType_Id } });
      setSnackbarMessage(`${service.servSubType_Name} removed from cart.`);
      setToastOpen(true);
    }
  };

  const handleToggleWishlist = async () => {
    if (!customerId) {
      Swal.fire({
        icon: "warning",
        title: "Please log in",
        text: "You need to log in to add items to your Wishlist.",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (isInWishlist) {
      await removeFromWishlist();
    } else {
      await addToWishlist();
    }
  };

  return (
    <>
      <Card
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark'
            ? "0 2px 8px rgba(0,0,0,0.5)"
            : "0 2px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.palette.mode === 'dark'
              ? "0 4px 16px rgba(0,0,0,0.7)"
              : "0 4px 16px rgba(0,0,0,0.15)",
          },
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Wishlist Icon */}
        <IconButton
          onClick={handleToggleWishlist}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: theme.palette.background.paper,
            boxShadow: 1,
            zIndex: 1,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
          size="small"
        >
          {isInWishlist ? (
            <FavoriteIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          )}
        </IconButton>

        {/* Image with Background */}
        {service.imagefile && (
          <Box
            sx={{
              position: "relative",
              height: { xs: 180, sm: 200 },
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.background.default} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: "85%",
                width: "85%",
                objectFit: "contain",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              image={`${API_URL}/uploads/product-images/${service.imagefile}`}
              alt={service.servSubType_Name}
            />
          </Box>
        )}

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: 600,
              mb: 0.5,
              textTransform: "capitalize",
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {service.servSubType_Name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "12px", sm: "13px" },
              color: theme.palette.text.secondary,
              mb: 1,
              textTransform: "capitalize",
            }}
          >
            {service.serv_Name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Price: ₹{service.rate}
          </Typography>
        </CardContent>

        {/* Add to Cart Button or Quantity Selector */}
        <Box sx={{ p: 2, pt: 0 }}>
          {quantity === 0 ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSelectItem}
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                py: 1,
              }}
            >
              Add to Bucket
            </Button>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: theme.palette.primary.main,
                borderRadius: 1.5,
                overflow: "hidden",
              }}
            >
              <IconButton
                onClick={handleDecrement}
                sx={{
                  color: theme.palette.primary.contrastText,
                  borderRadius: 0,
                  px: 2,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <RemoveIcon />
              </IconButton>

              <Typography
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  fontSize: { xs: "14px", sm: "16px" },
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {quantity}
              </Typography>

              <IconButton
                onClick={handleIncrement}
                sx={{
                  color: theme.palette.primary.contrastText,
                  borderRadius: 0,
                  px: 2,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Card>

      <Snackbar
        open={toastOpen}
        autoHideDuration={1000}
        onClose={() => setToastOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

export default ServiceCard;
