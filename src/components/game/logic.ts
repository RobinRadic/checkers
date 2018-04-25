import { EventEmitter2 } from 'eventemitter2';

const log = require('debug')('checker:v2')

export enum Color {
    BLACK = 'black',
    WHITE = 'white'
}

export enum Direction {
    NORTH = 0,
    SOUTH = 2
}


export class Tile {
    private _occupant: IPiece = null;

    constructor(public row: number, public col: number) {}

    public get occupant(): IPiece { return this._occupant; }

    // getOccupant(): IPiece { return this._occupant; }

    public get isOccupied(): boolean { return this._occupant !== null; }

    public setOccupant(occupant: IPiece) {
        this._occupant = occupant;
        if ( occupant !== null ) {
            occupant.setTile(this);
        }
    }

    public is(tile: Tile): boolean {return this.row === tile.row && this.col === tile.col}

    public toString() { return `${this.row}${this.col}` }

    public get isBlack() { return (this.row + this.col) % 2 === 1 }
}

export class Board {
    private _tiles: Tile[][];
    public get tiles(): Tile[][] { return this._tiles; }

    public get size(): number { return this._size; }

    constructor(protected _size: number = 8) { this.createTiles(_size); }

    protected createTiles(size: number = 8) {
        this._tiles = [];
        for ( let row: number = 0; row < size; row ++ ) {
            let rowTiles = [];
            for ( let col: number = 0; col < size; col ++ ) {
                rowTiles.push(new Tile(row, col));
            }
            this._tiles.push(rowTiles);
        }
    }

    public getTile(row: number, col: number): Tile { return this._tiles[ row ][ col ]; }

    public getAllTiles(): Tile[] {
        let all: Tile[] = [];
        this.tiles.forEach(tiles => all.push(...tiles))
        return all;
    }

    public getNumTiles(): number { return this.size * this.size };

}

export type IPiece = Piece | null;

export class Piece {
    protected _kinged: boolean = false;

    constructor(protected _player: IPlayer, protected _tile: Tile) {
        this.tile.setOccupant(this);
    }

    public get player(): IPlayer { return this._player; }

    public get game(): Game { return this._player.game; }

    public get tile(): Tile { return this._tile; }

    public get kinged(): boolean { return this._kinged; }

    public king() {this._kinged = true}

    public canCapture(otherPiece: IPiece): boolean { return false; }

    public canMoveTo(tile: Tile): boolean {
        return this.game.isLegalMove(new Move(this, this.tile, tile));
    }

    public createMove(to: Tile) {
        return new Move(this, this.tile, to);
    }

    // public move(to: Tile) {
    //     let move = this.createMove(to);
    //     log('move', { move, to })
    //     this.game.executeMove(move);
    // }

    public setTile(tile: Tile) { this._tile = tile; }

    public is(piece: IPiece): boolean { return piece !== null && piece.player === this.player && piece.tile === this.tile }

    public toString() { return this._kinged ? `===` : '___' }
}

export class Move {
    constructor(protected _piece: Piece, protected _from: Tile, protected _to: Tile) {}

    public get piece(): Piece { return this._piece; }

    public get from(): Tile { return this._from; }

    public get to(): Tile { return this._to; }

    public get player(): IPlayer { return this.piece.player }

    public get direction(): Direction { return this.from.row > this.to.row ? Direction.NORTH : Direction.SOUTH}

    public getDistance(): number {
        // https://www.mathopenref.com/coorddist.html
        let row  = this.from.row - this.to.row;
        let col  = this.from.col - this.to.col;
        let dist = Math.sqrt(row * row + col * col);
        dist     = Math.floor(dist)
        return dist;
    }

    public isJumpingTile(): boolean {
        //displacement
        if ( this.getDistance() === 1 ) {
            return false;
        }
        let tile = this.getJumpedTile();
        if ( tile !== undefined ) {
            // only return true when jumping over another players piece
            return tile.isOccupied && tile.occupant.player.is(this.player) === false;
        }
        return true;
    }

