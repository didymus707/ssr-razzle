import React, { useState, ChangeEvent, useCallback, KeyboardEvent } from 'react';
import { SortableElement, SortableContainer } from 'react-sortable-hoc';
import { PaymentItemProps, PaymentListProps } from '../../inbox.types';
import { Box, Flex, Input, IconButton, Stack } from '@chakra-ui/core';
import { DragHandle, Button } from 'app/components';
import { formatToCurrency } from '../../inbox.utils';

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

export const PaymentItem = SortableElement(
  ({
    id,
    name,
    amount,
    showControls: sc,
    onUpdate,
    onDelete,
    index,
    ...props
  }: PaymentItemProps) => {
    const [isDisplay, setIsDisplay] = useState(false);
    const showControls = sc && isDisplay;

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>): void => {
        const { key, keyCode } = e;

        if (
          (amount === 0 && !VALID_FIRST.test(key)) ||
          (amount !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
        ) {
          return;
        }

        const valueString = amount.toString();
        let nextValue: number;

        if (keyCode !== DELETE_KEY_CODE) {
          const nextValueString: string = amount === 0 ? key : `${valueString}${key}`;
          nextValue = Number.parseInt(nextValueString, 10);
        } else {
          const nextValueString = valueString.slice(0, -1);
          nextValue = nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
        }

        if (nextValue > Number.MAX_SAFE_INTEGER) {
          return;
        }

        onUpdate && onUpdate('amount', nextValue.toString());
      },
      [onUpdate, amount],
    );

    const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
      onUpdate && onUpdate(name, value);

    return (
      <Box
        onMouseEnter={() => setIsDisplay(true)}
        onMouseLeave={() => setIsDisplay(false)}
        paddingX="2.5rem"
      >
        <Flex alignItems="center" position="relative" {...props}>
          {showControls && (
            <Button
              left="-2rem"
              variant="ghost"
              padding="0"
              minWidth="auto"
              height="1.5rem"
              width="1.5rem"
              position="absolute"
              zIndex={10000000}
              cursor="grab"
              _active={{ cursor: 'grabbing' }}
            >
              <DragHandle />
            </Button>
          )}

          <Input
            backgroundColor="#f6fafd"
            fontSize=".875rem"
            padding=".625rem 1rem"
            onChange={handleChange}
            placeholder="Reason for payment"
            type="text"
            value={name}
            name="name"
            flex={307}
          />

          <Input
            backgroundColor="#f6fafd"
            fontSize=".875rem"
            padding=".625rem 1rem"
            marginLeft=".625rem"
            placeholder="Amount…"
            name="amount"
            flex={157}
            inputMode="numeric"
            onKeyDown={handleKeyDown}
            onChange={() => {}}
            value={formatToCurrency(amount)}
          />

          {showControls && (
            <Box right="-2rem" position="absolute" zIndex={10000000}>
              <IconButton
                size="xs"
                icon="delete"
                variant="ghost"
                aria-label="close"
                onClick={() => onDelete()}
              />
            </Box>
          )}
        </Flex>
      </Box>
    );
  },
);

export const PaymentList = SortableContainer(
  ({ onDelete, onUpdate, list: l, ...props }: PaymentListProps) => {
    const list = l || [];
    return (
      <Stack {...props}>
        {list.map((item, index) => (
          <PaymentItem
            key={item.id}
            index={index}
            showControls={list.length > 1}
            onDelete={() => onDelete && onDelete(index)}
            onUpdate={(name: string, value: string) => onUpdate && onUpdate(name, value, index)}
            {...item}
          />
        ))}
      </Stack>
    );
  },
);
