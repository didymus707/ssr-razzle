// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { DragHandle } from '../../../../../components';
import { Icon, Box, Popover, PopoverTrigger, PopoverContent, Input } from '@chakra-ui/core';
import { SelectOptionMenuWrapper } from '../../../list-view.styles';
import { PopoverListItem } from '../../popover-list-item';
import { select_option_colors } from '../../../list.data';

type SelectColorOptionProps = {
  color: string;
  label: string;
  active?: boolean;
  onClick?: () => any;
};

const SelectColorOption = (props: SelectColorOptionProps) => {
  return (
    <div className="list-item space-between" onClick={() => props.onClick(props.color)}>
      <div className="left">
        <div
          className="color"
          style={{
            backgroundColor: props.color,
            borderColor: props.color,
          }}
        />
        {props.label}
      </div>
      {props.active && <Icon name="check" size="15px" />}
    </div>
  );
};

const SelectOptionMenu = (props: any) => {
  const [tempLabel, setTempLabel] = useState(props.name);
  const initialFocusRef = useRef();

  useEffect(() => {
    setTempLabel(props.name);
  }, [props.name]);

  const handleTempLabelChange = (e: any) => {
    setTempLabel(e.target.value);
  };

  const handleEnterPressed = (e: any) => {
    if (e.key !== 'Enter') return;
    props.updateSelectOption(props.id, {
      name: e.target.value,
      color: props.color,
    });
  };

  const handleSelectOptionColorChange = (color: string) => {
    props.updateSelectOption(props.id, {
      name: props.name,
      color,
    });
  };

  const handleDeleteOption = () => {
    props.updateSelectOption(props.id, {
      is_deleted: true,
    });
  };

  return (
    <Popover placement="bottom" initialFocusRef={initialFocusRef}>
      <>
        <PopoverTrigger>
          <div className="icon-bg" onClick={(e: any) => e.stopPropagation()}>
            <Icon marginTop="10px" name="more" size="12px" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          zIndex={1000000000}
          width="max-content"
          minWidth="200px"
          boxShadow="none"
          _focus={{
            boxShadow: 'none',
            outline: 'none',
          }}
          onClick={(e: any) => e.stopPropagation()}
        >
          <SelectOptionMenuWrapper>
            <Box className="input-item" padding="none">
              <Input
                variant="filled"
                onChange={handleTempLabelChange}
                focusBorderColor="none"
                value={tempLabel}
                height={25}
                fontSize={13}
                ref={initialFocusRef}
                onKeyPress={handleEnterPressed}
                style={{
                  backgroundColor: '#EDF2F7',
                }}
              />
            </Box>
            <PopoverListItem label="Delete" icon="trash" onClick={handleDeleteOption} />
            <hr />
            <Box fontSize="10px" fontWeight="600" color="#8c8c8c" paddingX="8px" paddingY="5px">
              COLORS
            </Box>
            {select_option_colors.map((color: any, index: number) => (
              <SelectColorOption
                active={color.color === props.color}
                key={index}
                {...color}
                onClick={handleSelectOptionColorChange}
              />
            ))}
          </SelectOptionMenuWrapper>
        </PopoverContent>
      </>
    </Popover>
  );
};

const OptionItem = (props: any) => {
  const handleOptionClicked = () => {
    props.updateValue([props.id]);
  };

  return (
    <div className="option-item" onClick={handleOptionClicked}>
      <Box className="left">
        <DragHandle />
        <div
          className="name"
          style={{
            backgroundColor: props.color || '#cecdca80',
            ...props.itemStyles,
          }}
        >
          {props.name}
        </div>
      </Box>
      <SelectOptionMenu {...props} updateSelectOption={props.updateSelectOption} />
    </div>
  );
};

export const SelectCellEditor = (props: any) => {
  const { updateValue, updateSelectOption, allowCreate, optionItemStyles = {} } = props;
  const options = props.options.filter((option: any) => !option.isDeleted);

  return (
    <div className="select-editor">
      <div className="description-text">Select an option{allowCreate && ' or create one'}</div>
      <div>
        {options.map((i: any) => (
          <OptionItem
            key={i.id}
            {...i}
            updateValue={updateValue}
            updateSelectOption={updateSelectOption}
            itemStyles={optionItemStyles}
          />
        ))}
      </div>
    </div>
  );
};
