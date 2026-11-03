import React from 'react';
import {
    Box, Button, Card, CardContent, Typography, Grid, Dialog, DialogActions, 
    DialogContent, DialogTitle, TextField, IconButton, Select, MenuItem, 
    FormControl, InputLabel
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-toastify/dist/ReactToastify.css';
import useProductManagement from '../../../hooks/admin/useProductManagement';
import API_URL from '../../../config'; // Still needed for image URLs

const ProductPage = () => {
    const {
        services,
        filteredProducts,
        filteredService,
        setFilteredService,
        productName,
        setProductName,
        productPrice,
        setProductPrice,
        serviceName,
        setServiceName,
        handleImageUpload,
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        editMode,
        editIndex,
        handleAddProduct,
        handleEditProduct,
        handleDeleteProduct
    } = useProductManagement();

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Product List
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={handleOpenDialog}
                    sx={{ marginTop: 3 }}
                >
                    Add Product
                </Button>
            </Box>

            {/* Filter by Service Name */}
            <FormControl fullWidth sx={{ marginBottom: 3, marginTop: 3 }}>
                <Select
                    value={filteredService}
                    onChange={(e) => setFilteredService(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="All">
                        <em>All Services</em>
                    </MenuItem>
                    {services.map((s, index) => (
                        <MenuItem key={index} value={s.serv_Name.toLowerCase()}>{s.serv_Name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Display filtered products */}
            <Grid container spacing={2}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    {product.imagefile && (
                                        <img
                                            src={`${API_URL}/uploads/product-images/${product.imagefile}`}
                                            alt={product.imagefile}
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <Typography variant="h6">{product.servSubType_Name}</Typography>
                                    <Typography>Price: ₹{product.rate}</Typography>
                                    <Typography>Service: {product.serv_Name}</Typography>
                                    <Typography>Created on: {new Date(product.created_On).toLocaleDateString()}</Typography>

                                    {/* Edit and Delete Buttons */}
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <IconButton onClick={() => handleEditProduct(product)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteProduct(product)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No products found for the selected service.</Typography>
                )}
            </Grid>

            {/* Alert Dialog for Adding/Editing Product */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editIndex !== null ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Product Price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Select for Service Name */}
                    {!editMode ? (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Service Name</InputLabel>
                            <Select
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Select Service</em>
                                </MenuItem>
                                {services.map((s, index) => (
                                    <MenuItem key={index} value={s.serv_Name.toLowerCase()}>{s.serv_Name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : null}

                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Upload Image
                        <input type="file" hidden onChange={handleImageUpload} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddProduct} color="primary">
                        {editMode ? 'Update Product' : 'Add Product'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductPage;