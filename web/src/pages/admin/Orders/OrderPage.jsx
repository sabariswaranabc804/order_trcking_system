import React from 'react';
import {
  Card, CardContent, CardMedia, Typography,
  Grid, Container, Button, CardActions,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ title, description, image, path }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    

<CardActions>
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Button
      size="small"
      variant="contained"
      onClick={() => navigate(path)}
    >
      Open
    </Button>
  </Box>
</CardActions>

    </Card>
  );
};

const ServicesPage = () => {
  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <ServiceCard
            title="Self-Services"
            description="Customer drops and collects clothes directly at our office — no deliveryman involved."
            image="https://c8.alamy.com/comp/2R7GHTY/delivery-man-giving-a-pile-of-folded-clothes-from-dry-cleaners-to-a-young-man-isolated-on-a-white-background-2R7GHTY.jpg"
            path="/admin/walk-way"
          />
        </Grid>
        <Grid item>
          <ServiceCard
            title="One Way Services"
            description="Customer drops clothes directly at our office. After washing, our deliveryman delivers the clothes back to your doorstep."
            image="https://www.sultancavesuites.com/uploads/2022/09/2_op.png"
            path="/admin/one-way"
          />
        </Grid>
        <Grid item>
          <ServiceCard
            title="Two Way Services"
            description="Our team collects clothes from your home with help of deliverymen."
            image="https://c8.alamy.com/comp/2R7GHTY/delivery-man-giving-a-pile-of-folded-clothes-from-dry-cleaners-to-a-young-man-isolated-on-a-white-background-2R7GHTY.jpg"
            path="/admin/two-way"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServicesPage;
