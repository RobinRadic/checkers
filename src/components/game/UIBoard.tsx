import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DNDContext, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import HTML5Backend from 'react-dnd-html5-backend';
import UITile from '@/game/UITile';
import { AbstractGame, Tile } from '#/game';
import UIPiece from '@/game/UIPiece';
import { inject, Symbols } from '#/ioc';
import { GameStore } from '#/stores';
import { computed } from 'mobx';

const log = require('debug')('components:game:UIBoard')

export interface BoardProps {
    height?: number
    width?: number
}

/**
 * Board component
 */
@Hot(module)
@DNDContext(HTML5Backend)
@observer
export default class UIBoard extends Component<BoardProps> {
    static displayName: string               = 'UIBoard'
    static defaultProps: Partial<BoardProps> = {
        height: 500,
        width : 500
    }
    @inject(Symbols.GameStore) store: GameStore

    @computed get game(): AbstractGame { return this.store.game }

    componentWillMount() {
        log('componentWillMount', this.props)
        this.game.on('update', () => {
            log('update', { me: this })
            this.forceUpdate()
        });
    }

    render() {
        if(!this.store.game || !this.store.game.started) {
            return null
        }
        const { height, width } = this.props;
        const totalTiles        = this.game.board.getNumTiles();
        const tiles             = [];

        this.game.board.getAllTiles().forEach(tile => {
            tiles.push(this.renderTile(tile))
        })

        let styles: types.CSSProperties = {
            margin  : '0px auto',
            height,
            width,
            display : 'flex',
            flexWrap: 'wrap'
        }

        return (
            <div className={classes(style(styles))}>{tiles}</div>
        )
    }

    renderTile(tile: Tile) {
        const wh      = (100 / this.game.board.size) + '%'
        let className = style({
            width     : wh,
            height    : wh,
            background:
                tile.isBlack ?
                'black' ://black.lighten('10%').toHexString() :
                'white' //white.darken('10%').toHexString()
        })

        return (
            <div key={tile.toString()} className={className}>
                <UITile tile={tile}>
                    {tile.isOccupied ? <UIPiece piece={tile.occupant}/> : null}
                </UITile>
            </div>
        )
    }
}
