import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  GeneralHtmlSupport,
  Heading,
  HtmlComment,
  HtmlEmbed,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  ShowBlocks,
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
  DecoupledEditor, BalloonToolbar, Code, FindAndReplace, FontBackgroundColor, FontColor, FontFamily, FontSize, Highlight, Mention, RemoveFormat, SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials, SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText, TextPartLanguage

} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { EntryType } from 'perf_hooks';

type ImportData = {
  editorKey: string;
  className: string;
  currentEntry: EntryType | any;
  setCurrentEntry: React.Dispatch<React.SetStateAction<EntryType>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSave: ()=> void;
}

export default function Editor({ editorKey, className, currentEntry, setCurrentEntry, content, setContent, handleSave }: ImportData) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [val, setVal] = useState(0);
  const handleChange = (event: any, editor: any) => {
    const data = editor.getData();
    setContent(data);
    setVal(val+1);
  };

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'highlight',
        'fontColor',
        'fontBackgroundColor',
        'code',
        'removeFormat',
        '|',
        'sourceEditing',
        '|',
        'link',
        'insertTable',
        'blockQuote',
        'htmlEmbed',
        'showBlocks',
        'indent',
        'outdent',
        '|',
        'selectAll',
        'undo',
        'redo',
        'specialCharacters',
        'findAndReplace',
        'accessibilityHelp',
        'textPartLanguage',
        'tableCellProperties',
        'tableProperties',
        'fontSize',
        'fontFamily',
        // Add any additional toolbar items as needed
      ],

      shouldNotGroupWhenFull: false
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Code,
      DecoupledEditor,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HtmlComment,
      HtmlEmbed,
      Indent,
      IndentBlock,
      Italic,
      Link,
      Mention,
      Paragraph,
      RemoveFormat,
      SelectAll,
      ShowBlocks,
      SourceEditing,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      Underline,
      Undo,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText


    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4'
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5'
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6'
        }
      ]
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true
        }
      ]
    },
    initialData:
      '',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    }
  };
  useEffect(()=> {
    if(val >= 10){
      handleSave();
      setVal(0);
    }
  }, [val])
  return (
    <>
      <div className={'editor-container ' + className}>
        <CKEditor
          key={editorKey}
          editor={ClassicEditor}
          data={content}
          onChange={handleChange}
          config={editorConfig} />
      </div>
    </>
  );
}
