import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from './styles/rmenu-item.module.scss'

const log = require('debug')('components:RMenuItem')

export interface RMenuItemProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

interface State {
}

/**
 * RMenuItem component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class RMenuItem extends Component<RMenuItemProps, State> {
    static displayName: string          = 'RMenuItem'
    static defaultProps: RMenuItemProps = {}

    itemRef = React.createRef();
    state: State = {}

    render() {
        // const {} = this.props;
        // const {} = this.state;
        log('RMenuItem', {me: this, ref: this.itemRef})
        return (
            <li ref={this.itemRef} styleName="menu-item" className={this.className}>{this.props.children}</li>
        )
    }

    get className() {
        return classes(style(this.props.style), this.props.className);
    }
}
