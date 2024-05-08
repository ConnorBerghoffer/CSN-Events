'use client'
import { useState, FormEvent } from 'react';
import { Input, Button, Box, Text, useToast, VStack, HStack } from '@chakra-ui/react';
import { supabase } from './api/createClient';

export const toastMessages = {
  noAccount: (toast: any) => toast({ title: 'No Account Found', description: "Please proceed to create your account.", status: 'info', duration: 9000, isClosable: true, }),
  userExists: (toast: any) => toast({ title: 'User Exists', description: "This email is already registered. Please log in.", status: 'warning', duration: 9000, isClosable: true, }),
  error: (toast: any, message: any) => toast({ title: 'Error', description: message || "There was an error processing your request.", status: 'error', duration: 9000, isClosable: true, }),
  success: (toast: any) => toast({ title: 'Account Created', description: "Your account has been successfully created. You are now logged in.", status: 'success', duration: 9000, isClosable: true,}),
  signupFailed: (toast: any, message: any) => toast({ title: 'Signup Failed', description: message || "Failed to create an account.", status: 'error', duration: 9000, isClosable: true,})
};

export default function Home() {
  const [{ email, pw, fn, ln, ac, pn, ic, sus }, setForm] = useState({ email: '', pw: '', fn: '', ln: '', ac: '', pn: '', ic: false, sus: false });
  const toast = useToast();
  

  const handleEmailCheck = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForm(prev => ({ ...prev, ic: true }));
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

    if (!user && !error) {
      setForm(prev => ({ ...prev, sus: true, ic: false }));
      toastMessages.noAccount(toast);
    } else if (error) toastMessages.error(toast, error);
     else toastMessages.userExists(toast);
    setForm(prev => ({ ...prev, ic: false }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForm(prev => ({ ...prev, ic: true }));
    const fullPhoneNumber = `${ac}${pn}`;
    const { data: user, error: authError } = await supabase.auth.signUp({ email, password: pw });
    if (user && !authError) {
      const { data: userDetails, error: userDetailsError } = await supabase.from('users').insert([{ id: user.session?.user.id, email, first_name: fn, last_name: ln, phone_number: fullPhoneNumber }]);
      const { error: userRoleError } = await supabase.from('user_roles').insert([{ user_id: user.session?.user.id, role_id: 9 }]);
      if (userDetails && !userDetailsError && !userRoleError) {
        toastMessages.success(toast);
        window.location.href = '/';
      } else toastMessages.signupFailed(toast, userDetailsError?.message || userRoleError?.message);
    } else toastMessages.signupFailed(toast, authError?.message);
    setForm(prev => ({ ...prev, ic: false }));
  };

  return (
    <Box p={4}>
      <VStack spacing={4} borderWidth="1px" borderRadius="lg" overflow="hidden" w="300px" mx="auto" my="50px" p={4}>
        <Text fontSize="xl" mb={2}>{sus ? 'Create Your Account' : 'Log In / Signup'}</Text>
        {!sus ? (
          <form onSubmit={handleEmailCheck}>
            <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} isDisabled={ic} />
            <Button mt={4} type="submit" isLoading={ic} colorScheme="blue">Continue</Button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <Input placeholder="First Name" value={fn} onChange={(e) => setForm(prev => ({ ...prev, fn: e.target.value }))} />
            <Input placeholder="Last Name" value={ln} onChange={(e) => setForm(prev => ({ ...prev, ln: e.target.value }))} />
            <HStack spacing={1}>
              <Input placeholder="Area Code" value={ac} onChange={(e) => setForm(prev => ({ ...prev, ac: e.target.value }))} width="30%" />
              <Input placeholder="Phone Number" value={pn} onChange={(e) => setForm(prev => ({ ...prev, pn: e.target.value }))} width="70%" />
            </HStack>
            <Input placeholder="Set your password" type="password" value={pw} onChange={(e) => setForm(prev => ({ ...prev, pw: e.target.value }))} />
            <Button mt={4} type="submit" isLoading={ic} colorScheme="blue">Sign Up</Button>
          </form>
        )}
      </VStack>
    </Box>
  );
}
