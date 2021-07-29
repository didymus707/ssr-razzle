import React from 'react';

type State = {
  loaded: boolean;
};

type Props = {
  email?: string;
  amount: number;
  first_name?: string;
  last_name?: string;
  currency?: string;
  phoneNumber?: string;
  redirect_url?: string;
  payment_options?: string;
  callback?: (data?: any) => void;
  render: (onClick: () => void, loaded: boolean) => React.ReactNode;
};

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export class RavepayButton extends React.Component<Props, State> {
  state = {
    loaded: false,
  };
  onClick = () => {
    const {
      email,
      amount,
      last_name,
      callback,
      first_name,
      phoneNumber,
      currency = 'NGN',
      payment_options = 'card',
    } = this.props;
    var x =
      window.FlutterwaveCheckout &&
      window.FlutterwaveCheckout({
        amount,
        currency,
        payment_options,
        tx_ref: 'hooli-tx-1920bbtyt',
        customer: {
          email,
          phone_number: phoneNumber,
          name: `${first_name} ${last_name}`,
        },
        public_key: process.env.REACT_APP_FLUTTERWAVE_TEST_PUBLIC_KEY,
        callback: function (data: any) {
          callback && callback(data);
          x.close();
        },
        onclose: function () {},
        customizations: {
          title: 'Simpu',
          description: 'Easy and simple business communications',
          logo:
            'https://res.cloudinary.com/techcre8/image/upload/v1595803312/logo_ho1xg7.png',
        },
      });
  };
  componentWillMount() {
    if (!!window.FlutterwaveCheckout === false) {
      let ravepay = document.createElement('script');
      ravepay.src = 'https://checkout.flutterwave.com/v3.js';
      document.body.appendChild(ravepay);
      this.setState({
        loaded: true,
      });
    }
  }
  componentDidMount() {
    if (!!window.FlutterwaveCheckout) {
      console.log('loaded');
    }
  }
  render() {
    return (
      <form>
        {this.state.loaded
          ? this.props.render(this.onClick, this.state.loaded)
          : null}
      </form>
    );
  }
}
