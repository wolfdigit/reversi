enum ChessColor {
    Black = 0,
    White = 1,
    None = 2
}

const dir = [
    [1, 0], [0, 1], [1, 1], [-1, 1],
    [1, -1], [-1, -1], [0, -1], [-1, 0],
]

class ValidMove {
    validMove: Map<ReturnType<typeof this.encodeXy>, Map<number, number>>
    callback: Map<ReturnType<typeof this.encodeXy>, Set<(val: boolean)=>any>>

    constructor() {
        this.validMove = new Map()
        this.callback = new Map()
    }

    encodeXy(x: number, y: number): string {
        return `${String.fromCharCode(x+65)}${y+1}`
    }

    set(x: number, y: number, d: number, dist: number) {
        const pos = this.encodeXy(x, y)
        let mapPos = this.validMove.get(pos)
        if (mapPos===undefined) {
            mapPos = new Map()
            this.validMove.set(pos, mapPos)
            this.callback.get(pos)?.forEach(cb => cb(true))
        }
        mapPos.set(d, dist)
    }

    delete(x: number, y: number, d?: number) {
        const pos = this.encodeXy(x, y)
        if (d===undefined) {
            this.validMove.get(pos)?.clear()
        }
        else {
            this.validMove.get(pos)?.delete(d)
        }
        if (this.validMove.get(pos)?.size===0) {
            this.validMove.delete(pos)
            this.callback.get(pos)?.forEach(cb => cb(false))
        }
    }

    get(x: number, y: number): Map<number, number>|undefined {
        return this.validMove.get(this.encodeXy(x, y))
    }

    size(): number {
        return this.validMove.size
    }

    addCallback(x: number, y: number, cb: (val: boolean)=>any) {
        const pos = this.encodeXy(x, y)
        let set = this.callback.get(pos)
        if (set===undefined) {
            set = new Set()
            this.callback.set(pos, set)
        }
        set.add(cb)
    }

    toString(): string {
        return [...this.validMove.entries()].map(([pos, dirDist]) => {
            return pos+": "+[...dirDist.entries()].map(([dir, dist]) => `${dir}:${dist}`).join(", ")
        }).join("\n")
    }
}

class Game {
    size: number
    board: ChessColor[][]
    _currPLayer: ChessColor
    _chessCount: number[]
    _cbBoard: Set<(color: ChessColor)=>any>[][]
    _cbNextMove: Set<(player: ChessColor)=>any>
    _cbCount: Set<(count: number[])=>any>
    _validMove: ValidMove[]
    constructor(size: number) {
        this.size = size
        this.board = Array.from({length: size}, () => new Array(size).fill(ChessColor.None))
        this._cbBoard = Array.from({length: size}, () => Array.from({length: size}, () => new Set<(color: ChessColor)=>any>()))
        this._currPLayer = ChessColor.Black
        this._cbNextMove = new Set<(player: ChessColor)=>any>()

        const m = size/2
        this.board[m-1][m-1] = ChessColor.White
        this.board[m][m] = ChessColor.White
        this.board[m-1][m] = ChessColor.Black
        this.board[m][m-1] = ChessColor.Black
        this._chessCount = [2, 2]
        this._cbCount = new Set<(count: number[])=>any>()
        this._validMove = [new ValidMove(), new ValidMove()]
        this._validMove[ChessColor.Black.valueOf()].set(m-1, m-2, 1, 2)
        this._validMove[ChessColor.Black.valueOf()].set(m-2, m-1, 0, 2)
        this._validMove[ChessColor.Black.valueOf()].set(m, m+1, 6, 2)
        this._validMove[ChessColor.Black.valueOf()].set(m+1, m, 7, 2)
        this._validMove[ChessColor.White.valueOf()].set(m, m-2, 1, 2)
        this._validMove[ChessColor.White.valueOf()].set(m+1, m-1, 7, 2)
        this._validMove[ChessColor.White.valueOf()].set(m-2, m, 0, 2)
        this._validMove[ChessColor.White.valueOf()].set(m-1, m+1, 6, 2)
    }

    currentPlayer(): ChessColor {
        return this._currPLayer
    }

    static opponent(color: ChessColor): ChessColor {
        return 1 - color.valueOf()
    }

