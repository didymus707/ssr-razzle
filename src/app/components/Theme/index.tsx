import { theme } from '@chakra-ui/core';
import { customIcons } from './icons';

export const simpuTheme = {
  ...theme,
  icons: {
    ...theme.icons,
    ...customIcons,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
  colors: {
    ...theme.colors,
    black: '#333333',
    blue: {
      50: '#faf9fe',
      100: '#f0eefd',
      200: '#d2cef9',
      300: '#8e85f1',
      400: '#6155eb',
      500: '#3525E6',
      600: '#211791',
      700: '#140c74',
      800: '#0a0748',
      900: '#03021e',
    },
    gray: {
      50: '#fafafa',
      100: '#F4F6F9',
      200: '#EBEEF2',
      300: '#DADEE3',
      400: '#A5ABB3',
      500: '#858C94',
      600: '#6D7580',
      700: '#545D69',
      800: '#394452',
      900: '#2B3A4B',
    },
    primary: '#3525E6',
    lightBlack: 'rgba(17,17,17,0.5)',
    brandBlack: '#09101D',
  },
  fonts: {
    body: 'Averta, sans-serif',
    heading: 'Averta, sans-serif',
    mono: 'Averta, sans-serif',
  },
};
