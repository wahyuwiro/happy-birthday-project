'use client';
import {
    Box,
    Card,
    CardContent,
    FormControl,
    Grid,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    InputAdornment,
    Button,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { getAllCountries } from 'countries-and-timezones';

interface ProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthday?: string;
    location?: string;
    timezone?: string;
  }
  
  const initialForm: ProfileForm = {
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    password: '',
    location: '',
    timezone: ''
  };

  
const Profile: FC = () => {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<ProfileForm>(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<any>({}); // To hold errors

    const generateCountryTimezoneMap = () => {
        const allCountries = getAllCountries();
        const countryTimezoneMap: Record<string, string[]> = {};
      
        Object.values(allCountries).forEach((country) => {
          countryTimezoneMap[country.name] = country.timezones;
        });
      
        return countryTimezoneMap;
    };
    const countryTimezoneMap = generateCountryTimezoneMap();

    const handleCountryChange = (e: SelectChangeEvent<string>) => {
        const selectedLocation = e.target.value;
      
        const timezones = countryTimezoneMap[selectedLocation];
        const timezone = timezones ? timezones[0] : "";
      
        setFormData((prev) => ({
          ...prev,
          timezone,
          location: selectedLocation,
        }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    };
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const fetchData = async () => {
        try {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${session?.user?.id}`;
          const response = await fetch(url);
          const data = await response.json();
          const updatedFormData: ProfileForm = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '', // Format as YYYY-MM-DD
            location: data.location || '',
            timezone: data.timezone || ''
          };
          setFormData(updatedFormData);
        } catch (error) {
            console.log('Error fetching menu:', error);
        }
    };
    
    useEffect(() => {
        console.log('session', session);
        if(session?.user?.id) {
            fetchData();
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${session?.user?.id}`;
            console.log('formData:', formData);
            const response = await fetch(url, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success('User profile updated successfully!');
                const data = await response.json();
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        ...data
                    }
                })
                router.push(process.env.NEXT_PUBLIC_BASE_URL ?? "/");

            }else {
                console.log('Failed to Update user profile');
            }
      
        } catch (error) {

        }
    };


    return (
        <Box component="form" noValidate autoComplete="off" p={2}>
            <Card
                sx={{
                    borderRadius: "16px",
                    padding: "24px 32px 32px 32px",
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "16px",
                            flexDirection: "column",
                            gap: "8px",
                            borderBottom: "0.5px solid rgba(119, 122, 125, 0.50)"
                        }}
                    >
                        <Typography variant="h6">
                            Profile
                        </Typography>
                        <Typography variant="body1" className="desc">
                            Manage your personal information to ensure your profile is always up to date.
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth margin="normal"
                                label="First Name"
                                name='firstName'
                                value={formData?.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth margin="normal"
                                label="Last Name"
                                name='lastName'
                                value={formData?.lastName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth margin="normal"
                                label={"Email Address"}
                                name='email'
                                value={formData?.email}
                                onChange={handleChange}
                                className="z-50"
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                        <TextField
                            name='password'
                            onChange={handleChange}
                            fullWidth
                            error={errors?.password ? true: false}
                            helperText={errors?.password ? errors?.password : ""}
                            margin="normal"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton
                                    onClick={() => toggleShowPassword()}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            ),
                            }}
                        />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Select
                                fullWidth
                                displayEmpty
                                value={formData?.location}
                                onChange={handleCountryChange}
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



                            {/* <TextField
                                fullWidth margin="normal"
                                label={"Location"}
                                name='location'
                                value={formData?.location}
                                onChange={handleChange}
                                className="z-50"
                            /> */}

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Birthday"
                                name='birthday'
                                type="date"
                                value={formData?.birthday}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ alignSelf: 'center' }}
                                onClick={handleSubmit}
                            >
                                Update
                            </Button>

                        </Grid>                            
                    </Grid>

                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
