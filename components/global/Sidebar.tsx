import React from 'react';
import { Box, Button, Icon, VStack, Divider, useToast } from '@chakra-ui/react';
import { FaUser, FaUserShield } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '@/app/providers/RoleContext';
import { supabase } from '@/app/api/createClient';

type Props = {}

const Sidebar: React.FC<Props> = (props) => {
  const { role } = useRole();
  const toast = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Optionally reload the page after successful logout
      window.location.reload();
    } else {
      toast({
        title: 'Error logging out',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as={motion.div} initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: -100 }}
      p={5} bg="blue.500" color="white" minH="100vh" boxShadow="md">
      <VStack align="stretch" spacing={4}>
        <Icon as={role === 2 ? FaUserShield : FaUser} w={8} h={8} />
        <Divider borderColor="gray.200" />
        <Button onClick={handleLogout} colorScheme="red" variant="solid" size="sm" mt="auto">
          Logout
        </Button>
      </VStack>
    </Box>
  );
}

export default Sidebar;
