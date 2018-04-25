import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DNDSource, Hot } from 'decorators';
import { classes, style } from 'typestyle'
import { ConnectDragSource, DragSourceCollector, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from 'react-dnd';
import { Color, Piece } from 'game';
import { DragItem } from 'interfaces';


const log = require('debug')('components:game:UIPiece')

export interface UIPieceProps {
    piece: Piece
    connectDragSource?: ConnectDragSource
    isDragging?: boolean,
    dragItem?: object
}

const pieceSource: DragSourceSpec<UIPieceProps> = {
    beginDrag(props, monitor: DragSourceMonitor, component: UIPiece) {

        log('checkerSource beginDrag', {
            props, me      : this,
            itemType       : monitor.getItemType(),
            item           : monitor.getItem(),
            getClientOffset: monitor.getClientOffset()
        })
        return props;
    },

    endDrag(props, monitor: DragSourceMonitor) {
        log('endDrag', {
            props, me      : this,
            itemType       : monitor.getItemType(),
            item           : monitor.getItem(),
            getClientOffset: monitor.getClientOffset()
        })
    }
};

let collect: DragSourceCollector;
collect = (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging       : monitor.isDragging(),
    dragItem         : monitor.getItem()
})

/**
 * Checker component
 */
@Hot(module)
@DNDSource(DragItem.PIECE, pieceSource, collect)
@observer
export default class UIPiece extends Component<UIPieceProps> {
    static displayName: string                 = 'UIPiece'
    static defaultProps: Partial<UIPieceProps> = {}

    render() {
        const { piece, connectDragSource, dragItem, isDragging } = this.props;
        let backgroundColor                                      = piece.player.color === Color.BLACK ?
                                                                   '#2f2f2f' :
                                                                   '#bebebe'
        // black.lighten('50%').toHexString() :
        // white.darken('50%').toHexString();


        const className = classes(style({
            opacity     : isDragging ? 0.5 : 1,
            fontSize    : 25,
            backgroundColor,
            fontWeight  : 'bold',
            cursor      : 'move',
            height      : '100%',
            width       : '100%',
            borderRadius: '50%',
            border      : piece.kinged ? `4px groove #ffeb3b` : 'none'
        }))

        return connectDragSource(<div className={className}>{this.props.children}</div>)

    }
}
