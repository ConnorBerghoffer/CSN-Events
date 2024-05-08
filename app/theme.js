'use client'
import { extendTheme } from "@chakra-ui/react";

const colors = {
  primary: '#8F6A30',
  secondary: '#000000',
  bg: '#222222',
  bgCard: '#333333',
  red: '#C13008',
  blue: '#0F62DE',
};

export const theme = extendTheme({
  colors,
  styles: {
    global: {
      // Setting the font family and background color globally
      body: {
        fontFamily: "Helvetica Neue, sans-serif",
        color: 'white',
        bg: colors.bg,
        lineHeight: 'base',
      },
      // Card component specific style
      '.card': {
        bg: colors.bgCard,
        color: 'white',
        padding: 4,
        borderRadius: 'md',
        boxShadow: 'md',
      }
    },
  },
  components: {
    Button: {
      // Example of customizing a component
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? colors.primary : colors.blue,
        }),
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});
