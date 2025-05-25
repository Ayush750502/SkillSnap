import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../services/api';

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.getProblemById(id);
        setProblem(response.data);
      } catch (error) {
        setError('Error loading problem details');
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.submitSolution(id, language, code);
      setSuccess('Solution submitted successfully!');
      setCode('');
    } catch (error) {
      setError('Error submitting solution. Please try again.');
      console.error('Error submitting solution:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!problem) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Problem not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {problem.title}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          {problem.description}
        </Typography>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          label="Your Solution"
          variant="outlined"
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting || !code.trim()}
          sx={{ mr: 2 }}
        >
          {submitting ? <CircularProgress size={24} /> : 'Submit Solution'}
        </Button>
      </Box>

      {problem.sampleSolution && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Sample Solution
          </Typography>
          <SyntaxHighlighter
            language={language}
            style={dracula}
            showLineNumbers
          >
            {problem.sampleSolution}
          </SyntaxHighlighter>
        </Box>
      )}
    </Container>
  );
}

export default ProblemDetail; 