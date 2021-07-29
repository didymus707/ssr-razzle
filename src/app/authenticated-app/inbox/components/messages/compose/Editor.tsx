import TextareaAutosize from 'react-textarea-autosize';
import React from 'react';
import { EditorProps } from '../../../inbox.types';
import ContentEditable from 'react-contenteditable';

export function Editor({ textAreaRef, handleSubmit, isTemplateMode, ...rest }: EditorProps) {
  const keysPressed: any = {};

  const handleKeyDown = (e: any) => {
    keysPressed[e.key] = true;

    if (keysPressed['Shift'] && keysPressed['Enter']) {
      return;
    }

    if (keysPressed['Enter']) {
      e.preventDefault();
      return handleSubmit && handleSubmit();
    }
  };

  const handleKeyUp = (v: string) => {
    keysPressed[v] = false;
  };

  return isTemplateMode ? (
    // <div
    //   style={rest.style}
    //   contentEditable={true}
    //   className="message-compose"
    //   dangerouslySetInnerHTML={{ __html: rest.value as string }}
    // />
    <ContentEditable
      disabled={false}
      placeholder={rest.placeholder}
      html={(rest.value as string) ?? ''}
      style={{ height: 150, ...rest.style }}
      onPaste={(event: any) => {
        event.preventDefault();
        const text = event.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
      }}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          document.execCommand('insertLineBreak');
          event.preventDefault();
        }
      }}
      onChange={event => rest?.setText?.(event.target.value)}
    />
  ) : (
    <TextareaAutosize
      id="message"
      className="message"
      onKeyDown={handleKeyDown}
      onKeyUp={(e: any) => handleKeyUp(e.key)}
      ref={textAreaRef}
      {...rest}
    />
  );
}
