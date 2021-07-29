import { Box, BoxProps, Icon, Stack } from '@chakra-ui/core';
import Editor, { PluginEditorProps } from '@draft-js-plugins/editor';
import '@draft-js-plugins/mention/lib/plugin.css';
import styled from '@emotion/styled';
import { XSmallText } from 'app/components';
import { ContentBlock, ContentState, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import React, { forwardRef } from 'react';

type StyleButtonProps = {
  icon?: string;
  style: string;
  label?: string;
  active: boolean;
  onToggle(e: any): void;
};

type DraftEditorControlType = {
  label?: string;
  icon?: string;
  style: string;
};

type DraftEditorControlsProps = {
  editorState: EditorState;
  types?: DraftEditorControlType[];
  onToggle: StyleButtonProps['onToggle'];
};

type DraftEditorContainerProps = BoxProps & { activeButtonColor?: string };

export const DraftEditorContainer = styled(Box)<DraftEditorContainerProps>`
  .RichEditor-editor {
    height: 100%;
    cursor: text;
    font-size: 1rem;

    .public-DraftEditor-content {
      height: 100%;
      overflow: auto;
    }

    .public-DraftEditor-content,
    .public-DraftEditorPlaceholder-root {
      margin: 0.5rem 0;
    }

    .public-DraftEditorPlaceholder-inner {
      position: relative;
      top: -7px;
    }

    .RichEditor-blockquote {
      border-left: 5px solid #eee;
      color: #666;
      font-family: 'Hoefler Text', 'Georgia', serif;
      font-style: italic;
      margin: 1rem 0;
      padding: 0.5rem 1.5rem;
    }

    .public-DraftStyleDefault-pre {
      font-size: 1rem;
      padding: 1.5rem;
      background-color: rgba(0, 0, 0, 0.05);
      font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    }
  }

  .RichEditor-hidePlaceholder {
    .public-DraftEditorPlaceholder-root {
      display: none;
    }
  }

  .RichEditor-styleButton {
    color: #999;
    padding: 4px;
    cursor: pointer;
    display: inline-block;
    border-radius: 8px;
  }

  .RichEditor-activeButton {
    background-color: ${props => props.activeButtonColor ?? '#f0eefd'};
  }
`;

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const BLOCK_TYPES: DraftEditorControlType[] = [
  { style: 'unordered-list-item', icon: 'inbox-compose-ul' },
  { style: 'ordered-list-item', icon: 'inbox-compose-ol' },
];

const INLINE_STYLES: DraftEditorControlType[] = [
  { style: 'BOLD', icon: 'inbox-compose-bold' },
  { style: 'ITALIC', icon: 'inbox-compose-italic' },
  { style: 'UNDERLINE', icon: 'inbox-compose-underline' },
  { style: 'CODE', icon: 'inbox-compose-code' },
];

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return '';
  }
}

export const DraftEditor = forwardRef((props: PluginEditorProps, ref: any) => {
  const { editorState, onChange, placeholder, ...rest } = props;
  let className = 'RichEditor-editor';
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: any): string | null => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return 'editor-tab';
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <Box className={className}>
      <Editor
        ref={ref}
        spellCheck
        stripPastedStyles
        onChange={onChange}
        placeholder={placeholder}
        customStyleMap={styleMap}
        editorState={editorState}
        blockStyleFn={getBlockStyle}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        {...rest}
      />
    </Box>
  );
});

export const BlockStyleControls = (props: DraftEditorControlsProps) => {
  const { editorState, onToggle, types = BLOCK_TYPES } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <Stack isInline alignItems="center" spacing="1rem">
      {types.map(type => (
        <Box key={type.style}>
          <StyleButton
            icon={type.icon}
            key={type.label}
            label={type.label}
            style={type.style}
            onToggle={onToggle}
            active={type.style === blockType}
          />
        </Box>
      ))}
    </Stack>
  );
};

export const InlineStyleControls = ({
  editorState,
  types = INLINE_STYLES,
  onToggle,
}: DraftEditorControlsProps) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <Stack isInline alignItems="center" spacing="1rem">
      {types.map(type => (
        <Box key={type.style}>
          <StyleButton
            icon={type.icon}
            key={type.label}
            label={type.label}
            style={type.style}
            onToggle={onToggle}
            active={currentStyle.has(type.style)}
          />
        </Box>
      ))}
    </Stack>
  );
};

const StyleButton = ({ style, icon, active, label, onToggle }: StyleButtonProps) => {
  const handleToggle = (e: any) => {
    e.preventDefault();
    onToggle(style);
  };

  let className = 'RichEditor-styleButton';
  if (active) {
    className += ' RichEditor-activeButton';
  }

  return (
    <span className={className} onMouseDown={handleToggle}>
      <Stack isInline alignItems="center">
        {icon && <Icon name={icon} size="18px" />}
        {label && <XSmallText>{label}</XSmallText>}
      </Stack>
    </span>
  );
};

const HANDLE_REGEX = /@[\w]+/g;
const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g;

export function handleStrategy(
  contentBlock: ContentBlock,
  callback: (start: number, len: number) => void,
  contentState: ContentState,
) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

export function hashtagStrategy(
  contentBlock: ContentBlock,
  callback: (start: number, len: number) => void,
) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

export function findWithRegex(
  regex: RegExp,
  contentBlock: ContentBlock,
  callback: (start: number, len: number) => void,
) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export const HandleSpan = (props: any) => {
  return (
    <span
      style={{
        direction: 'ltr',
        unicodeBidi: 'bidi-override',
        color: 'rgba(98, 177, 254, 1.0)',
      }}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};

export const HashtagSpan = (props: any) => {
  return (
    <span
      style={{
        color: 'rgba(95, 184, 138, 1.0)',
      }}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};
