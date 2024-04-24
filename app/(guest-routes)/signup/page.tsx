'use client'
// pages/signup.tsx
import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, useToast, VStack
} from '@chakra-ui/react';
import { supabase } from '@/app/api/createClient';


const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSignUp = async () => {
    setLoading(true);
// Inside handleSignUp function after successful signup
const { data: userData, error } = await supabase.auth.signUp({ email, password });
if (error) {
  toast({
    title: 'Error signing up',
    description: error.message,
    status: 'error',
    duration: 5000,
    isClosable: true,
  });
} else {
  // Assign default role 'user'
  const { data, error: roleError } = await supabase
    .from('user_roles')
    .insert([{ user_id: userData.user?.id, role_id: 1 }]); // Assuming '1' is the ID for 'user'

  if (roleError) {
    toast({
      title: 'Error assigning role',
      description: roleError.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else {
    toast({
      title: 'Account created',
      description: 'Please check your email to verify your account.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }
}

    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
      <VStack spacing={4} bg="white" p={8} borderRadius="md" boxShadow="base" width={'50vw'}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" isLoading={loading} onClick={handleSignUp}>
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
}

export default SignupPage;
