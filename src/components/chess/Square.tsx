import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Hot } from 'decorators';
import { classes, style } from 'typestyle'

const log = require('debug')('components:Square')

export interface SquareProps {
    black?: boolean
}

interface State {
}

/**
 * Square component
 */
@Hot(module)
@observer
export default class Square extends Component<SquareProps, State> {
    static displayName: string       = 'Square'
    static defaultProps: SquareProps = {
        black: false
    }

    state: State = {}

    render() {
        return (
            <div className={this.getClassName()}>{this.props.children}</div>
        )
    }


    getClassName() {
        return classes(style({
            backgroundColor: this.props.black ? 'black' : 'white',
            color          : this.props.black ? 'white' : 'black',
            width          : '100%',
            height         : '100%'
        }));
    }
}
