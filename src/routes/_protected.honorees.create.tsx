import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  Chip,
  Stack,
  TextField,
  IconButton,
  FormControl,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Timestamp } from 'firebase/firestore';
import {
  object,
  string,
  array,
  minLength,
  maxLength,
  custom,
  safeParse,
  pipe,
  type InferInput,
} from 'valibot';
import { HonoreeService } from '../services/honoree.service';
import { useAuth } from '../contexts/AuthContext';
import { DatePicker } from '@mui/x-date-pickers';

// Define a schema for the interest items
const interestItemSchema = object({
  id: pipe(string(), minLength(1, 'Interest ID is required')),
  value: pipe(
    string(),
    minLength(1, 'Interest cannot be empty'),
    maxLength(100, 'Interest is too long')
  ),
});

// Define a schema for the form data
const honoreeFormSchema = object({
  name: pipe(string(), minLength(1, 'Name is required'), maxLength(100, 'Name is too long')),
  birthdate: custom<Timestamp>(
    value =>
      value !== null &&
      value instanceof Timestamp &&
      !isNaN(value.toDate().getTime()) &&
      value.toDate() > new Date(1900, 0, 1),
    'Valid birthdate is required (after 1900)'
  ),
  interests: pipe(array(interestItemSchema), minLength(0, 'Interests must be an array')),
});

// Type for the form data
type HonoreeFormData = InferInput<typeof honoreeFormSchema>;

// Type for a single interest
type Interest = InferInput<typeof interestItemSchema>;

function isFormKey(str: string): str is keyof HonoreeFormData {
  return str in honoreeFormSchema.entries;
}

export default function CreateHonoree() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const honoreeService = new HonoreeService();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<HonoreeFormData>({
    name: '',
    birthdate: Timestamp.now(),
    interests: [],
  });

  const [newInterest, setNewInterest] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof HonoreeFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isFormKey(name)) {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear error when field is updated
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, birthdate: Timestamp.fromDate(date as Date) }));

    // Clear error when birthdate is updated
    if (validationErrors.birthdate) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.birthdate;
        return newErrors;
      });
    }
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      const newInterestItem: Interest = {
        id: Date.now().toString(),
        value: newInterest.trim(),
      };
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterestItem],
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest.id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const result = safeParse(honoreeFormSchema, formData);

    if (!result.success) {
      // Format validation errors for display
      const errors: Record<string, string> = {};

      result.issues.forEach(issue => {
        const path = issue.path?.[0]?.key as string;
        if (path) {
          errors[path] = issue.message;
        }
      });

      setValidationErrors(errors);
      return false;
    }

    // Clear any existing errors
    setValidationErrors({});
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Convert form data to Honoree format
      const honoreeData = {
        firstName: formData.name,
        birthDate: formData.birthdate,
        interests: formData.interests.map(interest => interest.value),
      };

      // Save to database using the service
      await honoreeService.createHonoree(user.uid, honoreeData);

      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        name: '',
        birthdate: Timestamp.now(),
        interests: [],
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/honorees');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create honoree. Please try again.';

      setError(errorMessage);
      console.error('Error creating honoree:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Honoree
        </Typography>

        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />

            <FormControl error={!!validationErrors.birthdate}>
              <DatePicker
                name="birthdate"
                label="Birthdate"
                value={formData.birthdate.toDate()}
                onChange={handleDateChange}
              />
              <FormHelperText>The honoree&apos;s birthdate</FormHelperText>
            </FormControl>

            {/* Interests Section */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Interests
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {formData.interests.map(interest => (
                  <Chip
                    key={interest.id}
                    label={interest.value}
                    deleteIcon={
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    }
                    onDelete={() => removeInterest(interest.id)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Add interest"
                  value={newInterest}
                  onChange={e => setNewInterest(e.target.value)}
                  fullWidth
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={addInterest}>
                  Add
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Honoree'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Honoree created successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