    play(x: number, y: number) {
        const color = this._currPLayer
        const moves = this._validMove[color.valueOf()].get(x, y)
        if (moves===undefined) {
            return false
        }
        [...moves].forEach(([d, distance]) => {
            const [dx, dy] = dir[d]
            const changing = Array.from({length: distance}, (_, k) => [x + dx*k, y + dy*k])
            changing.forEach(([xx, yy]) => {
                this._chessCount[this.board[xx][yy].valueOf()] -= 1
                this.board[xx][yy] = color.valueOf()
                this._chessCount[this.board[xx][yy].valueOf()] += 1
                this._cbBoard[xx][yy].forEach(cb => cb(color.valueOf()))
            })
            changing.forEach(([xx, yy]) => {
                this._reCalcValid(xx, yy)
            })
        })
        this._currPLayer = Game.opponent(this._currPLayer)
        this._cbNextMove.forEach(cb => cb(this.currentPlayer()))
        this._cbCount.forEach(cb => cb(this._chessCount))
        return true
    }

    skipPlay() {
        if (this.nNextMoves()>0) {
            return false
        }
        this._currPLayer = Game.opponent(this._currPLayer)
        this._cbNextMove.forEach(cb => cb(this.currentPlayer()))
    }

    nNextMoves(): number {
        return this._validMove[this._currPLayer.valueOf()].size()
    }

    ended(): boolean {
        return this._validMove[ChessColor.Black.valueOf()].size()===0
            && this._validMove[ChessColor.White.valueOf()].size()===0
    }

    _reCalcValid(x: number, y: number) {
        this._validMove[ChessColor.Black.valueOf()].delete(x, y)
        this._validMove[ChessColor.White.valueOf()].delete(x, y)
        for (let d = 0; d < dir.length; d++) {
            const [dx, dy] = dir[d]
            let xx = x + dx
            let yy = y + dy
            let distance = 1
            while (xx>=0 && xx<this.size && yy>=0 && yy<this.size) {
                if (this.board[xx][yy] === ChessColor.None) {
                    this._validMove[ChessColor.Black.valueOf()].delete(xx, yy, 7-d)
                    this._validMove[ChessColor.White.valueOf()].delete(xx, yy, 7-d)

                    let dist = this._calcValidMove(xx, yy, 7-d, ChessColor.Black)
                    if (dist>1) {
                        this._validMove[ChessColor.Black.valueOf()].set(xx, yy, 7-d, dist)
                    }
                    dist = this._calcValidMove(xx, yy, 7-d, ChessColor.White)
                    if (dist>1) {
                        this._validMove[ChessColor.White.valueOf()].set(xx, yy, 7-d, dist)
                    }
                    break
                }
                if (distance > 1 && this.board[xx][yy] !== this.board[xx-dx][yy-dy]) {
                    break
                }
                xx += dx
                yy += dy
                distance++
            }
        }
    }

    _calcValidMove(x: number, y: number, d: number, color: ChessColor) {
        if (this.board[x][y]!==ChessColor.None) {
            return 0
        }
        const [dx, dy] = dir[d]
        let xx = x + dx
        let yy = y + dy
        let distance = 1
        while (xx>=0 && xx<this.size && yy>=0 && yy<this.size) {
            if (this.board[xx][yy] === ChessColor.None) {
                return 0
            }
            if (this.board[xx][yy] === color) {
                return distance>1 ? distance : 0
            }
            xx += dx
            yy += dy
            distance++
        }
        return 0
    }

    addChessCallback(x: number, y: number, cb: (color: ChessColor)=>any) {
        this._cbBoard[x][y].add(cb)
    }

    isValidMove(x: number, y: number, color: ChessColor) {
        return this._validMove[color.valueOf()].get(x, y) !== undefined
    }

    addValidCallback(x: number, y: number, color: ChessColor, cb: (val: boolean)=>any) {
        this._validMove[color.valueOf()].addCallback(x, y, cb)
    }

    addNextMoveCallback(cb: (color: ChessColor)=>any) {
        this._cbNextMove.add(cb)
    }

    getChessCount() {
        return this._chessCount
    }

    addCountCallback(cb: (count: number[])=>any) {
        this._cbCount.add(cb)
    }
}

export default Game
export { ChessColor }