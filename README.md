# reversi
A reversi chess game engine

## How to run
### Building the Package
* Install dependencies
```bash
npm install
```
* Build the package, output files will be in `dist` folder
```bash
npm run build
```
* Link the output package to global npm path
```bash
npm run link
```

### Running the React Example
* Cd into example project folder
```bash
cd examples\reversi-react
```
* Install dependencies
```bash
npm install
```
* Link the `reversi` package from global npm path
```bash
npm link reversi
```
* Run dev server
```bash
npm run dev
```
Or build to static files
```bash
npm run build
```
The static frontend files will be in `dist` folder

## Demo page
A live demo page is available at http://page.wolfdigit.csie.org/reversi/

## Package Usage
This package exports 2 entities along with their type definitions:
* (default export) class `Game`: The main game engine
* enum `ChessColor`: A enum to represent chess color

### class `Game`

#### Methods for making changes
* `constructor(size: number)`
Initializes a new game board with the specified size and sets up the initial positions of the chess pieces.

* `play(x: number, y: number): boolean`
Attempts to make a move at the specified position. If the move is valid, updates the board.

* `skipPlay(): boolean`
If there are no valid moves left for the current player, skips their turn.

#### Methods for querying game state
* `currentPlayer(): ChessColor`
Returns the current player's color.

* `nNextMoves(): number`
Returns the number of valid moves for the current player to choose.

* `ended(): boolean`
Returns true if the game has ended (i.e., there are no valid moves left for either player).

* `isValidMove(x: number, y: number, color: ChessColor): boolean`
Returns true if there is a valid move at the specified position for the specified color.

* `getChessCount(): number[]`
Returns an array representing the number of chess pieces for each color.

#### Methods for registering callbacks
You would need callbacks to update the UI when the game state changes.

* `addChessCallback(x: number, y: number, cb: (color: ChessColor)=>any)`
Adds a callback function to be called when a chess piece is placed or changed at the specified position.

* `addValidCallback(x: number, y: number, color: ChessColor, cb: (val: boolean)=>any)`
Adds a callback function to be called when the validity of a move at the specified position for the specified color changes.

* `addCurrentPlayerCallback(cb: (color: ChessColor)=>any)`
Adds a callback function to be called when it's the next player's turn.

* `addCountCallback(cb: (count: number[])=>any)`
Adds a callback function to be called when the chess count changes.


### enum `ChessColor`
* `ChessColor.Black`: Black chess
* `ChessColor.White`: White chess
* `ChessColor.None`: No chess, the cell is empty

## Future Work
* New feature: History playback