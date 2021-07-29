import React from 'react';
import { Box, BoxProps } from '@chakra-ui/core';

type Props = {
  onClickOutside(): void;
  children: React.ReactNode;
} & BoxProps;

export const OutsideClickHandler = ({ onClickOutside, children, style, ...props }: Props) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef?.current?.contains(e.target)) {
      onClickOutside();
    }
  };

  return (
    <Box className="OutsideClickHandler" display="inline-block" ref={wrapperRef} {...props}>
      {children}
    </Box>
  );
};
