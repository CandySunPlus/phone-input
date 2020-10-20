import React, { useState } from 'react';
import Input from './input';

export const App = () => {
  const [text, setText] = useState("");
  return <>
    <Input parse={(char) => char } format={(value) => ({ text: value })} onChange={(value) => { setText(value) }} value={text} />
  </>;
};
