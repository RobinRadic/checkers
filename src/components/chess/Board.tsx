import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'

const log = require('debug')('components:Board')

export interface BoardProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

interface State {
}

/**
 * Board component
 */
@Hot(module)
@observer
export default class Board extends Component<BoardProps, State> {
    static displayName: string      = 'Board'
    static defaultProps: BoardProps = {}

    state: State = {}

    render() {
        // const {} = this.props;
        // const {} = this.state;
        return (
            <div className={this.getClassName()}>Hello Board !</div>
        )
    }

    getClassName() {
        return classes(style(this.props.style), this.props.className);
    }
}
