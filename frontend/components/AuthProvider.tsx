// components/AuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure the styles are imported

const cache = createCache({ key: 'css', prepend: true });

interface AuthProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    mode: 'light', // Change to 'dark' for a dark theme
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure the component is mounted before rendering session-dependent content
    setIsMounted(true);      
  }, []);

  if (!isMounted) return null; // Return nothing until mounted to avoid SSR hydration issues


  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isMounted && (
        <SessionProvider>
          <Navbar />
          <div className="p-4">
            {children}
            <ToastContainer />
          </div>
        </SessionProvider>
        )}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default dynamic(() => Promise.resolve(AuthProvider), { ssr: false });
