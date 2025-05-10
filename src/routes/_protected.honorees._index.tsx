import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { HonoreeService } from 'src/services/honoree.service';

export default function HonoreesIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ['honorees', user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      // We can use this non-null assertion because the `enabled` property requires it
      return new HonoreeService().getHonorees(user!.uid);
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error.message}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1">
          Your Honorees
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/honorees/create')}>
          Add New Honoree
        </Button>
      </Box>

      {data?.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You haven&apos;t added any honorees yet.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/honorees/create')}>
            Create Your First Honoree
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data?.map(honoree => (
            <Grid key={honoree.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {honoree.firstName}
                  </Typography>

                  {honoree.birthDate && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Birthday: {honoree.birthDate.toDate().toLocaleDateString()}
                    </Typography>
                  )}

                  {honoree.interests && honoree.interests.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Interests:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {honoree.interests.map((interest, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {interest}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/honorees/${honoree.id}`)}>
                    View Details
                  </Button>
                  <Button size="small" onClick={() => navigate(`/honorees/${honoree.id}/edit`)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
