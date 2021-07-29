import React from 'react';
import logo from './logo.png';
import logoText from './logo-text.svg';

const logoTypeRegister: {
  [key: string]: string;
} = {
  text: logoText,
  image: logo,
};

export default function Logo({ width = '80px', type = 'text' }) {
  return <img width={width} src={logoTypeRegister[type]} alt="Simpu" />;
}
