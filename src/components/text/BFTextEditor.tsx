import {highlight, languages} from 'prismjs'
import './BFTextEditor.css'
import Editor from 'react-simple-code-editor'

interface Props  {
  text: string,
  label?: string,
  readOnly?: boolean,
  onTextUpdate: (code: string) => void,
}

export default function TextEditor( {text, label, onTextUpdate, readOnly = false}: Props) {
    function renderLabel() {
      if (label) {
        return <div style={{
          color: '#999',
          fontSize: '0.9rem',
          position: 'absolute',
          top: '1px',
          right: '5px',
          zIndex: '1'
        }}>{label}</div>
      }
      return null
    }

    return <>
        <div style={{ position: 'relative' }}>
          { renderLabel() }
          <Editor
              className='bf-editor'
              value={text}
              onValueChange={text => { onTextUpdate(text) }}
              highlight={text => highlight(text, languages.plain, 'js')}
              padding={10}
              style={{
                flexGrow: 1,
                margin: '2 2 2px 2',
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                backgroundColor: '#2d2d2d'
              }}
              readOnly={readOnly}
          />
        </div>
    </>
}
