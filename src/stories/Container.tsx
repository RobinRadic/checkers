import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import styles from './stories.scss'
import { classes, style } from 'typestyle';

const log = require('debug')('components:Container')

export interface ContainerProps {
    padding?: number
}

interface State {
}

/**
 * Container component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class Container extends Component<ContainerProps & CSSModules.InjectedCSSModuleProps, State> {
    static displayName: string          = 'Container'
    static defaultProps: ContainerProps = {
        padding: 20
    }

    state: State = {}

    render() {
        // const {} = this.props;
        // const {} = this.state;
        return (
            <div styleName="container" className={classes(style({ padding: this.props.padding }))}>{this.props.children}</div>
        )
    }
}
