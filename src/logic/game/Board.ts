import { Tile } from './Tile';
const log = require('debug')('game:Board')

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
