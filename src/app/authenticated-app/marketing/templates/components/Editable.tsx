import { Box, BoxProps } from '@chakra-ui/core';
import styled from '@emotion/styled';
import * as React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
//@ts-ignore
import sanitizeHtml from 'sanitize-html';
import { html2Text } from '../templates.utils';

type EditableState = {
  raw: string;
  html: string;
};

type EditableProps = {
  value: string;
  tagName?: string;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  innerRef?: Function | React.RefObject<HTMLElement>;
} & Omit<BoxProps, 'onChange' | 'onBlur'>;

export class Editable extends React.Component<EditableProps, EditableState> {
  state = {
    raw: html2Text(this.props.value) || '',
    // html: this.props.value ? this.props.value : '',
    html: this.props.value ? convertToHTML(this.props.value) : '',
  };

  componentDidUpdate(prevProps: EditableProps) {
    const { value: previousValue } = prevProps;
    const { value: nextValue } = this.props;
    if (previousValue !== nextValue) {
      this.setState({
        raw: nextValue,
        html: sanitizeHtml(convertToHTML(nextValue), this.sanitizeConf),
      });
    }
  }

  handleChange = (evt: ContentEditableEvent) => {
    const { onChange } = this.props;
    const html = evt.target.value;

    this.setState({ html }, () => {
      onChange && onChange(html);
    });
  };

  sanitizeConf = {
    allowedTags: ['a', 'span'],
    allowedAttributes: { a: ['href'], span: ['class'] },
    parser: { decodeEntities: true },
  };

  sanitize = () => {
    const { onBlur } = this.props;
    const html = sanitizeHtml(this.state.html, this.sanitizeConf);

    this.setState({ html }, () => {
      onBlur && onBlur(html);
    });
  };

  pastePlainText = (evt: any) => {
    evt.preventDefault();

    const text = evt.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  render = () => {
    const {
      onBlur,
      innerRef,
      onChange,
      isDisabled,
      placeholder,
      tagName = 'div',
      className = 'editable',
      ...rest
    } = this.props;
    return (
      <EditableContainer {...rest}>
        <ContentEditable
          tagName={tagName}
          innerRef={innerRef}
          className={className}
          disabled={isDisabled}
          html={this.state.html}
          onBlur={this.sanitize}
          placeholder={placeholder}
          onChange={this.handleChange}
          onPaste={this.pastePlainText}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              document.execCommand('insertLineBreak');
              event.preventDefault();
            }
          }}
        />
      </EditableContainer>
    );
  };
}

const EditableContainer = styled(Box)`
  .editable {
    width: 100%;
    resize: none;
    outline: none;
    padding: 0.75rem;
    overflow-x: auto;
    line-height: 24px;
    font-size: 0.875rem;
    word-wrap: break-word;
    white-space: pre-wrap;
    border-radius: 0.5rem;
    border: 1px solid #858c94;
    height: ${(props: BoxProps) => props.height || '200px'};

    &:hover {
      border-color: #cbd5e0;
    }

    &:focus {
      border-color: #3182ce;
      box-shadow: 0 0 0 1px #3182ce;
    }

    a {
      color: #054ada;
      text-decoration: none;
    }

    .tag {
      color: #0043ce;
      display: inline;
      border-radius: 100px;
      padding: 0.2rem 0.5rem;
      background-color: #d0e2ff;
    }
  }
`;

const convertToHTML = (input: string) => {
  const array = input.split(' ');
  return array
    .map(item => {
      if (item.startsWith('{{')) {
        return `<span class="tag">${item}</span> `;
      }
      return item;
    })
    .join(' ');
};
