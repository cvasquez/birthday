import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sendMagicLink } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendMagicLink(email);
      // Show success message and instruct user to check their email
      navigate("/auth/validate", { state: { email } });
    } catch (err) {
      setError("Failed to send magic link. Please try again.");
      console.error("Error sending magic link:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sign In
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary">
        Enter your email to receive a magic link for signing in.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Sending..." : "Send Magic Link"}
      </Button>
    </Box>
  );
}
