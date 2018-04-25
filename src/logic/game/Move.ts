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
