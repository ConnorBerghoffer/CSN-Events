import React from 'react';
import { Box, Button, Icon, VStack, Divider, useToast, Flex, Text } from '@chakra-ui/react';
import { FaCalendar, FaHome, FaSignOutAlt, FaUser, FaUserAlt, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '@/app/api/createClient';
import { useRouter } from 'next/navigation';

type Props = {}

const Sidebar: React.FC<Props> = (props) => {
  const toast = useToast();
  const router = useRouter();

  const route = (dest: string) => {
    console.log(`Routing to: ${dest}`);
    router.push(dest)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.refresh();
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
    <Box as={motion.div} initial={{ x: -100 }} animate={{ x: 0 }} paddingLeft={4} paddingY={4} bg="bgCard" color="white" minH="100vh" boxShadow="md">
      <VStack align="stretch" spacing={4}>
        <Flex flexDirection={"column"} gap={1} justify={'between'}>
          {/* <Icon as={role === 2 ? FaUserShield : FaUser} w={8} h={8} /> */}
          <Text align={'center'} marginLeft={"-4"} fontSize={'xs'}>{}</Text>
          <Divider h={8} border={'none'}/>
          <Button onClick={() => route('/')} bgColor={"primary"} color={"white"} rounded={0} roundedLeft={10}>
            <FaHome/>
          </Button>
          <Button onClick={() => route('/calendar')} bgColor={"primary"} color={"white"} rounded={0} roundedLeft={10}>
            <FaCalendar/>
          </Button>
          <Button onClick={() => route('/profile')} bgColor={"primary"} color={"white"} rounded={0} roundedLeft={10}>
            <FaUserAlt/>
          </Button>
          <Divider height={'75vh'} border={'none'}/>
          <Button onClick={handleLogout} rounded={0} roundedLeft={10} color={"white"} bgColor={"primary"} variant="solid" size="sm" mt="auto">
            <FaSignOutAlt/>
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

export default Sidebar;
