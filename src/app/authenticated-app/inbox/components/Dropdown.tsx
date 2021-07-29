import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, Text, Flex, PopoverContent, PopoverBody, Icon, PseudoBox } from '@chakra-ui/core';
import { getFlagEmoji } from '../inbox.utils';

export function Dropdown({ list, selected, setSelected }: {
  list: any[],
  selected: any
  setSelected: (v: any) => void
}) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const handleSelect = (item: any) => {
    setIsOpen(false);
    setSelected(item);
  };

  useEffect(() => {
    if (!selected) {
      setSelected(list[0])
    }
  }, [list, selected, setSelected])

  return (
    <Popover
      onClose={close}
      isOpen={isOpen}
    >
      <PopoverTrigger>
        <Flex
          tabIndex={0}
          role="button"
          aria-label="Some box"
          alignItems="center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Text fontSize="1rem">{getFlagEmoji(selected?.isoCountry)}</Text>
          <Text marginLeft=".375rem" marginRight="0.625rem">{selected?.userDetail?.platform_nick}</Text>
          <Icon name="triangle-down" size=".5rem" />
        </Flex>
      </PopoverTrigger>

      <PopoverContent zIndex={1500}>
        <PopoverBody>
          {list.map(({ isoCountry, uuid, userDetail: { platform_nick } }, index) => (
            <PseudoBox
              key={uuid}
              display="flex"
              cursor="pointer"
              as="div"
              marginTop={index === 0 ? '0' : '.35rem'}
              _hover={{ bg: 'rgba(119, 131, 253, 0.05)', cursor: 'pointer', outline: 0, border: 'none' }}
              _focus={{ bg: 'rgba(119, 131, 253, 0.05)', outline: 0, cursor: 'pointer', border: 'none' }}
              _active={{ bg: 'rgba(119, 131, 253, 0.05)', outline: 0, cursor: 'pointer', border: 'none' }}
              tabIndex={0}
              onClick={() => handleSelect(list[index])}
              bg={selected?.uuid === uuid ? 'rgba(61, 80, 223, 0.05)' : 'initial'}
            >
              <Text fontSize="1rem">{getFlagEmoji(isoCountry)}</Text>
              <Text marginLeft="0.625rem">{platform_nick}</Text>
            </PseudoBox>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
