import React, { useState } from 'react';
import Input from './input';
import { placeholderCount } from './utils';

export const App = () => {
  const [text, setText] = useState('');
  const template = 'xxx xxxx xxxx';
  const placeholder = 'x';
  const countPlaceholder = placeholderCount(placeholder, template);
  const formatter = (value: string) => {
    if (!value) {
      return { text: '', template };
    }
    let filledValue = '',
      charIndex = 0;
    for (const char of template.split('')) {
      if (char !== placeholder) {
        filledValue += char;
        continue;
      }
      filledValue += value[charIndex];
      charIndex++;

      if (charIndex === value.length) {
        if (value.length < countPlaceholder) {
          break;
        }
      }
    }
    return { text: filledValue, template };
  };
  return (
    <>
      <Input
        parse={(char, value) => {
          if (value.length < countPlaceholder) {
            return isNaN(parseInt(char)) ? undefined : char;
          }
        }}
        format={formatter}
        onChange={value => {
          setText(value);
        }}
        value={text}
      />
    </>
  );
};
