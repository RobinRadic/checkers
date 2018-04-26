import { EventEmitter2 } from 'eventemitter2';
import { Direction, IPlayer } from './types';
import { Tile } from './Tile'
import { Move } from './Move'
import { Board } from './Board'

const log = require('debug')('game:Game')

// export abstract class Game extends EventEmitter2 {
export class AbstractGame extends EventEmitter2 {
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
        if ( move.isJumpingPiece ) {
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
        if ( ! piece.kinged && move.isBackwards ) {
            log('isLegalMove', 'move.isBackwards && ! piece.kinged')

            return false;
        }

        // rule: cannot move sideways
        if ( move.isSideways ) {
            log('isLegalMove', 'isSideways')
            return false;
        }

        // makes sure its a diagonal move if going further away then 1 tile (kinged pieces)
        if ( move.distance > 1 && ! move.isJumpingPiece && ! move.isDiagonal ) {
            log('isLegalMove', 'diagonal check', 'rows !== cols:')
            return false;
        }

        // rule: cannot move forward (NORTH/SOUTH) more then 1 tile (prevents kinged pieces to move more then 1)
        if ( move.from.col === move.to.col && move.distance > 1 ) {
            log('isLegalMove', 'move.from.col === move.to.col && move.distance > 1')
            return false;
        }

        if ( ! move.to.isOccupied ) {
            log('isLegalMove', '! move.to.isOccupied')
            if ( move.distance === 1 ) {
                log('isLegalMove', 'move.distance === 1 ')
                return true;
            }

            // allow jumping diagonal.
            if ( move.isJumpingPiece && move.isDiagonal ) {
                log('isLegalMove', 'move.isDiagonal', move.isDiagonal, 'old:', move.from.col !== move.to.col)
                return true;

            }
            // allow kinged piece to move multiple tiles when not jumping
            // @todo add logic to figure out isJumpingPiece when moving a distance greater then 1
            if ( (piece.kinged && move.isJumpingPiece === false) ) {
                log('isLegalMove', 'piece.kinged && move.isJumpingTile() === false')
                return true;
            }
        }

        log('isLegalMove', 'return', {
            move,
            isJumpingTile: move.isJumpingPiece
        })
        return false;
    }

    protected play() {}

    protected switchTurns() {
        this.turn = this.turn === 0 ? 1 : 0;
        this.iturn ++;
    }

    public getTurnedPlayer(): IPlayer { return this.players[ this.turn ]; }
}