    public getJumpedTile(): Tile {
        if ( this.getDistance() === 1 ) {
            return;
        }
        let drow   = this.to.row - this.from.row;
        let dcol   = this.to.col - this.from.col;
        let jumped = {
            row: Math.floor(this.from.row + drow / 2),
            col: Math.floor(this.from.col + dcol / 2)
        }
        log('getJumpedTile', { jumped, drow, dcol, me: this })
        return this.piece.game.board.getTile(jumped.row, jumped.col);

    }


}

export interface IPlayer {
    color: Color
    direction: Direction
    pieces: Array<Piece>
    game: Game

    addPiece(tile: Tile): Piece;

    removePiece(piece: Piece);

    is(player: IPlayer): boolean
}

export abstract class AbstractPlayer implements IPlayer {
    private _pieces: Array<Piece> = [];

    constructor(protected _game: Game, protected _color: Color, protected _direction: Direction) {}

    public get pieces(): Array<Piece> { return this._pieces; }

    public get game(): Game { return this._game; }

    public get color(): Color { return this._color; }

    public get direction(): Direction { return this._direction; }

    public addPiece(tile: Tile): Piece {
        if ( tile.isOccupied ) {
            throw new Error('Cannot add piece. Tile is occupied.')
        }
        const piece = new Piece(this, tile);
        this._pieces.push(piece);
        return piece;
    }

    public executeMove(move: Move) { return this.game.executeMove(move); }

    public getNumPieces(): number { return this._pieces.length }

    public removePiece(piece: Piece) {
        let index = this._pieces.findIndex(pce => pce.is(piece));
        this._pieces.splice(index, 1);
    }

    public is(player: IPlayer): boolean {return this === player; }
}

export class Game extends EventEmitter2 {
    started: boolean        = false;
    ended: boolean          = false;
    players: Array<IPlayer> = [];
    turn: 1 | 0             = 0
    iturn: number           = 0
    board: Board;

    shouldUpdate: boolean = false;

    constructor() {
        super({
            wildcard         : true,
            delimiter        : ':',
            maxListeners     : 100,
            verboseMemoryLeak: DEV
        })
    }

    public addPlayers(...players: IPlayer[]) { this.players.push(...players) }

    public endGame() {
        this.started = false;
        this.ended   = true;
        this.emit('end');
        this.emit('update');
    }

    public startGame() {
        if ( this.players.length !== 2 ) { throw new Error('Can only play with 2 players') }
        this.board = new Board(8);
        this.turn  = 0;
        this.iturn = 0;

        this.players.forEach(player => {
            let startRow = player.direction === Direction.NORTH ? this.board.size - 2 : 0;
            for ( let row = 0; row < 2; row ++ ) {
                let currentRow = startRow + row;
                for ( let col = 0; col < this.board.size; col ++ ) {
                    player.addPiece(this.board.getTile(currentRow, col))
                }
            }
        })
        this.started = true;
        this.emit('start');
        this.emit('update');
    }

    protected getTile(row: number, col: number): Tile { return this.board.getTile(row, col) }

    public executeMove(move: Move) {
        if ( ! this.isLegalMove(move) ) {
            throw new Error('Not a valid move')
        }
        if ( move.isJumpingTile() ) {
            let tile  = move.getJumpedTile();
            let piece = tile.occupant
            piece.tile.setOccupant(null);
            piece.player.removePiece(piece);
            this.emit('checked', piece);
        }
        move.from.setOccupant(null)
        move.to.setOccupant(move.piece);
        if (
            move.player.direction === Direction.NORTH && move.to.row === 0 ||
            move.player.direction === Direction.SOUTH && move.to.row === this.board.size
        ) {
            move.piece.king();
            this.emit('kinged', move.piece)
        }
        log('executeMove', { move })
        this.emit('move', move);
        this.emit('update');
    }

