import React, {ChangeEvent} from "react";
import {Button, Radio, RadioGroup, Select, SimpleGrid, Stack} from "@chakra-ui/react"
import {FiPlay, FiPause, FiSquare, FiSkipForward} from 'react-icons/fi'
import {BFCodeSample} from "@/types";

// For now, hardcoded set of 3 tick indices to simplify UI/labels
const TICK_LOW = 0
const TICK_MED = 1
const TICK_HIGH = 2

interface Props {
    isStarted: boolean,
    isRunning: boolean,
    onPlay: () => void,
    onPause: () => void,
    onStepForward: () => void,
    onReset: () => void,
    codeSamples: BFCodeSample[],
    codeSampleIdx: number,
    tickIntervals: number[],
    onSelectCodeSample: (idx: number) => void,
    onSelectRunSpeed: (tickInterval: number) => void
}

export default function ProgramControls(props: Props) {
    const playBtn = <FiPlay />
    const pauseBtn = <FiPause />
    const nextBtn = <FiSkipForward />
    const resetBtn = <FiSquare />
    const showPlay = !props.isRunning || !props.isStarted
    const [tickInterval, setTickInterval] = React.useState(
        props.tickIntervals[TICK_MED]
    )

    function onPlayPause() {
        showPlay ? props.onPlay() : props.onPause()
    }

    function onChangeSample(e: ChangeEvent<HTMLSelectElement>) {
        const selIdx = e.currentTarget.value
        props.onSelectCodeSample(parseInt(selIdx))
    }

    function onChangeSpeed(val: string) {
        const speed = parseInt(val)
        setTickInterval(speed)
        props.onSelectRunSpeed(speed)
    }

    function renderControlsBtn(el: JSX.Element, handler: React.MouseEventHandler<HTMLButtonElement>) {
        return <Button
            _focus={{boxShadow: "none", outline: "none",}}
            size="xs"
            onClick={handler}
            style={{margin: '0 2px',fontSize: '16px'}}
        >{ el }</Button>
    }

    return <div>
        <SimpleGrid columns={3}>
            <div style={{ marginLeft: '5px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <RadioGroup
                    onChange={onChangeSpeed}
                    value={tickInterval.toString()}
                >
                    <Stack direction='row'>
                        <Radio value={props.tickIntervals[TICK_LOW].toString()}>Slow</Radio>
                        <Radio value={props.tickIntervals[TICK_MED].toString()} defaultChecked={true}>Med</Radio>
                        <Radio value={props.tickIntervals[TICK_HIGH].toString()}>Fast</Radio>
                    </Stack>
                </RadioGroup>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                { renderControlsBtn(showPlay ? playBtn : pauseBtn, onPlayPause) }
                { renderControlsBtn(nextBtn, props.onStepForward) }
                { renderControlsBtn(resetBtn, props.onReset) }
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{flexBasis: 'content'}}>
                    <Select
                        size='md'
                        value={props.codeSampleIdx}
                        onChange={onChangeSample}
                        style={{flexBasis: 'min-content'}}
                    >
                        {props.codeSamples.map((cs, idx) =>
                            <option
                                key={cs.name}
                                value={idx}
                            >{cs.name}</option>
                        )}
                    </Select>
                </div>
            </div>
        </SimpleGrid>
    </div>
}
