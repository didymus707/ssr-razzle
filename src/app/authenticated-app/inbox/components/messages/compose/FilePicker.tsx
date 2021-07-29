import { Icon, useToast } from '@chakra-ui/core';
import { FilePickerProps } from 'app/authenticated-app/inbox/inbox.types';
import { getChannelComposeRules } from 'app/authenticated-app/inbox/inbox.utils';
import { Button, ToastBox } from 'app/components';
import React from 'react';
import { useDropzone } from 'react-dropzone';

export function FilePicker({
  files,
  channel,
  setFiles,
  textAreaRef,
  iconProps = {
    size: '24px',
    name: 'inbox-compose-attachment',
  },
}: FilePickerProps) {
  const toast = useToast();
  const composeRule = getChannelComposeRules(channel) || {
    multiple: false,
    meta: {
      default: {
        size: Infinity,
        duration: Infinity,
      },
    },
  };

  const handleChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const filesToBeAttached: File[] = [];
      const { multiple, meta } = composeRule;

      Array.from(acceptedFiles).forEach(async file => {
        if (
          !files.some(
            ({ name, size, type }: { name: string; size: number; type: string }) =>
              name === file.name && size === file.size && type === file.type,
          )
        ) {
          const fileType = file.type.split('/')[0];
          const validationRule = meta[fileType] || meta.default;

          if (validationRule) {
            const { size, duration = Infinity } = validationRule;

            switch (fileType) {
              case 'video': {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                  window.URL.revokeObjectURL(video.src);
                  const isValid = file.size <= size && video.duration <= duration;

                  if (channel === 'whatsapp') {
                    toast({
                      position: 'bottom-left',
                      render: ({ onClose }) => (
                        <ToastBox
                          onClose={onClose}
                          message="Cannot send video on WhatsApp channel"
                        />
                      ),
                    });
                  } else if (isValid) {
                    if (multiple) {
                      setFiles([...files, file]);
                    } else {
                      setFiles([file]);
                    }
                  } else {
                    let errorMessage = 'Video format not supported';

                    if (file.size > size) {
                      errorMessage = 'Video duration is too long';
                    }

                    if (file.size > size) {
                      errorMessage = 'Video is too large';
                    }

                    toast({
                      position: 'bottom-left',
                      render: ({ onClose }) => (
                        <ToastBox onClose={onClose} message={errorMessage} />
                      ),
                    });
                  }
                };

                video.src = URL.createObjectURL(file);
                break;
              }

              case 'image': {
                if (file.type === 'image/gif' && channel === 'whatsapp') {
                  toast({
                    position: 'bottom-left',
                    render: ({ onClose }) => (
                      <ToastBox onClose={onClose} message="Cannot send gif on WhatsApp channel" />
                    ),
                  });
                  break;
                }
              }
              // eslint-disable-next-line no-fallthrough
              default: {
                if (file.size <= size) {
                  filesToBeAttached.push(file);
                } else {
                  toast({
                    position: 'bottom-left',
                    render: ({ onClose }) => (
                      <ToastBox
                        onClose={onClose}
                        message={`${fileType === 'image' ? 'Image' : 'File'} is too large`}
                      />
                    ),
                  });
                }

                break;
              }
            }
          }
        }
      });

      if (multiple) {
        setFiles([...files, ...filesToBeAttached]);
      } else {
        setFiles(filesToBeAttached);
      }

      textAreaRef?.current?.focus();
    }
  };

  const { getInputProps, open } = useDropzone({
    onDrop: handleChange,
    accept: composeRule.fileType,
    multiple: composeRule.multiple,
    maxSize: composeRule.meta.default?.size ?? Infinity,
  });

  return (
    <>
      <input {...getInputProps()} />

      <Button size="xs" variant="ghost" onClick={open}>
        <Icon {...iconProps} />
      </Button>
    </>
  );
}
