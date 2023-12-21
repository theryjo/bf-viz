import {BF_OPERATORS} from "@/util.ts";
import {Next, Result} from "@/types.ts";

export const RESULT_AWAIT_INPUT = {
    next: Next.Input,
    input: null, // To fill
    output: null,
    error: null,
}

export const RESULT_INPUT_REQUIRED= {
    next: Next.Error,
    input: null, // To fill
    output: null,
    error: 'Input required, submit char to last result input()',
}

export const RESULT_CONTINUE = {
    next: Next.Continue,
    input: null,
    output: null,
    error: null,
}

export const RESULT_OUTPUT = {
    next: Next.Output,
    input: null,
    output: null, // To fill
    error: null,
}

export default class BFInterpreter {
    #head = 0
    #output = '' as string | null
    #awaitInput = false // Handling for ',' operator
    #loopJump = null as Next.LoopBack | Next.LoopForward | null // Handling for ']' operator
    #stepCt = 0
    #tape

    constructor(tape: Uint8Array) {
        this.#tape = tape
    }

    #createInputFn() {
        let completed = false
        return (char: string) => {
            const charVal = char?.[0]?.charCodeAt(0)
            if (charVal && !completed) {
                this.#tape[this.#head] = charVal
                this.#awaitInput = false
                completed = true
            }
        }
    }

    step(char: string): Result {
        this.#loopJump = null
        if (this.#awaitInput) {
            return {
                ...RESULT_INPUT_REQUIRED,
                input: this.#createInputFn()
            }
        }
        if (!this.isTokenChar(char)) {
            return {
                ...RESULT_CONTINUE
            }
        }

        this.stepToken(char)
        if (this.#awaitInput) {
            return {
                ...RESULT_AWAIT_INPUT,
                input: this.#createInputFn()
            }
        }
        if (this.#output) {
            const output = this.#output
            this.#output = null
            return {
                ...RESULT_OUTPUT,
                output: output
            }
        }
        return {
            next: this.#loopJump || Next.Continue,
            output: null,
            input: null,
            error: null,
        }
    }

    stepToken(token: string) {
        const headVal = this.#tape[this.#head]
        switch (token) {
            case '>':
                if (this.#head < (this.#tape.length - 1))
                    this.#head++
                else {
                    console.log('Tape overflow, \'>\' /w head: ' + this.#head)
                    this.#head = this.#tape.length - 1
                }
                break;
            case '<':
                if (this.#head > 0)
                    this.#head--
                else {
                    console.log('Tape underflow, \'<\' /w head: ' + this.#head)
                    this.#head = 0
                }
                break;
            case '+':
                this.#tape[this.#head]++
                break;
            case '-':
                this.#tape[this.#head]--
                break;
            case '.':
                this.#output = String.fromCharCode(headVal)
                break;
            case ',':
                this.#awaitInput = true
                break;
            case '[':
                if (headVal === 0)
                    this.#loopJump = Next.LoopForward
                break;
            case ']':
                if (headVal !== 0) {
                    this.#loopJump = Next.LoopBack
                }
                break;
            default:
                throw new Error("Bad token: " + token)
        }
        this.#stepCt++

        return true
    }

    getHead() {
        return this.#head
    }

    getTape() {
        return this.#tape
    }

    isTokenChar(char: string): boolean {
        return BF_OPERATORS.has(char)
    }
}
