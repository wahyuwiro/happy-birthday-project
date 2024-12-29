'use client';
import React, { useState } from 'react';
import { Button, TextField, Typography, Link, Box } from '@mui/material';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const signInResponse = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
  
        if (signInResponse?.ok) {
            window.location.href = process.env.NEXT_PUBLIC_BASE_URL ?? '/'; // Navigate to protected page
        } else {
            toast.error('Login failed. Please check your email and password!'); // Show error toast
        }
    } catch (error) {
        toast.error('Login failed. Please check your email and password!'); // Show error toast  
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxWidth="400px"
        margin="0 auto"
        padding={3}
        boxShadow={3}
        bgcolor="white"
        borderRadius={2}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>

        <Typography variant="body2" align="center" marginTop={2}>
          Don't have an account?{' '}
          <Link href="/auth/signup" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
