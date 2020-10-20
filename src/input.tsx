import React, {
  MutableRefObject,
  ClipboardEvent,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
  useRef,
  ClipboardEventHandler,
  KeyboardEventHandler
} from 'react';
import { Formatter } from './format';
import * as InputHandler from './input-handler';
import { Parser } from './parse';

interface InputProps {
  parse: Parser;
  format: Formatter;
  value: string;
  onChange: InputHandler.InputChangeHandler;
  onKeyDown?: KeyboardEventHandler;
  onCut?: ClipboardEventHandler;
  onPaste?: ClipboardEventHandler;
}

export default React.forwardRef<HTMLInputElement, InputProps>(
  ({ parse, format, value, onChange, onKeyDown, onCut, onPaste }, ref) => {
    let elem = ref ? (ref as MutableRefObject<HTMLInputElement>).current : null;
    const ownRef = useRef<HTMLInputElement>(elem) as MutableRefObject<HTMLInputElement>;
    const _onChange = useCallback(
      (event: ChangeEvent) => InputHandler.onInputChange(event, ownRef.current, parse, format, onChange),
      [ownRef, parse, format, onChange]
    );
    const _onCut = useCallback(
      (event: ClipboardEvent) => {
        onCut && onCut(event);
        InputHandler.onInputCut(event, ownRef.current, parse, format, onChange);
      },
      [ownRef, parse, format, onChange, onCut]
    );
    const _onPaste = useCallback(
      (event: ClipboardEvent) => {
        onPaste && onPaste(event);
        InputHandler.onInputPaste(event, ownRef.current, parse, format, onChange);
      },
      [ownRef, parse, format, onChange, onPaste]
    );
    const _onKeyDown = useCallback(
      (event: KeyboardEvent) => {
        onKeyDown && onKeyDown(event);
        InputHandler.onInputKeyDown(event, ownRef.current, parse, format, onChange);
      },
      [ownRef, parse, format, onChange, onKeyDown]
    );
    return (
      <input
        ref={ownRef}
        onCut={_onCut}
        onPaste={_onPaste}
        onKeyDown={_onKeyDown}
        onChange={_onChange}
        value={format(value ?? '').text}
      />
    );
  }
);
