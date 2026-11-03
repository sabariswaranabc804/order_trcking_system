import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Card, CardContent, Typography, Button } from '@mui/material';
import { useCart } from '../../../context/CartContext'; // Assuming your CartContext is set up
import axios from 'axios';
import API_URL from '../../../config';
function CartCategoryPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart([]); // Access cart items from context


  
  const [categories,setCategories]=useState([]);
  // Function to check if the cart has items of the specified category
  const isCategoryInCart = (category) => {
    return cartItems.some(item => item.serv_Id
      === category);
  };
 // console.log("cart",cartItems);
  
  const handleCategoryClick = (category) => {
    navigate(`/cart?category=${category}`);
  };

  useEffect(() => {
    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/service/all`);
            setCategories(response.data); // Assuming response contains the services array
        } catch (error) {
           // console.error('Error fetching services:', error);
        }
    };

    fetchServices();
}, []);
//console.log("category",categories);


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select a Service Category
      </Typography>
      <Grid container spacing={3}>
        {categories.map((category,index) => (
          // Only render the category card if items of that category are in the cart
          isCategoryInCart(category.serv_Id
          ) && (
            <Grid item xs={12} sm={6} md={6} key={category.serv_Id}>
              <Card sx={ { backgroundColor:"rgba(255, 247, 240, 0.8)"}}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {category.serv_Name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {category.serv_Description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '10px' }}
                    sx={ { backgroundColor:"orange"}}
                    onClick={() => handleCategoryClick(category.serv_Id)}
                  >
                    View {category.serv_Name}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )
        ))}
      </Grid>
    </Container>
  );
}

export default CartCategoryPage;
