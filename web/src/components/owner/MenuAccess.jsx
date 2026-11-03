import React from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Checkbox, Alert
} from '@mui/material';

function MenuAccess({ menuAccessData, handleMenuAccessChange, message }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Menu Access Rights</Typography>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
        )}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Menu</TableCell>
                <TableCell>Submenu</TableCell>
                <TableCell>List</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Anchor</TableCell>
                <TableCell>Customer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuAccessData.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.menu}</TableCell>
                  <TableCell>{row.submenu}</TableCell>
                  <TableCell>{row.list}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.admin}
                      onChange={(e) => handleMenuAccessChange(row.id, 'admin', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.owner}
                      onChange={(e) => handleMenuAccessChange(row.id, 'owner', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.anchor}
                      onChange={(e) => handleMenuAccessChange(row.id, 'anchor', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.customer}
                      onChange={(e) => handleMenuAccessChange(row.id, 'customer', e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default MenuAccess;