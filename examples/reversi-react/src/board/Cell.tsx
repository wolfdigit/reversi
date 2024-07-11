import Game, { ChessColor } from 'reversi'
import { useState } from 'react'
import clsx from 'clsx'
import ChessColorUI from './ChessColorUI'

export default function Cell({ game, x, y }: { game: Game, x: number, y: number}) {
    const [color, setColor] = useState(game.board[x][y])
    const [validB, setValidB] = useState(game.isValidMove(x, y, ChessColor.Black))
    const [validW, setValidW] = useState(game.isValidMove(x, y, ChessColor.White))
    game.addChessCallback(x, y, setColor)
    game.addValidCallback(x, y, ChessColor.Black, setValidB)
    game.addValidCallback(x, y, ChessColor.White, setValidW)
    return (
        <span className={clsx('cell', {valid: game.currentPlayer()===ChessColor.Black ? validB : validW})} onClick={() => game.play(x, y)}>
            <ChessColorUI color={color} />
        </span>
    )
}