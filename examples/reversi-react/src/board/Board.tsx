import { useRef, useState } from 'react'
import Game, { ChessColor } from 'reversi'
import Cell from './Cell'
import ChessColorUI from './ChessColorUI'
import './board.css'

function Board() {
    const game = useRef(new Game(8)).current
    const [currPlayer, setCurrPlayer] = useState<ChessColor>(game.currentPlayer())
    game.addCurrentPlayerCallback(setCurrPlayer)
    const [chessCount, setChessCount] = useState(game.getChessCount())
    game.addCountCallback(setChessCount)

    return (
        <div>
            <div>Current Player: <ChessColorUI color={currPlayer} /></div>
            <div>Chess Count: 
                <ChessColorUI color={ChessColor.Black} /> {chessCount[ChessColor.Black]},
                <ChessColorUI color={ChessColor.White} /> {chessCount[ChessColor.White]}
            </div>
            <div style={{
                cursor: 'pointer',
                backgroundColor: 'pink',
                display: game.nNextMoves() > 0 || game.ended() ? 'none' : 'block',
            }} onClick={() => game.skipPlay()}>There is no valid move for <ChessColorUI color={game.currentPlayer()} />, click here to pass. </div>
            <div style={{display: game.ended() ? 'block' : 'none', fontSize: '36px'}}>Game Over, {
                chessCount[ChessColor.Black] === chessCount[ChessColor.White] ? "It's a tie." : (
                    <>Winner is <ChessColorUI color={
                        chessCount[ChessColor.Black] > chessCount[ChessColor.White] ? ChessColor.Black : ChessColor.White
                    } /></>
                )
            }</div>
            <div className='board'>
                {game.board.map((row, x) => (
                    <div key={x} className='row'>
                        {row.map((_, y) => <Cell key={String.fromCharCode(x+65)+(y+1)} x={x} y={y} game={game} />)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board