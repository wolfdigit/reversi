import { ChessColor } from 'reversi'

export default function ChessColorUI({ color }: { color: ChessColor }) {
    return (
        <span className='chess-color'>
            {color===ChessColor.None ? ' ' : color===ChessColor.Black ? '●' : '○'}
        </span>
    )
}