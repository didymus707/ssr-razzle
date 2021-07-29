import { Flex, FlexProps, PseudoBox, PseudoBoxProps } from '@chakra-ui/core';
import React from 'react';
import { createContext } from '../../../../../../hooks';

type EditableTableCellProps = {
  value: string;
  onEdit?: () => void;
  placeholder?: string;
  defaultValue?: string;
  submitOnBlur?: boolean;
  children: React.ReactNode;
  onChange?: (value: string) => void;
  onSubmit?: (newValue: string) => void;
  onCancel?: (previousValue: string) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type T = {
  value: string;
  hasValue?: boolean;
  isEditing?: boolean;
  placeholder?: string;
  submitOnBlur?: boolean;
  onRequestEdit?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  handleKeyDown?: (event: React.KeyboardEvent) => void;
  handleBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const [Provider, useEditableTableCell] = createContext<T>();

export function EditableTableCellProvider({
  onEdit,
  onBlur,
  onChange,
  onCancel,
  onSubmit,
  children,
  placeholder,
  submitOnBlur,
  defaultValue,
  value: valueProp,
}: EditableTableCellProps) {
  const inputRef = React.useRef(null);
  const { current: isControlled } = React.useRef(valueProp != null);
  const [value, setValue] = React.useState(defaultValue || '');
  const [isEditing, setIsEditing] = React.useState(false);
  const _value = isControlled ? valueProp : value;
  const [previousValue, setPreviousValue] = React.useState(_value);

  const hasValue = _value != null && _value !== '';

  React.useEffect(() => {
    if (isEditing) {
      onEdit && onEdit();
    }
  }, [isEditing, onEdit]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      //@ts-ignore
      inputRef?.current?.focus();
      //@ts-ignore
      inputRef?.current?.select();
    }
  }, [isEditing]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!isControlled) {
      setValue(value);
    }
    onChange && onChange(value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    submitOnBlur ? handleSubmit() : handleCancel();
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(previousValue);
    if (value !== previousValue) {
      onChange && onChange(previousValue);
    }
    onCancel && onCancel(previousValue);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setPreviousValue(value);
    onSubmit && onSubmit(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    if (key === 'Escape') {
      handleCancel();
      return;
    }

    if (key === 'Enter') {
      handleSubmit();
    }
  };

  const onRequestEdit = () => {
    setIsEditing(true);
  };

  const context = {
    hasValue,
    inputRef,
    isEditing,
    handleBlur,
    placeholder,
    submitOnBlur,
    handleChange,
    onRequestEdit,
    handleKeyDown,
    value: _value,
  };

  return <Provider value={context}>{children}</Provider>;
}

const sharedProps = {
  width: 'full',
  bg: 'transparent',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  transition: 'all 0.2s',
};

export function EditableTableCellPreview(props: PseudoBoxProps) {
  const { value, hasValue, isEditing, placeholder } = useEditableTableCell();

  if (isEditing) {
    return null;
  }

  return (
    <PseudoBox {...sharedProps} {...props}>
      {hasValue ? value : placeholder}
    </PseudoBox>
  );
}

export function EditableTableCellInput(props: PseudoBoxProps) {
  const {
    value,
    inputRef,
    isEditing,
    handleBlur,
    placeholder,
    handleChange,
    handleKeyDown,
  } = useEditableTableCell();

  const inputProps = {
    value,
    placeholder,
    ref: inputRef,
    onBlur: handleBlur,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };

  if (!isEditing) {
    return null;
  }

  return (
    <PseudoBox
      as="input"
      ref={inputRef}
      outline="none"
      {...sharedProps}
      {...inputProps}
      {...props}
    />
  );
}

export function EditableTableCellContainer(props: FlexProps) {
  const { onRequestEdit } = useEditableTableCell();
  return (
    <Flex {...props} {...sharedProps} onDoubleClick={onRequestEdit}>
      {props.children}
    </Flex>
  );
}

export function EditableTableCell(props: EditableTableCellProps) {
  return (
    <EditableTableCellProvider {...props}>
      <EditableTableCellContainer>{props.children}</EditableTableCellContainer>
    </EditableTableCellProvider>
  );
}
