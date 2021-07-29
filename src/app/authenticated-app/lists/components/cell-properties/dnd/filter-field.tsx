import React, { useEffect, useRef, useState } from 'react';
import { Box, PseudoBox } from '@chakra-ui/core/dist';
import { PopoverWrapper } from '../../../list-view.styles';

export const DNDFieldFilterComponent = (props: any) => {
  const [dummyValue, setDummyValue] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  const { column, inputProps = {} } = props;

  const updateValue = (_value: any) => {
    setDummyValue(_value);
    props.updateCellValue(_value, column.uid);
    onClose();
  };

  const onClose = () => setIsOpen(false);

  const handleClick = (e: any) => {
    if (!isOpen) return;
    // @ts-ignore
    if (popoverRef.current.contains(e.target)) return;
    // @ts-ignore
    if (containerRef.current.contains(e.target)) return;
    onClose();
  };

  const attachOutsideClickListener = () => {
    document.addEventListener('mousedown', handleClick);
  };
  const detachOutsideClickListener = () => {
    document.removeEventListener('mousedown', handleClick);
  };

  useEffect(() => {
    setDummyValue(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    attachOutsideClickListener();
    return detachOutsideClickListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const options = [
    { label: 'Yes', key: 1, value: true, color: '#00876b33' },
    { label: 'No', key: 0, value: false, color: '#ff001a33' },
  ];

  return (
    <>
      <Box
        onClick={() => {
          setIsOpen(true);
        }}
        ref={containerRef}
        padding="7.5px 12.5px"
        width="100%"
        borderRadius="3px"
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        flexDirection="row"
        border="1px solid #E2E8F0"
        {...inputProps}
      >
        {(dummyValue === true || dummyValue === false) && (
          <Box
            {...{
              fontSize: '12px !important',
              padding: '1.5px 3px',
              backgroundColor: dummyValue ? '#00876b33' : '#ff001a33',
              borderColor: dummyValue ? '#00876b33' : '#ff001a33',
              borderRadius: '5px',
              color: '#333333',
            }}
          >
            {dummyValue ? 'Yes' : 'No'}
          </Box>
        )}
      </Box>

      {isOpen && (
        <Box
          ref={popoverRef}
          zIndex={100000}
          position="absolute"
          width="max-content"
          boxShadow="none"
          display="flex"
          marginTop="5px"
        >
          <PopoverWrapper>
            <div className="select-editor">
              <div className="description-text">Select an option</div>
              <Box>
                {options.map((i: any, index: number) => (
                  <PseudoBox
                    key={index}
                    display="flex"
                    width="100%"
                    _hover={{
                      cursor: 'pointer',
                      backgroundColor: '#FAFAFA',
                    }}
                    onClick={() => updateValue(i.value)}
                  >
                    <Box
                      {...{
                        fontSize: '12px !important',
                        padding: '1.5px 3px',
                        backgroundColor: i.color,
                        borderColor: i.color,
                        borderRadius: '5px',
                        color: '#333333',
                        width: 'fit-content',
                        marginY: '5px',
                        marginLeft: '10px',
                      }}
                    >
                      {i.label}
                    </Box>
                  </PseudoBox>
                ))}
              </Box>
            </div>
          </PopoverWrapper>
        </Box>
      )}
    </>
  );
};
