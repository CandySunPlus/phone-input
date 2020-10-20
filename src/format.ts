import { InputState } from "./utils";

export type Formatter = (value: string) => { text?: string; template?: string; };

export function format(value: string, caretPosition: number | null, formatter: Formatter): InputState {
  let { text, template } = formatter(value) ?? {};
  text = text ?? value;
  if (!template) {
    return { value: text, caretPosition: caretPosition ?? text.length };
  }
  if (caretPosition === null) {
    caretPosition = caretPosition ?? text.length;
  } else {
    let found = false, lastInputIndex = -1;
    for (let i = 0; i < text.length && i < template?.length; i++) {
      if (text[i] !== template[i]) {
        if (caretPosition === 0) {
          found = true;
          caretPosition = i;
          break;
        }
        lastInputIndex = i;
        caretPosition--;
      }
    }

    if (!found) {
      caretPosition = lastInputIndex + 1;
    }
  }
  return { value: text, caretPosition };
}

