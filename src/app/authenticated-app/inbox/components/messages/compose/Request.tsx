/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  BoxProps,
  Flex,
  Icon,
  IconButton,
  Image,
  IModal,
  Input as ChakraInput,
  InputProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Radio,
  Stack,
  StackProps,
  Switch,
  SwitchProps,
  Text,
} from '@chakra-ui/core';
import {
  BodyText,
  Button,
  Heading3,
  Input,
  Select,
  SmallText,
  Subtitle,
  XSmallText,
} from 'app/components';
import { endOfMonth, endOfToday, endOfTomorrow, endOfYear, format } from 'date-fns';
import React, {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { DatePickerComponent, hourArray, minArray } from '../../../../../components';
import { selectPaymentSetupStatus } from '../../../../payments/slices';
import { INITIAL_PAYMENT_REQUEST_ITEM } from '../../../inbox.data';
import {
  ComposeIconsProps,
  PaymentRequestItemSchema,
  PaymentRequestSchema,
} from '../../../inbox.types';
import { formatToCurrency } from '../../../inbox.utils';
import setUpImg from './set-up.svg';

type CommonProps = {
  initialFocusRef: MutableRefObject<HTMLElement | undefined>;
};

export function Request({
  paymentItems,
  setPaymentItems,
  isModalOpened,
  setIsModalOpened,
  paymentLinkMeta,
  setPaymentLinkMeta,
  paymentRequest,
  setPaymentRequest,
  isCreatingLink,
  onSendPaymentRequest,
}: Pick<
  ComposeIconsProps,
  | 'paymentItems'
  | 'setPaymentItems'
  | 'isModalOpened'
  | 'setIsModalOpened'
  | 'paymentLinkMeta'
  | 'setPaymentLinkMeta'
  | 'paymentRequest'
  | 'setPaymentRequest'
  | 'isCreatingLink'
  | 'onSendPaymentRequest'
>) {
  const initialFocusRef = useRef<HTMLElement>();
  const [viewControl, setViewControl] = useState<ViewControlSchema>('none');

  const paymentApprovalStatus = useSelector(selectPaymentSetupStatus);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scheduleOptions = {
    title: 'Recurring Schedule',
    list: [{ text: 'Daily' }, { text: 'Weekly' }, { text: 'Monthly' }, { text: 'Yearly' }],
  };

  const formatString = `MMM dd, yyyy 'at' hh:mma`;
  const today = endOfToday();
  const tomorrow = endOfTomorrow();
  const month = endOfMonth(new Date());
  const dateOptions = [
    { text: 'Never Expire', value: endOfYear(new Date()).getTime() },
    {
      text: 'End of Today',
      subText: format(today, formatString),
      value: today.getTime(),
    },
    { text: 'Tomorrow', subText: format(tomorrow, formatString), value: tomorrow.getTime() },
    { text: 'End of the Month', subText: format(month, formatString), value: month.getTime() },
    // { text: 'Pick a Date', value: month },
  ];
  const times = {
    [tomorrow.getTime()]: 'Tomorrow',
    [today.getTime()]: 'End of Today',
    [month.getTime()]: 'End of the Month',
    [endOfYear(new Date()).getTime()]: 'Never Expire',
  };

  const closeModal = () => setIsModalOpened(false);

  let handleClose = () => {
    closeModal();
    viewControl !== 'none' && setViewControl('none');
    setPaymentItems([
      {
        name: '',
        amount: 0,
        id: new Date().getTime().toString(),
      },
    ]);
  };

  const handleRequestVariableChange = (value: string, name: string) =>
    setPaymentRequest({
      ...paymentRequest,
      [name]: value,
    });

  let view = <Box />;
  let scrollBehavior: IModal['scrollBehavior'] = 'outside';
  let isModalCenter = false;
  if (paymentApprovalStatus !== 'completed') {
    isModalCenter = true;
    view = <SetUp initialFocusRef={initialFocusRef} />;
  } else if (viewControl === 'none') {
    // scrollBehavior = 'inside';

    view = (
      <Payment
        times={times}
        closeModal={closeModal}
        paymentItems={paymentItems}
        setViewControl={setViewControl}
        paymentRequest={paymentRequest}
        isCreatingLink={isCreatingLink}
        paymentLinkMeta={paymentLinkMeta}
        setPaymentItems={setPaymentItems}
        initialFocusRef={initialFocusRef}
        setPaymentRequest={setPaymentRequest}
        setPaymentLinkMeta={setPaymentLinkMeta}
        handlePaymentRequest={() => onSendPaymentRequest?.(paymentRequest)}
      />
    );
  } else if (viewControl === 'payment-method') {
    view = (
      <OptionList
        name="provider"
        list={[
          { text: 'SimpuPay', value: 'onepipe' },
          { text: 'Paystack', value: 'paystack' },
        ]}
        title="Payment Method"
        setViewControl={setViewControl}
        value={paymentRequest.provider}
        initialFocusRef={initialFocusRef}
        subtitle="Select your prefered payment method"
        onPaymentRequestVariableChange={handleRequestVariableChange}
      />
    );
  } else if (viewControl === 'expiration') {
    view = (
      <OptionList
        name="expiry_date"
        list={dateOptions as any}
        title="Link Expiration"
        setViewControl={setViewControl}
        initialFocusRef={initialFocusRef}
        value={paymentRequest.expiry_date as any}
        onPaymentRequestVariableChange={handleRequestVariableChange}
      />
    );
  }

  return (
    <>
      <Button size="xs" variant="ghost" onClick={() => setIsModalOpened(true)}>
        <Icon name="inbox-compose-request" size="24px" />
      </Button>

      <Modal
        size="xl"
        isOpen={isModalOpened}
        closeOnEsc={false}
        onClose={handleClose}
        isCentered={isModalCenter}
        closeOnOverlayClick={false}
        scrollBehavior={scrollBehavior}
        // @ts-ignore
        initialFocusRef={initialFocusRef}
      >
        <ModalOverlay />

        {view}
      </Modal>
    </>
  );
}

function SetUp({ initialFocusRef }: CommonProps) {
  const history = useHistory();

  return (
    <ModalContent
      width="auto"
      paddingTop="2rem"
      borderRadius=".3125rem"
      boxShadow="0px 0px 1px rgba(67, 90, 111, 0.47)"
    >
      <ModalCloseButton size="sm" />

      <Box maxWidth="35.75rem" textAlign="center">
        <Flex justifyContent="center" marginBottom="1rem">
          <Image src={setUpImg} size="6rem" />
        </Flex>

        <Box paddingX="1.875rem" marginBottom="1.875rem" color="brandBlack">
          <Heading3 textAlign="center" marginBottom=".5rem">
            Set up Simpu Payments
          </Heading3>
          <BodyText textAlign="center" color="gray.500">
            Get a unique bank account for all your transactions.
          </BodyText>
          <BodyText textAlign="center" color="gray.500">
            Click the button below to setup your account.
          </BodyText>
        </Box>
        <Flex paddingX="1.875rem" marginBottom="1.25rem" justifyContent="center">
          <Button
            isFullWidth
            variantColor="blue"
            ref={initialFocusRef}
            onClick={() => history.push('/s/payments/requests')}
          >
            Setup account
          </Button>
        </Flex>
      </Box>
    </ModalContent>
  );
}

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

function PAYMENT_ITEM({
  index,
  listLength,
  initialFocusRef,
  onDelete,
  onUpdate,
  item,
  ...boxProps
}: BoxProps &
  CommonProps & {
    index: number;
    listLength: number;
    item: PaymentRequestItemSchema;
    onDelete: (uuid: string) => void;
    onUpdate: (name: string, value: string, index: number) => void;
  }) {
  // const [showDelete, setShowDelete] = useState(false);
  const { amount, quantity, name, description, uuid } = item;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const { key, keyCode } = e;

      if (
        (amount === 0 && !VALID_FIRST.test(key)) ||
        (amount !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
      ) {
        return;
      }

      const valueString = amount.toString();
      let nextValue: number;

      if (keyCode !== DELETE_KEY_CODE) {
        const nextValueString: string = amount === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue = nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
      }

      if (nextValue > Number.MAX_SAFE_INTEGER) {
        return;
      }

      onUpdate && onUpdate('amount', nextValue.toString(), index);
    },
    [amount, index, onUpdate],
  );

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
    onUpdate && onUpdate(name, value, index);

  const inputs: InputProps[] = [
    {
      flex: 282,
      value: name,
      name: 'name',
      placeholder: 'Enter item name',
      // @ts-ignore
      ref: index === 0 ? initialFocusRef : undefined,
    },
    {
      flex: 263,
      value: description,
      name: 'description',
      placeholder: 'Enter item description',
    },
    {
      flex: 66,
      type: 'number',
      value: quantity,
      name: 'quantity',
      placeholder: '1',
      textAlign: 'right',
    },
    {
      flex: 91,
      value: `₦${formatToCurrency(amount)}`,
      name: 'amount',
      textAlign: 'right',
      onChange: () => {},
      placeholder: '₦2000.00',
      onKeyDown: handleKeyDown,
    },
  ];

  return (
    <Box
      position="relative"
      {...boxProps}
      // onMouseEnter={() => setShowDelete(true)}
      // onMouseLeave={() => setShowDelete(false)}
    >
      <Stack isInline width="100%" spacing="1rem">
        {inputs.map(({ ...inputProps }) => (
          <ChakraInput
            size="sm"
            color="#333"
            rounded="8px"
            fontSize=".875rem"
            lineHeight="1.375rem"
            padding=".25rem .5rem"
            borderColor="gray.200"
            key={inputProps.placeholder}
            _placeholder={{ color: '#BDBDBD' }}
            onChange={inputProps.onChange ? inputProps.onChange : handleChange}
            {...inputProps}
          />
        ))}
      </Stack>

      {listLength > 1 && (
        <IconButton
          top=".65rem"
          color="#333"
          icon="delete"
          height="auto"
          fontSize="1rem"
          variant="ghost"
          minWidth="auto"
          right="-1.875rem"
          position="absolute"
          aria-label="delete"
          onClick={() => onDelete(uuid)}
        />
      )}
    </Box>
  );
}

