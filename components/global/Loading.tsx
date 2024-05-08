import { Box, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoadingScreen = () => {
  return (
    <MotionBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </MotionBox>
  );
};

export default LoadingScreen;
