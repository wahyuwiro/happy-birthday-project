import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { getAllCountries } from 'countries-and-timezones';
import { signIn } from 'next-auth/react';
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
      // await axios.post('http://localhost:3001/user', data);

      const { email, password } = data;
      // Automatically sign in the user after creation
      const signInResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResponse?.ok) {
        alert('User created and logged in successfully!');
        window.location.href = '/'; // Navigate to protected page
      } else {
        alert('User created but login failed.');
      }

      reset();
    } catch (error) {
      alert('Error creating user: ' + error);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = e.target.value;
    setSelectedCountry(selectedLocation);
  
    // Get the first timezone or default to an empty string
    const timezones = countryTimezoneMap[selectedLocation];
    const timezone = timezones ? timezones[0] : "";
  
    setValue("timezone", timezone); // Update the timezone field
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          Create User
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            {...register('firstName', { required: true })}
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            {...register('lastName', { required: true })}
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            {...register('password', { required: true })}
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter password"
          />
        </div>        
        <div>
          <label className="block text-sm font-medium text-gray-700">Birthday</label>
          <input
            {...register('birthday', { required: true })}
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <select
            {...register("location", { required: true })}
            onChange={handleCountryChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a country</option>
            {Object.keys(countryTimezoneMap).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className='hidden'>
          <label className="block text-sm font-medium text-gray-700">Timezone</label>
          <input
            {...register('timezone', { required: false })}
            type="text"
            value={countryTimezoneMap[location] || ""}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
