import { Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { Button, OutsideClickHandler } from 'app/components';
import Picker from 'emoji-picker-react';
import React, { useState } from 'react';

export function Emoji({
  onEmojiClick,
  iconProps = {
    size: '24px',
    name: 'inbox-compose-emoji',
  },
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <Popover closeOnBlur={false} isOpen={isOpen} onClose={close}>
      <PopoverTrigger>
        <Button
          size="xs"
          rounded="8px"
          variant="ghost"
          onClick={open}
          boxShadow="none"
          _focus={{ boxShadow: 'none' }}
        >
          <Icon {...iconProps} />
        </Button>
      </PopoverTrigger>
      <OutsideClickHandler onClickOutside={close}>
        <PopoverContent
          width="auto"
          zIndex={1500}
          borderWidth="0"
          boxShadow="none"
          maxWidth="initial"
          _focus={{ boxShadow: 'none' }}
          className="remove-focus-outline"
        >
          <Picker onEmojiClick={onEmojiClick} preload={false} />
        </PopoverContent>
      </OutsideClickHandler>
    </Popover>
  );
}
