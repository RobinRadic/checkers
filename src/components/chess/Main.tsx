import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'

const log = require('debug')('components:Main')

export interface MainProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

interface State {
}

/**
 * Main component
 */
@Hot(module)
@observer
export default class Main extends Component<MainProps, State> {
    static displayName: string     = 'Main'
    static defaultProps: MainProps = {}

    state: State = {}

    render() {
        // const {} = this.props;
        // const {} = this.state;
        return (
            <div className={this.getClassName()}>

            </div>
        )
    }

    getClassName() {
        return classes(style(this.props.style), this.props.className);
    }
}
