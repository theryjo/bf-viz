import './App.css'
import React, {useEffect, useRef} from 'react'
import useInterval from './hooks/useInterval'
import {Box, Container, Flex, SimpleGrid} from '@chakra-ui/react'
import Pane from './components/BFPane'
import TextEditor from './components/text/BFTextEditor'
import ProgramEditor from './components/program/BFProgramEditor'
import ProgramControls from './components/program/BFProgramControls'
import TapeSettings from './components/tape/BFTapeSettings'
import Tape from './components/tape/BFTape'
import BFInterpreter from './BFInterpreter'
import {BF_OPERATORS} from "@/util.ts";
import {Next} from "@/types.ts";

// @ts-ignore
import CONFIG from './config/config.toml'
// @ts-ignore
import CODE_SAMPLES from './assets/bf-samples.toml'

const CFG_TAPE_SIZES = CONFIG.options.tape_size
const CFG_TICK_INTERVALS = CONFIG.options.tick_interval
const CFG_TAPE_SIZE = CONFIG.init.tape_size
const CFG_CODE_SAMPLE = CONFIG.init.code_sample
const INIT_TAPE = new Uint8Array(CFG_TAPE_SIZE)
const INIT_INTERP = new BFInterpreter(new Uint8Array(CFG_TAPE_SIZE))
const INIT_TICK_INTERVAL = CFG_TICK_INTERVALS[1]

