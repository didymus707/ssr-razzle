import { Avatar, Box, ModalBody, ModalCloseButton, Stack, Text, Checkbox } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import { ModalContainer, ModalContainerOptions, Button } from '../../../../components';
import { Search } from '../../../../components/Search';
import { TeamMember } from '../../settings.types';

export type AddMemberModalProps = {
  data: TeamMember[];
  isLoading?: boolean;
  onSubmit?: (ids: TeamMember['id'][]) => void;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
};

export function AddMemberModal({
  data,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddMemberModalProps) {
  const [selectedMembers, setSelectedMembers] = React.useState<TeamMember['id'][]>([]);
  const [members, setMembers] = React.useState<TeamMember[]>(data || []);

  useEffect(() => setSelectedMembers([]), [isOpen]);

  const handleSubmit = () => {
    onSubmit && onSubmit(selectedMembers);
  };

  const handleMemberSelect = (id: TeamMember['id']) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((i: string) => i !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  function handleSearch(value: string) {
    if (value) {
      const newList = members?.filter(item => {
        if (item.first_name) {
          const name = `${item.first_name} ${item.last_name}`.toLowerCase();
          return name.includes(value.toLowerCase());
        }
      });
      if (newList?.length) {
        setMembers(newList);
      } else {
        setMembers(data);
      }
    } else {
      setMembers(data);
    }
  }

  return (
    <ModalContainer onClose={onClose} isOpen={isOpen} title="Add to team">
      <ModalCloseButton size="sm" />
      <ModalBody>
        <Box marginBottom="1.5rem">
          <Search
            marginBottom="1rem"
            onChange={handleSearch}
            placeholder="Search teammates to add"
          />
          <Stack maxH="400px" overflowY="auto" spacing={4} marginY="2rem">
            {members.map((item, index) => (
              <Stack
                isInline
                key={index}
                outline="none"
                cursor="pointer"
                alignItems="center"
                paddingBottom="1rem"
                justifyContent="space-between"
                borderBottom="1px solid rgba(0,0,0,0.05)"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMemberSelect(item.id);
                }}
              >
                <Stack isInline alignItems="center" spacing="0.5rem">
                  <Checkbox
                    onClick={() => handleMemberSelect(item.id)}
                    isChecked={selectedMembers.includes(item.id)}
                  />
                  <Avatar size="xs" name={`${item.first_name} ${item.last_name}`} marginX="10px" />
                  <Text color="#333333" fontWeight="normal" fontSize="0.875rem">
                    {item.first_name} {item.last_name}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Button size="sm" variantColor="blue" isLoading={isLoading} onClick={handleSubmit}>
            Add to team
          </Button>
        </Box>
      </ModalBody>
    </ModalContainer>
  );
}
