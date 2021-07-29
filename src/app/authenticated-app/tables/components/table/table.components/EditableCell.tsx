import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { debounce } from 'lodash';
import isEqual from 'lodash/isEqual';
import * as React from 'react';
import { validateEmail, validURL } from '../../../../../../utils';
import { SelectOptions } from '../../../tables.types';
import { TableDatePicker } from './table.datepicker';
import { TableCellClickable } from './TableCellClickable';
import { TableSelect } from './TableSelect';

export const EditableCell = (props: any) => {
  const {
    value: initialValue,
    row: { index: rowIndex },
    column: { id: columnIndex },
    updateTableData,
    isPreviewFocusable,
    startWithEditView
  } = props;

  const [inputValue, setInputValue] = React.useState(initialValue?.value);

  const [selectValue, setSelectValue] = React.useState(initialValue?.value);

  React.useEffect(() => {
    if (initialValue?.options) {
      setSelectValue(initialValue?.value);
    } else {
      setInputValue(initialValue?.value);
    }
  }, [initialValue]);

  const saveInputData = React.useCallback(
    (value: string) => {
      const phoneNumberValidation = parsePhoneNumberFromString(value)?.isValid();
      const urlValidation = validURL(value);
      const emailValidation = validateEmail(value);

      switch (initialValue?.type?.toLowerCase()) {
        case 'text':
        case 'person':
        case 'number':
          if (!isEqual(initialValue.value, value)) {
            updateTableData(rowIndex, columnIndex, value);
          }
          break;
        case 'email':
          if (!isEqual(initialValue.value, value) && emailValidation) {
            updateTableData(rowIndex, columnIndex, value);
          }
          break;
        case 'phone number':
          if (!isEqual(initialValue.value, value) && phoneNumberValidation) {
            updateTableData(rowIndex, columnIndex, value);
          }
          break;
        case 'url':
          if (!isEqual(initialValue.value, value) && urlValidation) {
            updateTableData(rowIndex, columnIndex, value);
          }
          break;

        default:
          break;
      }
    },
    [columnIndex, initialValue, rowIndex, updateTableData]
  );

  // eslint-disable-next-line
  const debouncedApiCall = React.useCallback(
    debounce((value: string) => {
      saveInputData(value);
    }, 1500),
    []
  );

  const onInputChange = (value?: string) => {
    setInputValue(value);
    // value && debouncedApiCall(value);
  };

  function onInputBlur() {
    const phoneNumberValidation = parsePhoneNumberFromString(inputValue)?.isValid();
    const urlValidation = validURL(inputValue);
    const emailValidation = validateEmail(inputValue);
    const condition = phoneNumberValidation || urlValidation || emailValidation;
    if (!isEqual(initialValue.value, inputValue) && condition) {
      updateTableData(rowIndex, columnIndex, inputValue);
    }
    if (!isEqual(initialValue.value, inputValue)) {
      updateTableData(rowIndex, columnIndex, inputValue);
    }
  }

  function onDatePickerChange(value?: string) {
    setInputValue(value);
    updateTableData(rowIndex, columnIndex, value);
  }

  function onSelectChange(value: SelectOptions | SelectOptions[]) {
    if (Array.isArray(value)) {
      setSelectValue(value.map(item => item.value));
    } else {
      if (value) {
        setSelectValue(value.value);
      } else {
        setSelectValue(value);
      }
    }
  }

  function onSelectBlur() {
    if (!isEqual(initialValue.value, selectValue)) {
      updateTableData(rowIndex, columnIndex, selectValue);
    }
  }

  function onCreateOptions(value: string | string[] | undefined, options: SelectOptions[]) {
    updateTableData(rowIndex, columnIndex, value, options);
  }

  function getMultiSelectValue() {
    if (initialValue?.value) {
      return Array.isArray(initialValue.value)
        ? initialValue.value.map((item: string) => ({
            value: item,
            label: item,
          }))
        : [initialValue.value].map((item: string) => ({
            value: item,
            label: item,
          }));
    }
    return [];
  }

  function getSelectValue() {
    return {
      value: initialValue?.value,
      label: initialValue?.value,
    };
  }

  switch (initialValue?.type?.toLowerCase()) {
    case 'text':
    case 'person':
      return (
        <TableCellClickable
          value={inputValue}
          onBlur={onInputBlur}
          onChange={onInputChange}
          defaultValue={inputValue}
          isPreviewFocusable={isPreviewFocusable}
          startWithEditView={startWithEditView}
        />
      );
    case 'number':
      return (
        <TableCellClickable
          value={inputValue}
          inputType="number"
          onBlur={onInputBlur}
          onChange={onInputChange}
          defaultValue={inputValue}
          isPreviewFocusable={isPreviewFocusable}
          startWithEditView={startWithEditView}
        />
      );
    case 'date':
      return <TableDatePicker value={inputValue} onChange={onDatePickerChange} defaultIsOpen={startWithEditView} />;
    case 'url':
      return (
        <TableCellClickable
          icon="link"
          target="_blank"
          inputType="url"
          url={inputValue}
          value={inputValue}
          onBlur={onInputBlur}
          tooltipLabel="Open link"
          defaultValue={inputValue}
          onChange={onInputChange}
          isInvalid={!validURL(inputValue)}
          isPreviewFocusable={isPreviewFocusable}
          startWithEditView={startWithEditView}
        />
      );
    case 'email':
      return (
        <TableCellClickable
          icon="at-sign"
          inputType="email"
          value={inputValue}
          onBlur={onInputBlur}
          tooltipLabel="Send email"
          defaultValue={inputValue}
          onChange={onInputChange}
          url={`mailto: ${inputValue}`}
          isInvalid={!validateEmail(inputValue)}
          isPreviewFocusable={isPreviewFocusable}
          startWithEditView={startWithEditView}
        />
      );
    case 'phone number':
      return (
        <TableCellClickable
          icon="phone"
          inputType="tel"
          value={inputValue}
          tooltipLabel="Call"
          onBlur={onInputBlur}
          defaultValue={inputValue}
          onChange={onInputChange}
          url={`tel: ${inputValue}`}
          errorMessage="Invalid mobile number"
          isPreviewFocusable={isPreviewFocusable}
          startWithEditView={startWithEditView}
          isInvalid={!parsePhoneNumberFromString(inputValue)?.isValid()}
        />
      );
    case 'multi select':
      return (
        <TableSelect
          isMulti
          placeholder=""
          onBlur={onSelectBlur}
          onChange={onSelectChange}
          value={getMultiSelectValue()}
          defaultValue={getMultiSelectValue()}
          options={initialValue && initialValue.options}
          onCreateOptions={(options, value) => onCreateOptions(value, options)}
        />
      );
    case 'select':
      return (
        <TableSelect
          placeholder=""
          onBlur={onSelectBlur}
          onChange={onSelectChange}
          value={getSelectValue()}
          defaultValue={getSelectValue()}
          options={initialValue && initialValue.options}
          onCreateOptions={(options, value) => onCreateOptions(value, options)}
        />
      );

    default:
      return null;
  }
};
