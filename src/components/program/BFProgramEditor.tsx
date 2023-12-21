import './BFProgramEditor.css'
import 'prismjs/components/prism-brainfuck'
import 'prismjs/themes/prism-tomorrow.css'
import {useEffect} from "react";
import {highlight, languages} from 'prismjs'
import Editor from 'react-simple-code-editor'
import {getTokenIdx} from "@/util.ts";
import {BFCodeSample} from "@/types";

const RUN_CURSOR_CLASS = 'token-hl'

function renderRunCursor(tokenIdx: number) {
  const all = document.querySelectorAll('.bf-editor span:not(.comment)')
  all.forEach((el => { el.classList.remove(RUN_CURSOR_CLASS) }))
  if (all?.[tokenIdx]) {
    all?.[tokenIdx]?.classList.add(RUN_CURSOR_CLASS)
  }
}

interface Props {
  code: string,
  codeSamples: BFCodeSample[],
  onProgramUpdate: (code: string) => void,
  codeIdx: number
}

export default function ProgramEditor({code, onProgramUpdate, codeIdx}: Props) {
  useEffect(() => {
    renderRunCursor(
        getTokenIdx(code, codeIdx)
    )
  }, [codeIdx])

  return (
      <Editor
          className='bf-editor'
          value={code}
          onValueChange={text => { onProgramUpdate(text) }}
          highlight={text => highlight(text, languages.brainfuck, 'js')}
          padding={10}
          style={{
            overflow: 'auto',
            width: '100%',
            height: '100%',
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            backgroundColor: '#2d2d2d'
          }}
      />
  )
}
