import { IPiece, IPlayer } from './types';
import { Tile } from './Tile';
import { AbstractGame } from './AbstractGame'
import { Move } from './Move'

const log = require('debug')('game:Piece')

export class Piece {
    protected _kinged: boolean = false;

    constructor(protected _player: IPlayer, protected _tile: Tile) {
        this.tile.setOccupant(this);
    }

    public get player(): IPlayer { return this._player; }

    public get game(): AbstractGame { return this._player.game; }

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

    public moveTo(to: Tile) { this.game.executeMove(this.createMove(to)); }

    public setTile(tile: Tile) { this._tile = tile; }

    public is(piece: IPiece): boolean { return piece !== null && piece.player === this.player && piece.tile === this.tile }

    public toString() { return this._kinged ? `===` : '___' }
}
