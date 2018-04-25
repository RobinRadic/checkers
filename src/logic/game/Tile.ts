import { IPiece } from './types';
const log = require('debug')('game:Tile')
export class Tile {
    private _occupant: IPiece = null;

    constructor(public row: number, public col: number) {}

    public get occupant(): IPiece { return this._occupant; }

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