function PAYMENT_LIST({
  initialFocusRef,
  paymentRequestList,
  onDelete,
  onUpdate,
  ...stackProps
}: StackProps &
  CommonProps & {
    onDelete: (uuid: string) => void;
    paymentRequestList: PaymentRequestSchema['items'];
    onUpdate: (name: string, value: string, index: number) => void;
  }) {
  return (
    <Stack spacing=".625rem" {...stackProps}>
      {paymentRequestList.map((item, index) => (
        <PAYMENT_ITEM
          item={item}
          index={index}
          key={item.uuid}
          onUpdate={onUpdate}
          onDelete={onDelete}
          initialFocusRef={initialFocusRef}
          listLength={paymentRequestList.length}
        />
      ))}
    </Stack>
  );
}

function MiddleA({
  order_type,
  invoice_number,
  onChanged,
  ...stackProps
}: StackProps & {
  order_type: string;
  invoice_number: string;
  onChanged: (v: string, k: string) => void;
}) {
  const inputs = [
    {
      type: 'input',
      value: invoice_number,
      title: 'Invoice Number',
      placeholder: 'Input invoice number',
      moreInfo: 'Visible on customer payment request',
      onChange: ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
        onChanged(value, 'invoice_number'),
    },
    {
      type: 'select',
      value: order_type,
      title: 'Delivery Type',
      placeholder: 'Select delivery type',
      onChange: ({ target: { value } }: ChangeEvent<HTMLSelectElement>) =>
        onChanged(value, 'order_type'),
    },
  ];

  return (
    <Stack isInline spacing="3.75rem" justifyContent="space-between" {...stackProps}>
      {inputs.map(({ type, title, placeholder, moreInfo, value, onChange }) => (
        <Box flex={1} color="#333" key={placeholder} lineHeight="1rem" fontSize=".875rem">
          <SmallText fontWeight="bold" marginBottom="0.25rem">
            {title}
          </SmallText>

          {type === 'input' ? (
            <Input
              size="sm"
              width="100%"
              value={value}
              // @ts-ignore
              onChange={onChange}
              borderColor="gray.200"
              placeholder={placeholder}
            />
          ) : (
            <Select
              size="sm"
              width="100%"
              value={order_type}
              borderColor="gray.200"
              // @ts-ignore
              onChange={onChange}
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </Select>
          )}

          {moreInfo && (
            <Stack isInline alignItems="center" marginTop="0.5rem">
              <Icon name="eye" size="1rem" color="gray.900" />
              <XSmallText color="gray.400">Visible on customer payment request</XSmallText>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
}

function MiddleB({
  times,
  provider,
  expiration,
  setViewControl,
  ...boxProps
}: BoxProps & {
  times: any;
  provider: string;
  expiration: PaymentRequestSchema['expiry_date'];
  setViewControl: (v: ViewControlSchema) => void;
}) {
  const paymentMethods: any = {
    paystack: 'Paystack',
    onepipe: 'SimpuPay',
  };

  const items = [
    {
      selectedOption: paymentMethods[provider],
      viewControl: 'payment-method',
      text: 'Payment Methods Accepted',
    },
    {
      text: 'Link Expiration',
      selectedOption: times[expiration],
      viewControl: 'expiration',
    },
  ];

  return (
    <Box borderBottom="1px solid rgba(213, 219, 230, 0.5)" {...boxProps}>
      {items.map(({ text, selectedOption, viewControl }) => (
        <Button
          key={text}
          width="100%"
          rounded="0"
          variant="ghost"
          fontWeight={600}
          padding="1.25rem 0"
          fontSize=".875rem"
          _hover={{ bg: 'transparent' }}
          _focus={{ boxShadow: 'none' }}
          justifyContent="flex-start"
          borderTop="1px solid rgba(213, 219, 230, 0.5)"
          onClick={() => setViewControl(viewControl as ViewControlSchema)}
        >
          <Text color="#333">{text}</Text>

          <Text marginLeft="auto">{selectedOption}</Text>

          <Icon height="1rem" fontSize="1rem" width="1.1875rem" name="chevron-down" />
        </Button>
      ))}
    </Box>
  );
}

function FooterButtons({
  isDisabled,
  closeModal,
  handlePaymentRequest,
  isCreatingLink,
  ...stackProps
}: StackProps & {
  isDisabled?: boolean;
  isCreatingLink?: boolean;
  closeModal: () => void;
  handlePaymentRequest: () => void;
}) {
  return (
    <Stack isInline width="100%" justifyContent="center" {...stackProps}>
      <Button size="sm" width="48%" variant="outline" onClick={closeModal}>
        Cancel
      </Button>
      <Button
        size="sm"
        width="48%"
        variantColor="blue"
        isDisabled={isDisabled}
        isLoading={isCreatingLink}
        onClick={handlePaymentRequest}
      >
        Create payment link
      </Button>
    </Stack>
  );
}

function Payment({
  times,
  closeModal,
  setViewControl,
  isCreatingLink,
  paymentRequest,
  initialFocusRef,
  setPaymentRequest,
  handlePaymentRequest,
}: CommonProps &
  Pick<
    ComposeIconsProps,
    | 'paymentItems'
    | 'setPaymentItems'
    | 'paymentLinkMeta'
    | 'setPaymentLinkMeta'
    | 'paymentRequest'
    | 'setPaymentRequest'
    | 'isCreatingLink'
    | 'onSendPaymentRequest'
  > & {
    times: any;
    closeModal: () => void;
    handlePaymentRequest: () => void;
    setViewControl: (v: ViewControlSchema) => void;
  }) {
  const paymentTotal = paymentRequest.items.reduce(
    (acc, { amount, quantity }) => acc + Number(amount) * Number(quantity),
    0,
  );

  const handlePaymentRequestItemChange = (name: string, value: string, index: number) => {
    setPaymentRequest({
      ...paymentRequest,
      items: paymentRequest.items.map((item, itemIndex) => {
        if (index === itemIndex) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      }),
    });
  };

  const addNewPaymentRequestItem = () => {
    setPaymentRequest({
      ...paymentRequest,
      items: [...paymentRequest.items, { ...INITIAL_PAYMENT_REQUEST_ITEM, uuid: uuidV4() }],
    });
  };

  const removePaymentRequestItem = (uuid: string) => {
    setPaymentRequest({
      ...paymentRequest,
      items: paymentRequest.items.filter(item => uuid !== item.uuid),
    });
  };

  const handleRequestVariableChange = (value: string, name: string) =>
    setPaymentRequest({
      ...paymentRequest,
      [name]: value,
    });

  return (
    <ModalContent
      maxHeight="87vh"
      maxWidth="none"
      paddingTop="2rem"
      width="52.625rem"
      borderRadius=".3125rem"
      boxShadow="0px 0px 1px rgba(67, 90, 111, 0.47)"
    >
      <ModalCloseButton size="sm" />

      <Flex position="relative" flexDirection="column" paddingBottom="1.875rem" overflowY="hidden">
        <Flex flexDirection="column" overflowY="auto" color="#828282" paddingX="2.9375rem">
          <Subtitle color="gray.900" marginBottom="2.5rem">
            Request Payment
          </Subtitle>

          <Flex
            color="#333"
            fontWeight="bold"
            lineHeight="1rem"
            fontSize=".875rem"
            paddingBottom=".625rem"
          >
            <Text flex={1}>Items</Text>
            <Text>Quantity</Text>
            <Text marginLeft="5.2rem">Price</Text>
          </Flex>

          <PAYMENT_LIST
            flex={1}
            borderTopWidth="1px"
            marginX="-2.9375rem"
            padding="1.875rem 2.9375rem"
            className="payment-list-form"
            initialFocusRef={initialFocusRef}
            onDelete={removePaymentRequestItem}
            onUpdate={handlePaymentRequestItemChange}
            paymentRequestList={paymentRequest.items}
            backgroundColor="rgba(240, 238, 253, 0.22)"
          />

          <Box marginX="-2.9375rem" borderY="1px solid rgba(213, 219, 230, 0.5)">
            <Button
              width="100%"
              variant="ghost"
              fontWeight="normal"
              variantColor="blue"
              onClick={addNewPaymentRequestItem}
            >
              <Icon
                fontSize="1rem"
                name="small-add"
                borderRadius="50%"
                border="1px solid #3525E6"
              />
              <Text marginLeft=".625rem" as="span">
                Add an item
              </Text>
            </Button>
          </Box>

          <Stack
            isInline
            color="#333"
            fontSize="1rem"
            fontWeight={600}
            marginTop="2.5rem"
            marginX="-2.9375rem"
            paddingX="2.9375rem"
            paddingBottom="1rem"
            justifyContent="flex-end"
            borderBottom="1px solid rgba(213, 219, 230, 0.5)"
          >
            <Text>Total:</Text>
            <Text marginLeft="1.875rem">{`₦${formatToCurrency(paymentTotal)}`}</Text>
          </Stack>

          <MiddleA
            marginY="2.5rem"
            order_type={paymentRequest.order_type || ''}
            invoice_number={paymentRequest.invoice_number || ''}
            onChanged={(value: string, name: string) => handleRequestVariableChange(value, name)}
          />

          <MiddleB
            times={times}
            setViewControl={setViewControl}
            provider={paymentRequest.provider}
            expiration={paymentRequest.expiry_date}
          />
        </Flex>

        <FooterButtons
          marginTop="3rem"
          closeModal={closeModal}
          isCreatingLink={isCreatingLink}
          handlePaymentRequest={handlePaymentRequest}
          isDisabled={!(paymentRequest.items[0].name && paymentRequest.items[0].amount)}
        />
      </Flex>
    </ModalContent>
  );
}

function TextSwitch({
  falseText = 'Off',
  trueText = 'On',
  ...props
}: SwitchProps & {
  falseText?: string;
  trueText?: string;
}) {
  return (
    <Stack isInline spacing=".875rem" alignItems="center">
      <Switch {...props} />

      <Text color="#000" fontSize=".875rem" lineHeight="1rem">
        {props.isChecked ? trueText : falseText}
      </Text>
    </Stack>
  );
}

type ViewControlSchema = 'none' | 'delivery' | 'payment-method' | 'schedule' | 'expiration';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PaymentMethod({
  initialFocusRef,
  setViewControl,
}: CommonProps & {
  setViewControl: (v: ViewControlSchema) => void;
}) {
  const [isBankChecked, setIsBankChecked] = useState('Cards & Digital Wallets');
  const [radioText, setRadioText] = useState('');

  const c = [
    { text: 'Credit & debit cards', subText: 'Includes Apple pay & Google Pay' },
    { text: 'Debit cards only', subText: 'Does not Include Apple pay & Google Pay' },
  ];

  const methods = [
    {
      name: 'Cards & Digital Wallets',
      children: (
        <Stack isInline spacing="1.25rem">
          {c.map(({ text, subText }) => (
            <Stack
              isInline
              flex={1}
              key={text}
              alignItems="flex-start"
              padding="1.25rem"
              borderRadius="5px"
              border={`1px solid ${radioText === text ? '#0015FF' : 'rgba(213, 219, 230, 0.5)'}`}
            >
              <Radio
                onChange={() => setRadioText(text)}
                name="card-type"
                value={text}
                key={text}
                size="md"
              />

              <Box>
                <Text fontWeight={600} fontSize=".8675rem" lineHeight="1rem" color="#333">
                  {text}
                </Text>

                <Text fontWeight={600} fontSize=".675rem" lineHeight=".8675rem" marginTop=".5rem">
                  {subText}
                </Text>
              </Box>
            </Stack>
          ))}
        </Stack>
      ),
    },
    { name: 'Bank Transfer', children: null },
  ];

  return (
    <Box paddingX="1.875rem" paddingBottom="2rem">
      <Text color="#000" fontWeight={500} fontSize="1.25rem" lineHeight="1.625rem">
        Payment Methods Accepted
      </Text>

      {methods.map(({ name, children }) => (
        <Box
          key={name}
          border="1px solid rgba(213, 219, 230, 0.5)"
          borderRadius="5px"
          padding="1.25rem"
          marginTop="1rem"
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            marginBottom={children ? '1.25rem' : '0'}
          >
            <Text fontWeight={600} fontSize=".8675rem" lineHeight="1rem">
              {name}
            </Text>

            <TextSwitch
              size="md"
              color="blue"
              alignSelf="center"
              isChecked={isBankChecked === name}
              value={name}
              onChange={() => setIsBankChecked(name)}
            />
          </Flex>

          {children ? children : <Box />}
        </Box>
      ))}

      <Button
        // @ts-ignore
        leftIcon="long-arrow-back"
        variant="ghost"
        color="#828282"
        fontSize=".75rem"
        lineHeight="14px"
        padding=".25rem"
        fontWeight={600}
        height="auto"
        minWidth="auto"
        marginTop="10rem"
        onClick={() => setViewControl('none')}
      >
        Back
      </Button>
    </Box>
  );
}

function DatePicker({ values, setDate, setTime, ...props }: any) {
  const timeArray: string[] = [];
  hourArray.forEach(hour => {
    minArray.forEach(min => {
      timeArray.push(`${hour}:${min}`);
    });
  });

  return (
    <Stack isInline spacing=".5rem" fontSize=".75rem" className="request-date-picker" {...props}>
      <DatePickerComponent
        size="sm"
        value={values.date}
        onDayChange={date => setDate(date)}
        dayPickerProps={{ disabledDays: { before: new Date() } }}
      />

      <Menu>
        <MenuButton as="div">
          <Button
            width="100%"
            variant="outline"
            display="flex"
            alignItems="center"
            borderRadius="3px"
            fontWeight="normal"
            height="2rem"
            minWidth="auto"
            padding="0 1rem"
            marginLeft=".5rem"
          >
            <Text marginRight=".5rem" fontSize=".75rem">
              {values.time || 'Select time'}
            </Text>
            <Icon name="chevron-down" size=".75rem" color="#828282" />
          </Button>
        </MenuButton>

        <MenuList maxHeight="250px" overflowY="auto">
          {timeArray.map(item => (
            <MenuItem key={item} onClick={() => setTime(item)}>
              {item}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Stack>
  );
}

function OptionList({
  onPaymentRequestVariableChange,
  title,
  list,
  setViewControl,
  name,
  value: selectedText,
  subtitle,
}: CommonProps & {
  name: string;
  value: string;
  title: string;
  subtitle?: string;
  list: {
    text: string;
    subText?: string;
    value: any;
  }[];
  setViewControl: (v: ViewControlSchema) => void;
  onPaymentRequestVariableChange: (value: string, name: string) => void;
}) {
  const [values, setValues] = useState<any>({ date: endOfTomorrow(), time: '23:59' });

  const setTime = (t?: string) => {
    t && setValues({ ...values, time: t });

    const { date, time: ti } = values;
    const time = t || ti;

    if (date) {
      const [hour, minute] = time.split(':').map((item: any) => Number(item));

      // return setValue(setMinutes(setHours(values.date, hour), minute).getTime());
    }

    // return setValue(endOfTomorrow().getTime());
  };

  const setDate = (newDate?: Date) => {
    newDate && setValues({ ...values, date: newDate });

    if (newDate) {
      const { time } = values;
      const [hour, minute] = time.split(':').map((item: any) => Number(item));

      // return setValue(setMinutes(setHours(newDate, hour), minute).getTime());
    }

    // return setValue(endOfTomorrow().getTime());
  };

  const handleClick = (text: string, control?: string) => {
    if (text === 'Pick a Date') {
      setDate();
    } else {
      onPaymentRequestVariableChange(text, name);
    }

    control !== 'Pick a Date' && setViewControl('none');
  };

  return (
    <ModalContent
      maxHeight="87vh"
      maxWidth="none"
      paddingTop="2rem"
      width="52.625rem"
      borderRadius=".3125rem"
      boxShadow="0px 0px 1px rgba(67, 90, 111, 0.47)"
    >
      <ModalCloseButton size="sm" />

      <Box paddingX="1.875rem" paddingBottom="2rem">
        <Heading3>{title}</Heading3>
        {subtitle && (
          <BodyText color="gray.500" pt="1.5rem">
            {subtitle}
          </BodyText>
        )}

        <Stack spacing="2rem" pt="1.5rem">
          {list.map(({ text, subText, value }) => (
            <Flex
              key={text}
              minWidth="400px"
              cursor="pointer"
              alignItems="center"
              justifyContent="flex-start"
              onClick={() => handleClick(value)}
            >
              <Radio
                onChange={() => handleClick(value)}
                name={`${title}-options`}
                value={text}
                key={text}
                size="md"
                isChecked={value === selectedText || text.includes(' at ')}
              />

              <Box marginLeft=".5rem">
                <BodyText fontSize="0.875rem" color="gray.900">
                  {text}
                </BodyText>

                {text === 'Pick a Date' ? (
                  <DatePicker
                    marginTop=".5rem"
                    values={values}
                    setTime={setTime}
                    setDate={setDate}
                  />
                ) : (
                  subText && <SmallText color="gray.400">{subText}</SmallText>
                )}
              </Box>
            </Flex>
          ))}
        </Stack>

        <Button
          // @ts-ignore
          leftIcon="long-arrow-back"
          variant="ghost"
          color="#828282"
          fontSize=".75rem"
          padding=".25rem"
          fontWeight={600}
          height="auto"
          minWidth="auto"
          marginTop="1.5rem"
          _hover={{ bg: 'transparent' }}
          onClick={() => setViewControl('none')}
        >
          Back
        </Button>
      </Box>
    </ModalContent>
  );
}
