'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { getAllCountries } from 'countries-and-timezones';
import { signIn } from 'next-auth/react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Container,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

interface UserFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  birthday: string;
  location: string;
  timezone: string;
}

const UserForm: React.FC = () => {
const router = useRouter();
  const { register, handleSubmit, reset, setValue, watch } = useForm<UserFormInputs>();
  const [selectedCountry, setSelectedCountry] = useState("");

  const generateCountryTimezoneMap = () => {
    const allCountries = getAllCountries();
    const countryTimezoneMap: Record<string, string[]> = {};

    Object.values(allCountries).forEach((country) => {
      countryTimezoneMap[country.name] = country.timezones;
    });

    return countryTimezoneMap;
  };
  const countryTimezoneMap = generateCountryTimezoneMap();

  // Watch the selected location to update the timezone
  const location = watch("location");

  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    try {
      
        const { email, password } = data;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const signInResponse = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (signInResponse?.ok) {
                toast.success('User created and logged in successfully!');
                router.push(process.env.NEXT_PUBLIC_BASE_URL ?? "/");
            } else {
                toast.error('User created but login failed');
            }

        }else {
            toast.error('Failed to create user');
        }


      reset();
    } catch (error) {
      alert('Error creating user: ' + error);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedLocation = e.target.value as string;
    setSelectedCountry(selectedLocation);

    const timezones = countryTimezoneMap[selectedLocation];
    const timezone = timezones ? timezones[0] : "";

    setValue("timezone", timezone);
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 4, p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create User
        </Typography>

        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          {...register('firstName', { required: true })}
        />

        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          {...register('lastName', { required: true })}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          {...register('email', { required: true })}
        />

        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          {...register('password', { required: true })}
        />

        <TextField
          label="Birthday"
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register('birthday', { required: true })}
        />

        <Select
          fullWidth
          displayEmpty
          value={selectedCountry}
          {...register("location", { required: true, onChange: handleCountryChange })}
          sx={{ mt: 2, mb: 2 }}
        >
          <MenuItem value="">
            <em>Select a country</em>
          </MenuItem>
          {Object.keys(countryTimezoneMap).map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Timezone"
          fullWidth
          margin="normal"
          value={countryTimezoneMap[location] || ""}
          InputProps={{ readOnly: true }}
          sx={{ display: 'none' }}
          {...register('timezone')}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Create User
        </Button>
      </Box>
    </Container>
  );
};

export default UserForm;
