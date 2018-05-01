import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'

const log = require('debug')('components:BoardView')

export interface BoardViewProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

/**
 * BoardView component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class BoardView extends Component<BoardViewProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string          = 'BoardView'
    static defaultProps: BoardViewProps = {}

    render() {
        // const {} = this.props;
        return (
            <div className={this.getClassName()}>
                Hello BoardView !
            </div>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
