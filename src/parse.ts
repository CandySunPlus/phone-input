import { InputState } from './utils';

export type Parser = (char: string, value: string) => string | undefined;

export function parse(text: string, caretPosition: number | null, parser: Parser): InputState {
  let value = '',
    focusedIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = parser(text[i], value);

    if (char === undefined) {
      continue;
    }

    value += char;

    if (caretPosition !== null) {
      if (caretPosition === i) {
        focusedIndex = value.length - 1;
      } else if (caretPosition > i) {
        focusedIndex = value.length;
      }
    }
  }

  if (caretPosition === null) {
    focusedIndex = value.length;
  }

  return {
    value,
    caretPosition: focusedIndex
  };
}
