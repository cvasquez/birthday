import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Honorees() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Honorees
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/honorees/create')}>
          Add New Honoree
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Outlet />
      </Paper>
    </Box>
  );
}
