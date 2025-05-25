import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <CodeIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            SkillSnap
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Problems
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/submissions"
          >
            Submissions
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 