import { AbstractGame } from './AbstractGame';
import { container, Symbols } from '#/ioc';
import { Move } from '#/game';
import Axios from 'axios';

const Echo = require('laravel-echo');


const log = require('debug')('game:MultiplayerGame')

export class MultiplayerGame extends AbstractGame {

    // @inject(Symbols.Echo) echo: typeof Echo


    constructor() {
        super();
        let echo = container.get<any>(Symbols.Echo)
        // let pusher = container.get<Pusher>(Symbols.Pusher)
        log('echo', echo)
        // log('pusher',pusher)
        // window['pusher'] = pusher;
        //
        // pusher.subscribe('game')
        //     .bind('App.Event.MovedPiece', (context: any, data: any) => {
        //         log('pusher App.Event.MovedPiece', {context,data})
        //     })

        echo
            .channel('game')
            .listen('MovedPiece', (e) => {
                log('MovedPiece', e)
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
