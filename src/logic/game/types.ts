// noinspection TypeScriptPreferShortImport
import { Tile } from './Tile'
import { Piece } from './Piece'
import { AbstractGame } from './AbstractGame'

export type IPiece = Piece | null;

export interface IPlayer {
    color: Color
    direction: Direction
    pieces: Array<Piece>
    game: AbstractGame
    name: string

    setName(name: string);

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


export interface PieceMovedEventLocation {
    row: number
    col: number
}

export interface PieceMovedEvent {
    from: PieceMovedEventLocation
    to: PieceMovedEventLocation
}

export interface MessageSendEvent {
    id: number
    created_at: string
    message: string
    sender_name: string
}
