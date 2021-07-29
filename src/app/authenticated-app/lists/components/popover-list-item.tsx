import { Box, Icon, Tooltip } from '@chakra-ui/core';
import React from 'react';

type Props = {
  icon: string;
  label: string;
  color?: string;
  active?: boolean;
  onClick?: () => any;
  tooltip?: boolean;
  description?: string;
};

export const PopoverListItem = (props: Props) => {
  if (props.tooltip && props.description)
    return (
      <Tooltip
        aria-label={props.description}
        label={props.description}
        placement="right"
        fontWeight="400"
        zIndex={10000000}
      >
        <Box
          className={`list-item ${props.active ? 'active' : ''}`}
          onClick={props.onClick}
          color={props.color}
          style={{
            color: props.color,
          }}
        >
          <Icon className="icon" name={props.icon} />
          {props.label}
        </Box>
      </Tooltip>
    );

  return (
    <Box
      className={`list-item ${props.active ? 'active' : ''}`}
      onClick={props.onClick}
      color={props.color}
      style={{
        color: props.color,
      }}
    >
      <Icon className="icon" name={props.icon} />
      {props.label}
    </Box>
  );
};
