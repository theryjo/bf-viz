export const BF_OPERATORS = new Set(
    ['>', '<', '+', '-', '.', ',', '[', ']']
)

export function getTokenIdx(code: string, codeIdx: number) {
  let tokenIdx = -1
  for (let i = 0; i <= codeIdx; i++) {
    if (BF_OPERATORS.has(code[i]))
      tokenIdx++
  }
  return tokenIdx
}
