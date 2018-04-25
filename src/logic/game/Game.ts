import { EventEmitter2 } from 'eventemitter2';
import { Direction, IPlayer } from './types';
import { Tile } from './Tile'
import { Move } from './Move'
import { Board } from './Board'

const log = require('debug')('game:Game')

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

        // move.isBackwards()
        // rule: cannot move backwards unless kinged
        if ( move.direction !== player.direction && ! piece.kinged ) {
            log('isLegalMove', 'move.direction !== player.direction && ! piece.kinged')

            return false;
        }

        // move.isSideways()
        // rule: cannot move sideways
        if ( move.from.row === move.to.row ) {
            log('isLegalMove', 'move.from.row === move.to.row')
            return false;
        }

        // move.isDiagonal()
        // makes sure its a diagonal move if going further away then 1 tile (kinged pieces)
        if ( move.getDistance() > 1 && ! move.isJumpingTile() ) {
            let size   = player.game.board.size;
            let first  = move.direction === Direction.SOUTH ? 'from' : 'to'
            let second = move.direction === Direction.SOUTH ? 'to' : 'from'
            let rows   = (size - move[ move.direction === Direction.SOUTH ? 'from' : 'to' ].row) - (size - move[ move.direction === Direction.SOUTH ? 'to' : 'from' ].row)
            let cols   = (size - move[ move.from.col >= move.to.col ? 'to' : 'from' ].col) - (size - move[ move.from.col >= move.to.col ? 'from' : 'to' ].col)

            log('isLegalMove', 'diagonal check', 'rows !== cols:', rows !== cols, { rows, cols })
            if ( rows !== cols ) {
                return false;
            }
        }

        // rule: cannot move forward (NORTH/SOUTH) more then 1 tile (prevents kinged pieces to move more then 1)
        if ( move.from.col === move.to.col && move.getDistance() > 1 ) {
            log('isLegalMove', 'move.from.col === move.to.col && move.getDistance() > 1')
            return false;
        }

        if ( ! move.to.isOccupied ) {
            log('isLegalMove', '! move.to.isOccupied')
            if ( move.getDistance() === 1 ) {
                log('isLegalMove', 'move.getDistance() === 1 ')
                return true;
            }
            if ( move.isJumpingTile() ) {
                // only allow jumping sideways. if sideways move is legal
                log('isLegalMove', 'move.from.col !== move.to.col', move.from.col !== move.to.col)
                return move.from.col !== move.to.col;
            }
            if ( (piece.kinged && move.isJumpingTile() === false)  ) {
                log('isLegalMove', 'piece.kinged && move.isJumpingTile() === false')
                return true;
            }
        }

        log('isLegalMove', 'return', {
            move,
            isJumpingTile: move.isJumpingTile()
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
