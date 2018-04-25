// noinspection TypeScriptPreferShortImport
import { Tile } from './Tile'
import { Piece } from './Piece'
import { Game } from './Game'

export type IPiece = Piece | null;

export interface IPlayer {
    color: Color
    direction: Direction
    pieces: Array<Piece>
    game: Game

    addPiece(tile: Tile): Piece;

    removePiece(piece: Piece);

    is(player: IPlayer): boolean
}

export enum Color {
    BLACK = 'black',
    WHITE = 'white'
}

export enum Direction {
    NORTH = 0,
    SOUTH = 2
}