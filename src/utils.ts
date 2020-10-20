import { KeyboardEvent } from 'react';

export interface InputSelection {
  start: number;
  end: number;
}

export interface InputState {
  value: string;
  caretPosition: number;
}

export function placeholderCount(placeholder: string, template: string) {
  let count = 0;
  for (const char of template.split('')) {
    if (char === placeholder) {
      count++;
    }
  }
  return count;
}

export function getSelection(elem: HTMLInputElement) {
  if (elem.selectionStart === elem.selectionEnd) {
    return;
  }
  return { start: elem.selectionStart, end: elem.selectionEnd } as InputSelection;
}

export enum Operation {
  Backspace = 'Backspace',
  Delete = 'Delete'
};

export function getOperation(event: KeyboardEvent) {
  switch (event.key) {
    case Operation.Backspace:
    case Operation.Delete:
      return event.key;
  }
}

export function getCaretPosition(elem: HTMLInputElement) {
  return elem.selectionStart;
}

export function setCaretPosition(elem: HTMLInputElement, position: number | null) {
  if (position === null) {
    return;
  }

  if (isAndroid()) {
    setTimeout(() => elem.setSelectionRange(position, position));
  } else {
    elem.setSelectionRange(position, position);
  }

}

export function edit(value: string, caretPosition: number, operation: Operation) {
  switch (operation) {
    case Operation.Backspace:
      if (caretPosition > 0) {
        value = value.slice(0, caretPosition - 1) + value.slice(caretPosition);
        caretPosition--;
      }
      break;
    case Operation.Delete:
      value = value.slice(0, caretPosition) + value.slice(caretPosition);
      break;
  }

  return { value, caretPosition } as InputState;
}

function isAndroid() {
  return /Android/i.test(window?.navigator?.userAgent ?? '');
}