    public isLegalMove(move: Move): boolean {
        let piece  = move.piece;
        let player = piece.player;

        // rule: cannot move backwards unless kinged
        if ( move.direction !== player.direction && ! piece.kinged ) {
            return false;
        }

        // rule: cannot move sideways
        if(move.from.row === move.to.row){
            return false;
        }

        // rule: cannot move forward more then 1 tile (prevents kinged pieces to move more then 1)
        if(move.getDistance() > 1){
            return false;
        }

        if ( ! move.to.isOccupied ) {
            if ( move.getDistance() === 1 ) {
                return true;
            }
            if ( move.getDistance() === 2 && move.isJumpingTile() ) {
                // only allow jumping sideways. if sideways move is legal
                return move.from.col !== move.to.col;
            }
            if ( piece.kinged && move.isJumpingTile() === false ) {
                return true;
            }
        }
        return false;
    }

    protected play() {}

    protected switchTurns() {
        this.turn = this.turn === 0 ? 1 : 0;
        this.iturn ++;
    }

    public getTurnedPlayer(): IPlayer { return this.players[ this.turn ]; }
}

export class HumanPlayer extends AbstractPlayer {

}

// localStorage.setItem('asdfasdf', SavedGame.fromGame(game).toString());
// let savedGame = SavedGame.fromString(localStorage.getItem('asdfasdf'));
// savedGame.players.forEach(data => {
//     game.addPlayer(new Playerdata.player
// })
// export class SavedGame {
//     constructor(public players: { player: number; pieces }[]) {}
//
//     toString() { return JSON.stringify(this); }
//
//     static fromGame(game: Game): SavedGame {
//         // this.tiles   = game.board.getAllTiles().map(tile => ({ row: tile.row, col: tile.col }));
//         let players = game.players.map((player, numPlayer) => ({
//             player: numPlayer,
//             pieces: player.pieces.map(piece => ({
//                 row: piece.tile.row,
//                 col: piece.tile.col
//             }))
//         }))
//         return new SavedGame(players);
//     }
//
//
//     static fromString(str: string): SavedGame {
//         let data = JSON.parse(str) as SavedGame;
//         return new SavedGame(data.players);
//     }
// }

// function test() {
//     const game    = new Game();
//     const player1 = new HumanPlayer(game, Color.BLACK, Direction.SOUTH);
//     const player2 = new HumanPlayer(game, Color.WHITE, Direction.NORTH);
//
//     game.addPlayers(player1, player2);
//
//     game.startGame();
//
//     let p1p1 = player1.pieces[ 0 ];
//     p1p1.king();
//     let move     = new Move(p1p1, p1p1.tile, game.board.tiles[ 0 ][ 1 ]);
//     let distance = move.getDistance();
//     console.log({ distance })
//     printBoard(game);
// }
//
// function printBoard(game: Game) {
//     const CliTable = require('cli-table2');
//     const yargs    = require('yargs')
//     let colors     = new (require('@radic/console-colors')).Parser()
//     let head       = Array.from(new Array(game.board.size)).map((v, i) => i.toString());
//     head.unshift('');
//     let table: any[] = new CliTable({
//         head,
//         colWidths: (new Array(game.board.size)).map(val => (yargs.terminalWidth() - 10) / game.board.size)
//     });
//     game.board.tiles.forEach((row, numRow) => {
//         let tiles = []
//
//         row.forEach((tile, numTile) => {
//             let content = [ tile.row * (tile.col + 1) + '' ];
//             if ( tile.isOccupied() ) {
//                 let piece = tile.getOccupant();
//                 let color = piece.player.color === Color.BLACK ? 'black' : 'white';
//                 content.push(`{${color}}${piece.kinged ? '+++' : '___'}{/${color}}`)
//             }
//             let cell = {
//                 content: content.map(c => colors.parse(c)).join('\n'),
//                 hAlign : 'center'
//                 // chars: { 'left': colors.parse('{black}|{/black}') },
//                 // style: {border: []}
//             };
//
//             tiles.push(cell)
//         })
//         table.push({ [ numRow ]: tiles });
//     })
//     console.log(`
// turn: ${game.turn} | iturn: ${game.iturn}
// `)
//     console.log(table.toString());
// }
