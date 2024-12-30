// src/components/Login.js
import React , {useState} from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const url = `http://localhost:5000/api/login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uandp = {username , password};
    console.log(username , password)
    try {
      const response = await fetch(url , {
        method : 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,  // make sure username and password are defined
          password
        }),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Success:', data);

      if(data.success){
        navigate('/requests')
      }
    } catch (error) {
      console.error(error);
      setError(`Couldn't login`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
       <Typography variant="h4" align="center">Admin Login</Typography>
       <TextField
          label="Username"
          type="text"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" type="submit" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