function App() {
  const [interpreter, setInterpreter] = React.useState(INIT_INTERP)
  const [code, setCode] = React.useState(CODE_SAMPLES.samples[CFG_CODE_SAMPLE].text)
  const [codeIdx, setCodeIdx] = React.useState(-1)
  const [codeSampleIdx, setCodeSampleIdx] = React.useState(CFG_CODE_SAMPLE)
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [tape, setTape] = React.useState(INIT_TAPE)
  const [tapeHead, setTapeHead] = React.useState(0)
  const [tapeSize, setTapeSize] = React.useState(CFG_TAPE_SIZE)

  const [isRunning, setIsRunning] = React.useState(false)
  const [tickInterval, setTickInterval] = React.useState(INIT_TICK_INTERVAL)
  const [intervalReset, setIntervalReset] = React.useState(Symbol())
  const stepLock = useRef(false)
  const isStarted = codeIdx > -1

  useEffect(() => {
    resetInterpreter()
    setOutput('')
  }, [code, tapeSize])

  useInterval(
      () => tick(),
      tickInterval,
      intervalReset
  )

  function tick() {
    if (isRunning) {
      const continued = stepInterpreter()
      if (continued && (codeIdx + 1) >= code.length) {
        setIsRunning(false)
      }
    }
  }

  function stepInterpreter() {
    if (stepLock.current) // TODO improve workaround
      return
    else {
      stepLock.current = true;
      window.setTimeout(() => stepLock.current = false)
    }

    if (codeIdx >= code.length) {
      setIsRunning(false)
      return
    } else if (codeIdx < 0 || !BF_OPERATORS.has(code[codeIdx])) {
      syncCodeSeekToken()
      return
    }

    const char = code[codeIdx]
    const result = interpreter.step(char)

    // Break and re-trigger step to bypass non-token chars
    if (!BF_OPERATORS.has(char)) {
      syncCodeContinue()
      return;
    }

    let continued = false
    switch(result.next) {
      case Next.Continue:
        syncCodeContinue(); continued = true
        break;
      case Next.Input:
        result.input?.(input.slice(-1) || '\0')
        setInput(input.slice(0, input.length - 1))
        syncCodeContinue(); continued = true
        break;
      case Next.Output:
        setOutput(output + result.output)
        syncCodeContinue(); continued = true
        break;
      case Next.LoopBack:
      case Next.LoopForward:
        syncCodeLoop()
        break;
      case Next.Error:
        console.log(`stepInterpreter() - ${result.error}`)
        break;
    }
    syncTape(interpreter)

    return continued
  }

  function syncTape(interpreter: BFInterpreter) {
    setTape(interpreter.getTape())
    setTapeHead(interpreter.getHead())
  }

  function syncCodeSeekToken() {
    let idx = codeIdx
    while (idx < code.length && (idx < 0 || !BF_OPERATORS.has(code[idx]))) {
      idx++
    }
    setCodeIdx(idx)
  }

  function syncCodeContinue() {
    setCodeIdx(codeIdx + 1)
  }

  function syncCodeLoop() {
    setCodeIdx(loopSeek(codeIdx))
  }

  function loopSeek(idx: number): number {
    const codeChar = code[idx]
    if (codeChar !== '[' && codeChar !== ']')
      return -1

    const bktSt = codeChar
    const bktFn = codeChar === '[' ? ']' : '['
    const dir = bktSt === '[' ? 1 : -1
    let found = -1
    let ct = 0; // Nested loop ct
    for (let i = idx + dir; i > 0 && i < code.length; i += dir) {
      if (code[i] === bktSt) {
        ct++;
      } else if (code[i] === bktFn) {
        if (ct === 0) {
          found = i;
          break;
        }
        ct--;
      }
    }

    return found
  }

  function resetInterval() {
    setIntervalReset(Symbol())
  }

  function resetInterpreter() {
    const interp = new BFInterpreter(new Uint8Array(tapeSize))
    setInterpreter(interp)
    setCodeIdx(-1)
    setIsRunning(false)
    syncTape(interp)
  }

  function handlePlay() {
    if (codeIdx === -1) {
      stepInterpreter()
    } else if (codeIdx >= code.length) {
      resetInterpreter()
    }
    setIsRunning(true)
    resetInterval()
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleStepForward() {
    setIsRunning(false)
    stepInterpreter()
  }

  function handleReset() {
    setIsRunning(false)
    setOutput('')
    resetInterpreter()
  }

  function handleChangeTapeSize(size: number) {
    setTapeSize(size)
  }

  function handleLoadCodeSample(idx: number) {
    setCodeSampleIdx(idx)
    setCode(CODE_SAMPLES.samples[idx]?.text || '')
  }

  function handleSelectRunSpeed(tickInterval: number) {
      setTickInterval(tickInterval)
  }

  return (
    <>
      <Container
        w="container.sm"
        p="0"
        minH="container.md"
        maxW="container.sm"
      >
        <SimpleGrid
            columns={1}
            rowGap='10px'
        >
          <Pane>
            <TapeSettings
                tapeSize={tapeSize}
                tapeSizes={CFG_TAPE_SIZES}
                onChangeSize={handleChangeTapeSize}
            ></TapeSettings>
            <Flex flexDirection='column' bg='white'>
              <Tape
                  tape={tape}
                  head={tapeHead}
              />
            </Flex>
          </Pane>

          <Pane>
            <Flex flexDirection='column' h='full'>
              <div style={{ width: '80px', margin: '0 auto' }}>I/O</div>
              <Box bg='gray.500'>
                <TextEditor
                    text={input}
                    label="Input"
                    onTextUpdate={(text) => setInput(text)}
                ></TextEditor>
                <Box h='1px' bg='gray.500'></Box>
                <TextEditor
                    text={output}
                    label="Output"
                    onTextUpdate={(text) => setOutput(text)}
                    readOnly={true}
                ></TextEditor>
              </Box>
            </Flex>
          </Pane>

          <Box
              minH='sm'
          >
            <Pane
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
            >
              <ProgramControls
                  isStarted={isStarted}
                  isRunning={isRunning}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStepForward={handleStepForward}
                  onReset={handleReset}
                  codeSamples={CODE_SAMPLES.samples}
                  codeSampleIdx={codeSampleIdx}
                  tickIntervals={CFG_TICK_INTERVALS}
                  onSelectCodeSample={handleLoadCodeSample}
                  onSelectRunSpeed={handleSelectRunSpeed}
              ></ProgramControls>
              <ProgramEditor
                  code={code}
                  codeSamples={CODE_SAMPLES.samples}
                  onProgramUpdate={(text) => setCode(text)}
                  codeIdx={codeIdx} // TODO tokenIdx
              ></ProgramEditor>
            </Pane>
          </Box>
        </SimpleGrid>
      </Container>
    </>
  )
}

export default App
