import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Birthday Website Builder
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please sign in to get started.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/auth/login')}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user.email}!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You are now signed in to the Birthday Website Builder.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </Box>
  );
} 