import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

export default function Validate() {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const { signInWithMagicLink } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email =
    location.state?.email ?? window.localStorage.getItem("emailForSignIn");

  useEffect(() => {
    const validateLink = async () => {
      if (!email) {
        setError("No email found. Please try signing in again.");
        setIsValidating(false);
        return;
      }

      try {
        await signInWithMagicLink(email);
        // On successful validation, redirect to home
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Error validating magic link:", err);
        setError("Failed to validate magic link. Please try signing in again.");
        setIsValidating(false);
      }
    };

    validateLink();
  }, [email, signInWithMagicLink, navigate]);

  if (error) {
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/auth/login")}
          fullWidth
        >
          Back to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {isValidating ? "Validating your magic link..." : "Processing..."}
      </Typography>
    </Box>
  );
}
