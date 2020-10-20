import { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { format, Formatter } from "./format";
import { parse, Parser } from "./parse";
import { edit, getCaretPosition, getOperation, getSelection, InputSelection, Operation, setCaretPosition } from "./utils";

export type InputChangeHandler = (value: string) => void;

function eraseSelection(elem: HTMLInputElement, selection: InputSelection) {
  let text = elem.value.slice(0, selection.start) + elem.value.slice(selection.end);
  elem.value = text;
  setCaretPosition(elem, selection.start);
}

export function onInputChange(_event: ChangeEvent, elem: HTMLInputElement, _parse: Parser, _format: Formatter, onChange: InputChangeHandler) {
  formatInputText(elem, _parse, _format, onChange);
}

export function onInputPaste(_event: ClipboardEvent, elem: HTMLInputElement, _parse: Parser, _format: Formatter, onChange: InputChangeHandler) {
  const selection = getSelection(elem);

  if (selection) {
    eraseSelection(elem, selection);
  }

  formatInputText(elem, _parse, _format, onChange);
}

export function onInputCut(_event: ClipboardEvent, elem: HTMLInputElement, _parse: Parser, _format: Formatter, onChange: InputChangeHandler) {
  setTimeout(() => formatInputText(elem, _parse, _format, onChange));
}

export function onInputKeyDown(event: KeyboardEvent, elem: HTMLInputElement, _parse: Parser, _format: Formatter, onChange: InputChangeHandler) {
  const operation = getOperation(event);

  switch (operation) {
    case Operation.Delete:
    case Operation.Backspace:
      event.preventDefault();
      const selection = getSelection(elem);

      if (selection) {
        eraseSelection(elem, selection);
        return formatInputText(elem, _parse, _format, onChange);
      }
      return formatInputText(elem, _parse, _format, onChange, operation);
  }
}

function formatInputText(elem: HTMLInputElement, _parse: Parser, _format: Formatter, onChange: InputChangeHandler, operation?: Operation) {
  let { value, caretPosition } = parse(elem.value, getCaretPosition(elem), _parse);

  if (operation && caretPosition !== null) {
    const editedInputState = edit(value, caretPosition, operation);
    value = editedInputState.value;
    caretPosition = editedInputState.caretPosition;
  }

  const formatted = format(value, caretPosition, _format);

  elem.value = formatted.value;
  caretPosition = formatted.caretPosition;

  setCaretPosition(elem, caretPosition);
  onChange(value);
}
