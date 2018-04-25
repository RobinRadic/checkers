import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DNDTarget, Hot } from 'decorators';
import { ConnectDropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from 'react-dnd'
import { Piece, Tile } from 'game';
import { DragItem, DragItems } from 'interfaces';

const log = require('debug')('components:game:UITile')

export interface UITileSquareProps {
    tile: Tile
    connectDropTarget?: ConnectDropTarget
    isOver?: boolean
    item?: { piece: Piece }
}

const tileTarget: DropTargetSpec<UITileSquareProps> = {
    drop(props, monitor: DropTargetMonitor, component: React.Component<UITileSquareProps>) {
        log('drop', {
            item    : monitor.getItem(),
            itemType: monitor.getItemType(),
            component, props
        })
        const type = monitor.getItemType();
        if ( type === DragItem.PIECE ) {
            const item = monitor.getItem() as { piece: Piece };
            try {
                let game = item.piece.game
                let move = item.piece.createMove(props.tile);
                if ( game.isLegalMove(move) ) {
                    game.executeMove(move);
                }
            } catch ( e ) {
                console.log(e);
            }
        }
    }
};

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({ connectDropTarget: connect.dropTarget(), isOver: monitor.isOver(), item: monitor.getItem() })

/**
 * BoardSquare component
 */
@Hot(module)
@DNDTarget<UITileSquareProps>(DragItems, tileTarget, collect)
@observer
export default class UITile extends Component<UITileSquareProps> {
    static displayName: string                      = 'UITile'
    static defaultProps: Partial<UITileSquareProps> = {}

    render() {
        const { tile, connectDropTarget, isOver, item } = this.props;
        let isLegal                                     = true;

        if ( isOver ) {
            let move = item.piece.createMove(tile);
            let game = item.piece.game
            isLegal  = game.isLegalMove(move)
            log('isOver', { item, move, isLegal, distance: move.getDistance() })
        }

        return connectDropTarget(
            <div style={{
                position: 'relative',
                width   : '100%',
                height  : '100%'
            }}>
                {this.props.children}
                {isOver ?
                 <div style={{
                     position       : 'absolute',
                     top            : 0,
                     left           : 0,
                     height         : '100%',
                     width          : '100%',
                     zIndex         : 1,
                     opacity        : 0.5,
                     backgroundColor: isLegal ? 'green' : 'red'
                 }}/>
                    : null}

            </div>
        )
    }
}
