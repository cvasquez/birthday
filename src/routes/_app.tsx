import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Menu,
  IconButton,
  MenuItem,
  Link,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import { AccountCircle } from '@mui/icons-material';

export default function AppLayout() {
  const { user } = useAuth();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Birthday Website Builder
          </Typography>
          {user && (
            <>
              <IconButton color="inherit" onClick={e => setAnchorElement(e.currentTarget)}>
                <AccountCircle />
              </IconButton>
              <Menu
                open={!!anchorElement}
                anchorEl={anchorElement}
                onClose={() => setAnchorElement(null)}
              >
                <MenuItem>
                  <Link component={RouterLink} to="/honorees">
                    Honorees
                  </Link>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
