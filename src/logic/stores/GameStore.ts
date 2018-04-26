import { action, observable } from 'mobx';
import { injectable } from 'inversify';
import { AbstractGame, Color, CPUPlayer, Direction, FreeplayerGame, HumanPlayer, IPlayer, MultiplayerGame, RemotePlayer, SingleplayerGame } from '#/game'
import { GameMode } from 'interfaces';

const log = require('debug')('store:game')

@injectable()
export class GameStore<T extends AbstractGame=AbstractGame> {

    @observable game: T        = null
    @observable mode: GameMode = null

    @action setMode(mode: GameMode) {
        if ( this.game !== null ) {
            throw new Error('cannot set game mode after game has been created')
        }
        this.mode = mode;
    }

    @action createGame() {
        let game: T;
        if ( ! this.mode ) {
            this.setMode('free');
        }
        if ( this.mode === 'free' ) {
            game = new FreeplayerGame() as T;
        } else if ( this.mode === 'singleplayer' ) {
            game = new SingleplayerGame() as T;
        } else if ( this.mode === 'multiplayer' ) {
            game = new MultiplayerGame() as T;
        }
        log('createGame', { game })
        this.game = game;
    }

    @action
    startGame() {
        let player1: IPlayer;
        let player2: IPlayer;

        if ( ! this.game ) {
            throw new Error('Cannot startGame when game has not yet been created using createGame')
        }

        if ( this.mode === 'free' ) {
            player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
            player2 = new HumanPlayer(this.game, Color.WHITE, Direction.NORTH);
        } else if ( this.mode === 'singleplayer' ) {
            player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
            player2 = new CPUPlayer(this.game, Color.WHITE, Direction.NORTH);
        } else if ( this.mode === 'multiplayer' ) {
            player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
            player2 = new RemotePlayer(this.game, Color.BLACK, Direction.SOUTH);
        }
        log('startGame', { game: this.game, me: this })
        this.game.addPlayers(player1, player2);
        this.game.startGame();
    }
}
