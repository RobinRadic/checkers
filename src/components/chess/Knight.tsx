import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import { Icon } from '@/Icon';

const log = require('debug')('components:Knight')

export interface KnightProps {
}

interface State {
}

/**
 * Knight component
 */
@Hot(module)
@observer
export default class Knight extends Component<KnightProps, State> {
    static displayName: string       = 'Knight'
    static defaultProps: KnightProps = {}

    state: State = {}

    render() {
        return (
            <span className={classes(style())}><Icon name="chess-knight"  /></span>
        )
    }
}
