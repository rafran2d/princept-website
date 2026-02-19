import React from 'react';
import InlineTextEditor from './InlineTextEditor';
import { useInlineEditor } from '../hooks/useInlineEditor';

const EditableText = ({
  sectionId,
  fieldPath,
  placeholder = 'Cliquez pour éditer...',
  tag = 'span',
  className = '',
  style = {},
  multiline = false,
  disabled = false,
  children,
  ...props
}) => {
  const { createInlineEditorProps } = useInlineEditor(sectionId);

  const editorProps = createInlineEditorProps(fieldPath, {
    placeholder,
    tag,
    className,
    style,
    multiline,
    disabled
  });

  return (
    <InlineTextEditor
      {...editorProps}
      {...props}
    >
      {children}
    </InlineTextEditor>
  );
};

// Composants spécialisés pour différents types de texte
export const EditableTitle = (props) => (
  <EditableText
    tag="h2"
    className="editable-title"
    placeholder="Titre de la section"
    {...props}
  />
);

export const EditableSubtitle = (props) => (
  <EditableText
    tag="h3"
    className="editable-subtitle"
    placeholder="Sous-titre"
    {...props}
  />
);

export const EditableDescription = (props) => (
  <EditableText
    tag="p"
    className="editable-description"
    placeholder="Description de la section"
    multiline={true}
    {...props}
  />
);

export const EditableButton = (props) => (
  <EditableText
    tag="span"
    className="editable-button-text"
    placeholder="Texte du bouton"
    {...props}
  />
);

export const EditableHeading = ({ level = 1, ...props }) => (
  <EditableText
    tag={`h${level}`}
    className={`editable-heading editable-h${level}`}
    placeholder={`Titre niveau ${level}`}
    {...props}
  />
);

export default EditableText;