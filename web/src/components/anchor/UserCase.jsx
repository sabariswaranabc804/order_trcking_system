// UserSalaryCase.js
import React from 'react';
import { Card, CardContent, Typography, Grid, Container, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Custom styles for the card and layout
const useStyles = makeStyles({
    card: {
        maxWidth: 500,
        margin: 'auto',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        borderRadius: '10px',
    },
    cardHeader: {
        backgroundColor: '#3f51b5',
        color: '#fff',
        padding: '10px',
        borderRadius: '8px 8px 0 0',
    },
    salaryItem: {
        padding: '10px 0',
    },
    label: {
        fontWeight: 'bold',
        color: '#3f51b5',
    },
});

const SalaryDetailsCard = ({ user }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <div className={classes.cardHeader}>
                <Typography variant="h5" align="center">
                    {user.name}'s Payed
                </Typography>
            </div>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography className={classes.label}>services</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{user.designation}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.label}>number of clothes</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>${user.baseSalary}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.label}>Amount</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>${user.bonus}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.label}>payment method</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{user.baseSalary }</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const UserSalaryCase = () => {
    // Example user salary data
    const user = {
        name: 'John Doe',
        designation: 'wASHING sERVICES',
        baseSalary: "G-PAY",
        bonus: 10000,
    };

    return (
        <Container>
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    User payed section
                </Typography>
                <SalaryDetailsCard user={user} />
            </Box>
        </Container>
    );
};

export default UserSalaryCase;
