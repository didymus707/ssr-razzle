import { Box, Flex, Icon, Text } from '@chakra-ui/core';
import React from 'react';
import { Button } from '../../../../../components';
import { formatBytes } from '../../../inbox.utils';

const getIconName = (type: string): string => {
  switch (true) {
    case type.includes('image/'):
      return 'image-attachment';
    case type.includes('audio/'):
      return 'audio-attachment';
    case type.includes('video/'):
      return 'video-attachment';
    default:
      return 'doc-attachment';
  }
};

export function AttachmentItem({
  file,
  index,
  onDelete,
  onUpload,
  showDeleteButton = true,
}: {
  file: File;
  index: number;
  onClick?(): void;
  showDeleteButton?: boolean;
  onDelete(index: number): void;
  onUpload?(file: File, url: string): void;
}) {
  const { name, size, type } = file;

  // const [progress, setProgress] = useState(0);

  const handleDelete = (index: number) => {
    onDelete(index);
  };

  // useEffect(() => {
  //   async function upload() {
  //     const url = await uploadFile({
  //       file,
  //       onProgress: setProgress,
  //       responseKey: 'secure_url',
  //       url: 'https://api.cloudinary.com/v1_1/demo/image/upload',
  //       data: { upload_preset: 'docs_upload_example_us_preset' },
  //     });
  //     onUpload?.(file, url);
  //   }

  //   upload();
  // }, [file, onUpload]);

  return (
    <Flex
      my=".25rem"
      bg="#f6faff"
      maxWidth="200px"
      position="relative"
      borderRadius=".9375rem"
      ml={index === 0 ? '0' : '1.25rem'}
    >
      {/* <Flex
        right="-4px"
        width="1rem"
        rounded="50%"
        height="1rem"
        position="absolute"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress thickness={0.25} value={progress} size="1rem" />
      </Flex> */}
      <Icon name={getIconName(type)} size="3.5rem" />
      <Box pl=".625rem" pt="9px" pb="5px">
        <Text fontSize=".875rem" color="#1c2b66">
          {(name || '').length <= 10 ? name : `${name?.substring(0, 10)}...`}
        </Text>
        <Text fontSize=".75rem" color="#5a6abc" lineHeight="1.83">
          {formatBytes(size)}
        </Text>
      </Box>
      {showDeleteButton && (
        <Button
          px="0"
          ml=".125rem"
          mr=".625rem"
          height="1.5rem"
          bg="transparent"
          _hover={{
            bg: 'transparent',
          }}
          onClick={() => handleDelete(index)}
        >
          <Icon name="small-close" color="#66788a" />
        </Button>
      )}
    </Flex>
  );
}
