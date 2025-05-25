import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';
import api from '../services/api';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.getAllProblems();
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Coding Problems
      </Typography>
      <Grid container spacing={3}>
        {problems.map((problem) => (
          <Grid item xs={12} sm={6} md={4} key={problem.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {problem.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {problem.description.substring(0, 150)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/problems/${problem.id}`)}
                >
                  Solve Problem
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ProblemList; 