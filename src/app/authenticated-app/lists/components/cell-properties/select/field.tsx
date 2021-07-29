// @ts-nocheck
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Box, Icon, Input } from '@chakra-ui/core';
import { PopoverWrapper } from '../../../list-view.styles';
import { SelectCellEditor } from './editor';

const SelectInput = forwardRef(({ addOption }: any, ref: any) => {
  const [value, setValue] = useState('');

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleKeyPress = (e: any) => {
    if (e.key !== 'Enter') return;
    if (value === '') return;
    addOption(value);
    setValue('');
  };

  return (
    <Input
      ref={ref}
      variant="unstyled"
      width="auto"
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  );
});

const SelectValueItem = (props: any) => {
  const handleDeleteValue = (event: any) => {
    event.stopPropagation();
    props.delete(props.id);
  };

  return (
    <div
      className="value-item"
      style={{
        fontSize: 12,
        backgroundColor: props.color,
        marginRight: 7.5,
        padding: '2px 5px',
        borderRadius: 2,
        lineHeight: 'normal',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        ...props.itemStyles,
      }}
    >
      {props.value}
      <Box
        marginLeft="5px"
        display="flex"
        padding="2.5px"
        borderRadius="2px"
        backgroundColor="rgba(0,0,0,0.1)"
        onClick={handleDeleteValue}
        className="close-icon"
      >
        <Icon name="close" size="8px" cursor="pointer" className="close-icon" />
      </Box>
    </div>
  );
};

export const SelectFieldComponent = (props: any) => {
  const [dummyValue, setDummyValue] = useState<string | number | null>(null);
  const [dummyOptions, setDummyOptions] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  const { column, inputProps = {}, optionItemStyles = {}, allowCreate = true } = props;

  useEffect(() => {
    setDummyValue(props.value);
    setDummyOptions(props.column.options || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (inputFocused && document.activeElement !== inputRef.current) inputRef.current.focus();
  }, [inputFocused]);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleClick = (e: any) => {
    if (!isOpen) return;
    // @ts-ignore
    if (popoverRef.current.contains(e.target)) return;
    // @ts-ignore
    if (containerRef.current.contains(e.target)) return;
    onClose();
  };

  const deleteValue = async (option_id: string | number) => {
    setDummyValue(null);
    props.updateCellValue(null, column.uid);
  };

  const addOption = async (_value: string) => {
    const option = await props.addSelectOption(column.uid, _value);
    // @ts-ignore
    setDummyOptions([...dummyOptions, option]);
    updateValue(option.id);
  };

  const updateSelectOption = async (option_id: string | number, payload: object) => {
    const updated_options = await props.updateSelectOption(column.uid, option_id, payload);
    setDummyOptions(updated_options);
  };

  const updateValue = (_value: any) => {
    setDummyValue(_value);
    props.updateCellValue(_value, column.uid);
  };

  const attachOutsideClickListener = () => {
    document.addEventListener('mousedown', handleClick);
  };
  const detachOutsideClickListener = () => {
    document.removeEventListener('mousedown', handleClick);
  };

  useEffect(() => {
    attachOutsideClickListener();
    return detachOutsideClickListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  let options = dummyOptions.filter((i: any) => !i.isDeleted);
  const selected_option = options.find((i: any) => Number(i.id) === Number(dummyValue));

  return (
    <>
      <Box
        onClick={() => {
          setIsOpen(true);
          if (allowCreate) setInputFocused(true);
        }}
        ref={containerRef}
        padding="7.5px 12.5px"
        width="100%"
        borderRadius="3px"
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        flexDirection="row"
        fontSize="16px"
        border="1px solid #E2E8F0"
        {...inputProps}
      >
        {selected_option && (
          <SelectValueItem
            value={selected_option.name}
            color={selected_option.color}
            delete={deleteValue}
            id={selected_option.id}
          />
        )}
        {allowCreate && <SelectInput ref={inputRef} addOption={addOption} />}
        {!allowCreate && !selected_option && (
          <Box fontSize="14px !important" color="#7a7a7a">
            Select an Option
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
        >
          <PopoverWrapper>
            <SelectCellEditor
              {...{
                options: dummyOptions,
                updateSelectOption,
                updateValue,
                allowCreate,
                optionItemStyles,
              }}
            />
          </PopoverWrapper>
        </Box>
      )}
    </>
  );
};
