import React, { Component, ReactElement } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import './styles/rmenu.scss'
import styles from './styles/rmenu.module.scss'


const log = require('debug')('components:RMenu')

export interface RMenuProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

interface State {
}

//import styles from './menu.styl'
/**
 * RMenu component
 */

@Hot(module)
@CSSModules(styles)
@observer
export default class RMenu extends Component<RMenuProps, State> {
    static displayName: string      = 'RMenu'
    static defaultProps: RMenuProps = {}

    menuRef = React.createRef();
    state: State = {}

    render() {
        // const {} = this.props;
        // const {} = this.state;
        log('RMenu', {me: this, ref: this.menuRef})
        return (
            <ul ref={this.menuRef} styleName="menu" className={this.className}>{this.props.children}</ul>
        )
    }

    renderChildren(children=this.props.children){
        React.Children.map(children, (child:ReactElement<any>, index:number) => {
            return React.cloneElement(child, {
                menu: this
            })
        })
    }

    get className() {
        return classes(style(this.props.style), this.props.className);
    }
}
