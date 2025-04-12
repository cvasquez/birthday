import React, { useEffect } from 'react'
import SignInForm from './components/SignInForm'
import { useAuth } from './contexts/AuthContext'
import { Box, Button, Typography, CircularProgress } from '@mui/material'
import Layout from './components/Layout'

function App() {
  const { user, signOut, signInWithMagicLink } = useAuth()
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    // Check if this is a magic link sign-in
    const email = window.localStorage.getItem('emailForSignIn')
    if (email) {
      signInWithMagicLink(email)
        .catch((error) => {
          console.error('Error signing in with magic link:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [signInWithMagicLink])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      {user ? (
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
            sx={{ mt: 2 }}
          >
            Sign Out
          </Button>
        </Box>
      ) : (
        <SignInForm />
      )}
    </Layout>
  )
}

export default App 