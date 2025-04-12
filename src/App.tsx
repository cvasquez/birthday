import React from 'react'
import SignInForm from './components/SignInForm'
import { useAuth } from './contexts/AuthContext'
import { Paper, Typography, CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import Layout from './components/Layout'

function App() {
  const { currentUser } = useAuth()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        {currentUser ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Welcome, {currentUser.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You are now signed in. Start building your birthday website!
            </Typography>
          </Paper>
        ) : (
          <SignInForm />
        )}
      </Layout>
    </ThemeProvider>
  )
}

export default App 