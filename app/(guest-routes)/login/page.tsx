'use client'
// pages/login.tsx
import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, useToast, VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/api/createClient';

type Props = {}

const LoginPage = (props: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const toast = useToast();

  const handleLogin = async () => {
    setLoading(true);
// Inside handleLogin function
const { data: userData, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
  toast({
    title: 'Login failed',
    description: error.message,
    status: 'error',
    duration: 5000,
    isClosable: true,
  });
} else {
  const { data, error: roleError } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userData.user.id)
    .single();

  if (roleError || !data) {
    toast({
      title: 'Error fetching user role',
      description: roleError ? roleError.message : 'Role data is missing.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else {
    // Redirect based on role
    const path = data.role_id === 2 ? '/' : '/'; // Assuming '2' is the ID for 'admin'
    router.push(path);
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
        <Button colorScheme="blue" isLoading={loading} onClick={handleLogin}>
          Sign In
        </Button>
      </VStack>
    </Box>
  );
}

export default LoginPage;
