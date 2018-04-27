import { AbstractGame } from './AbstractGame';
import { container, Symbols } from '#/ioc';
import { Move } from '#/game';
import Axios from 'axios';

const Echo = require('laravel-echo');


const log = require('debug')('game:MultiplayerGame')

export class MultiplayerGame extends AbstractGame {

    get echo(): typeof Echo { return container.get<any>(Symbols.Echo) }

    constructor() {
        super();
        log('echo', this.echo)

        this.echo
            .channel('game')
            .listen('GameCreated', (e) => {
                log('GameCreated', e);
                this.emit('created', e);
            })
            .listen('PieceMoved', (e) => {
                log('PieceMoved', e);
                this.emit('piece.moved', e);
            })
            .listen('MessageSend', (e) => {
                log('MessageSend', e);
                this.emit('message.send', e);
            })
            .listen('PlayerJoined', (e) => {
                log('PlayerJoined', e)
                this.emit('player.joined', e);
            })
            .listen('GameStarted', (e) => {
                log('GameStarted', e);
                this.emit('started', e);
            });

        this.on('move', (move: Move) => {
            log('on Move', move);
            Axios.post('http://checkers.local/game/move', {
                from: { row: move.from.row, col: move.from.col },
                to  : { row: move.to.row, col: move.to.col }
            }, { headers: { 'content-type': 'application/json;charset=UTF-8' } }).then((res) => {
                log('on Move response', res);
            }).catch((err) => {
                log('on Move err', err);
            })
        });
    }
}
