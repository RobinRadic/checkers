import { Direction, IPlayer } from './types';
import { Tile } from './Tile';
import { Piece } from './Piece'

const log = require('debug')('game:Move')

export class Move {
    constructor(protected _piece: Piece, protected _from: Tile, protected _to: Tile) {}

    public get piece(): Piece { return this._piece; }

    public get from(): Tile { return this._from; }

    public get to(): Tile { return this._to; }

    public get player(): IPlayer { return this.piece.player }

    public get direction(): Direction { return this.from.row > this.to.row ? Direction.NORTH : Direction.SOUTH}

    public get isBackwards(): boolean { return this.direction !== this.player.direction}

    public get isSideways(): boolean { return this.from.row === this.to.row && this.from.col !== this.to.col}

    public get isDiagonal(): boolean {
        let size   = this.player.game.board.size;
        let first  = this.direction === Direction.SOUTH ? 'from' : 'to'
        let second = this.direction === Direction.SOUTH ? 'to' : 'from'
        let rows   = (size - this[ this.direction === Direction.SOUTH ? 'from' : 'to' ].row) - (size - this[ this.direction === Direction.SOUTH ? 'to' : 'from' ].row)
        let cols   = (size - this[ this.from.col >= this.to.col ? 'to' : 'from' ].col) - (size - this[ this.from.col >= this.to.col ? 'from' : 'to' ].col)

        return rows === cols;
    }

    public get distance(): number {
        // https://www.mathopenref.com/coorddist.html
        let row  = this.from.row - this.to.row;
        let col  = this.from.col - this.to.col;
        let dist = Math.sqrt(row * row + col * col);
        dist     = Math.floor(dist)
        return dist;
    }

    public get colDistance(): number {
        let first = this.from.col >= this.to.col ? 'from' : 'to'
        return this[ first ].col - this[ first === 'to' ? 'from' : 'to' ].col;
    }

    public get rowDistance(): number {
        let first = this.from.row >= this.to.row ? 'from' : 'to'
        return this[ first ].row - this[ first === 'to' ? 'from' : 'to' ].row;
    }

    public get isJumpingPiece(): boolean {
        // @todo add logic to figure out isJumpingPiece when moving a distance greater then 1 (kinged piece)
        if ( this.distance !== 2 || this.rowDistance !== 2 || this.colDistance !== 2 ) {
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
        if ( this.distance === 1 ) {
            return;
        }

        if ( this.distance === 2 ) {
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
}
