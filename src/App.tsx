import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import all route components
import Root from './routes/root';
import Index from './routes/index';
import Login from './routes/auth/login';
import Validate from './routes/auth/validate';

// Create a wrapper component that provides auth context
function AppWithAuth() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

// Define the router outside of the component to avoid recreation on each render
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'validate',
            element: <Validate />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <AppWithAuth />;
}

export default App; 