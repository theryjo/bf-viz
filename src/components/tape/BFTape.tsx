import './BFTape.css'

const CELL_BORDER = '1.5px solid rgba(0,0,0,0.5)'

interface Props {
  tape: Uint8Array
  head: number
}

export default function Tape({ tape, head }: Props) {
  if (!tape.length)
    return <div></div>

  function renderCell(x: string, idx: number) {
    return <div key={idx} style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '3.8rem',
      height: '3.8rem',
      flexShrink: '0',
      overflow: 'clip',
      margin: '0px 3px',
      padding: '0px 12px',
      borderRadius: '10px',
      borderTop: CELL_BORDER,
      borderRight: CELL_BORDER,
      borderBottom: CELL_BORDER,
      borderLeft: CELL_BORDER
    }}>{x}</div>
  }

  function renderCells(x: Uint8Array): JSX.Element[] {
    const cells = [] as JSX.Element[]
    x.forEach((x, idx) => cells.push(renderCell(x.toString(), idx)))
    return cells
  }

  function renderHead(head: number) {
    const leftPx = (28 + head * 66.797) + 'px'; // TODO fix all this, make sure aligns with large sizes
    return (
      <span className="bf-head" style={{
        position: 'absolute',
        bottom: '0',
        left: leftPx,
        borderBottom: '5px solid black',
        width: '2.5rem',
        transition: 'left .2s',
      }}>
      </span>
    )
  }

  return <>
    <div className="bf-tape" style={{
      margin: '20px 0',
      padding: '15px',
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      fontSize: '32px',
      whiteSpace: 'pre',
      fontFamily: "'Roboto Condensed', sans-serif",
      background: 'white',
      color: 'black',
      overflow: 'scroll', // TODO auto?
      flex: '1',
    }}>
      {renderCells(tape)}
      {renderHead(head)}
    </div>
  </>
}
