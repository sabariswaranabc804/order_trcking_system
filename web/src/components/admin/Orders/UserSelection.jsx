import React from "react";
import { TextField, Grid, Card, Typography, Autocomplete } from "@mui/material";

const UserSelection = ({ users, selectedUser, handleUserChange, userRef, userError }) => {
  return (
    <Grid item xs={6}>
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Select User</Typography>
        <Autocomplete 
          freeSolo
          options={users.map(user => user.label)}
          value={selectedUser}
          onInputChange={handleUserChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Username"
              fullWidth
              inputRef={userRef}
              error={userError}
              helperText={userError ? "User not found" : ""}
            />
          )}
        />
      </Card>
    </Grid>
  );
};

export default UserSelection;