import * as React from 'react';
import {
  Box,
  BoxProps,
  Divider,
  List,
  ListItem,
  PseudoBoxProps,
  Link,
  LinkProps,
} from '@chakra-ui/core';

export const SidebarHeader = ({
  theme,
  children,
  ...rest
}: {
  theme?: any;
  children: React.ReactNode;
} & BoxProps) => {
  return (
    <Box {...theme['Header']} {...rest}>
      {children}
    </Box>
  );
};

export const SidebarContent = ({
  theme,
  children,
  ...rest
}: { theme?: any; children: React.ReactNode } & BoxProps) => {
  return (
    <Box {...theme['Content']} {...rest} flexDirection="column">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme });
        }
      })}
    </Box>
  );
};

export const SidebarMenu = ({
  theme,
  children,
  ...rest
}: { theme?: any; children: React.ReactNode } & BoxProps) => {
  return (
    <List {...theme['Menu']} {...rest}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme });
        }
      })}
    </List>
  );
};

export const SidebarMenuItem = ({
  theme,
  children,
  ...rest
}: {
  theme?: any;
  children: React.ReactNode;
} & PseudoBoxProps) => {
  return (
    <ListItem {...theme['MenuItem']} {...rest}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme });
        }
      })}
    </ListItem>
  );
};

export const SidebarMenuLink = ({
  theme,
  children,
  ...rest
}: {
  link?: any;
  theme?: any;
  children: React.ReactNode;
} & LinkProps) => {
  return (
    <Link {...theme['MenuLink']} {...rest}>
      {children}
    </Link>
  );
};

export const SidebarFooter = ({
  theme,
  children,
  ...rest
}: { theme?: any; children: React.ReactNode } & BoxProps) => {
  return (
    <Box zIndex={10} bottom={0} {...theme['Footer']} {...rest}>
      {children}
    </Box>
  );
};

export const SidebarDivider = (
  props: Omit<BoxProps, 'aria-orientation'> & {
    orientation?: BoxProps['aria-orientation'];
  },
) => {
  return <Divider {...props} />;
};

export const Sidebar = (props: { theme?: any; children: React.ReactNode } & BoxProps) => {
  const { theme, children, ...rest } = props;
  return (
    <Box
      zIndex={10}
      height="100vh"
      position="fixed"
      {...theme['Sidebar']['Container']}
      display="flex"
      flexDirection="column"
      {...rest}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme: theme['Sidebar'] });
        }
      })}
    </Box>
  );
};
