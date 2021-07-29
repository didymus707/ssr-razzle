import React from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Editable,
  EditablePreview,
  EditableInput,
  IconButton,
  EditableProps,
  IconButtonProps,
  Tooltip,
} from '@chakra-ui/core';

const Container = styled(Box)`
  &:hover {
    .button {
      opacity: 1;
    }
  }
`;

export const TableCellClickable = (
  props: Omit<EditableProps, 'children'> & {
    url?: string;
    target?: string;
    inputType?: string;
    isInvalid?: boolean;
    tooltipLabel?: string;
    errorMessage?: string;
    icon?: IconButtonProps['icon'];
  }
) => {
  const {
    url,
    icon,
    value,
    target,
    inputType,
    isInvalid,
    tooltipLabel,
    errorMessage,
    isPreviewFocusable,
    ...rest
  } = props;
  const inputBorderStyle = isInvalid
    ? {
        _focus: {
          boxShadow: 'none',
          borderWidth: '2px',
          borderColor: 'red.500',
        },
      }
    : {};

  return (
    <Container height="100%" position="relative">
      <Editable
        value={value}
        height="100%"
        placeholder={isPreviewFocusable ? 'Click to edit' : ''}
        isPreviewFocusable={isPreviewFocusable}
        {...rest}
      >
        {({ isEditing }: { isEditing: boolean }) => (
          <>
            <EditablePreview
              marginX="0"
              height="100%"
              display="block"
              padding="0.5rem"
              backgroundColor={
                isPreviewFocusable ? 'rgba(61,80,223,0.06)' : 'transparent'
              }
              border={isPreviewFocusable ? '2px solid #2034c5' : 'none'}
              _hover={
                isPreviewFocusable
                  ? {
                      cursor: 'pointer',
                    }
                  : {}
              }
            />
            <EditableInput
              //@ts-ignore
              type={inputType}
              marginX="0"
              padding="0.5rem"
              lineHeight="17px"
              borderRadius="5px"
              _active={{
                boxShadow: 'none',
                borderWidth: '2px',
                borderColor: '#2034c5',
              }}
              _focus={{
                boxShadow: 'none',
                borderWidth: '2px',
                borderColor: '#2034c5',
              }}
              {...inputBorderStyle}
            />
            {!isEditing && value && icon && tooltipLabel && !isInvalid && (
              <Tooltip
                placement="top"
                fontSize="0.75rem"
                label={tooltipLabel}
                aria-label={tooltipLabel}
              >
                <IconButton
                  as="a"
                  size="xs"
                  //@ts-ignore
                  href={url}
                  icon={icon}
                  opacity={0}
                  zIndex={100}
                  top="0.5rem"
                  right="0.5rem"
                  //@ts-ignore
                  target={target}
                  aria-label="link"
                  className="button"
                  position="absolute"
                  transition="all 0.2s"
                />
              </Tooltip>
            )}
          </>
        )}
      </Editable>
    </Container>
  );
};
