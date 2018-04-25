import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DNDContext, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import HTML5Backend from 'react-dnd-html5-backend';
import UITile from '@/game/UITile';
import { Game, Tile } from 'game';
import UIPiece from '@/game/UIPiece';

const log = require('debug')('components:game:UIBoard')

export interface BoardProps {
    height?: number
    width?: number
    game: Game
}

interface State {
}

/**
 * Board component
 */
@Hot(module)
@DNDContext(HTML5Backend)
@observer
export default class UIBoard extends Component<BoardProps, State> {
    static displayName: string               = 'UIBoard'
    static defaultProps: Partial<BoardProps> = {
        height: 500,
        width : 500
    }

    componentWillMount() {
        log('componentWillMount', this.props)
        this.props.game.on('update', () => {
            log('update', { me: this })
            this.forceUpdate()
        });
    }

    render() {
        const { height, width, game } = this.props;
        const totalTiles              = game.board.getNumTiles();
        const tiles                   = [];

        game.board.getAllTiles().forEach(tile => {
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
        const { game } = this.props
        const wh       = (100 / game.board.size) + '%'
        let className  = style({
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
