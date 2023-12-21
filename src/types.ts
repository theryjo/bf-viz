export interface BFCodeSample {
  name: string,
  text: string,
}

export enum Next {
  Continue,
  Input,
  Output,
  LoopBack,
  LoopForward,
  Error,
}

export interface Result {
  next: Next
  input: ((receive: string) => void) | null
  output: string | null, // Output byte as char
  error: string | null,
}
