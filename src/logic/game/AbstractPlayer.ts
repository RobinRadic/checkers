import { Color, Direction, IPlayer } from './types';
import { Tile } from './Tile';
import { Game } from './Game'
import { Move } from './Move'
import { Piece } from './Piece'
const log = require('debug')('game:AbstractPlayer')

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
