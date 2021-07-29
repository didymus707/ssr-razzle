//@ts-nocheck
import { Box, Flex, Text } from '@chakra-ui/core';
import { Meta, Story } from '@storybook/react';
import { Button } from 'app/components';
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FilePreivew = () => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null | undefined>('');

  const handleClearImage = () => {
    setPreview('');
  };

  const handleUploadPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e?.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (files: File[]) => {
    if (files[0]) {
      handleUploadPreview(files[0]);
    } else {
      return;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 5242880,
  });

  return (
    <Box>
      <Flex
        px="5rem"
        width="100%"
        height="183px"
        borderWidth="1px"
        mb={['1rem', '0']}
        flexDirection="column"
        borderColor="brand.100"
        justifyContent="center"
        backgroundPosition="center"
        bgSize="cover"
        backgroundRepeat="no-repeat"
        bgImage={`url(${preview})`}
      >
        {!preview && (
          <>
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              <Text pb="0.75rem">
                <Box as="span" fontWeight="500" textDecoration="underline">
                  Upload files here
                </Box>{' '}
                or just drag and drop
              </Text>
            </Box>
          </>
        )}
      </Flex>
      {preview && (
        <Button my="0.75rem" variant="link" textDecoration="underline" onClick={handleClearImage}>
          Clear Image
        </Button>
      )}
    </Box>
  );
};

export default {
  title: 'Design System/FilePreivew',
  component: FilePreivew,
} as Meta;

const Template: Story<any> = args => <FilePreivew {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
