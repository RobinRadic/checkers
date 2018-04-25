import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import './style/tmenu.scss'
import styles from './style/tmenu.module.scss'
import { hot } from 'react-hot-loader';


const log = require('debug')('components:TestMenuView')

export interface TestMenuViewProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

interface State {
}

/**
 * TestMenuView component
 *
 *
 */
@Hot(module)
@observer
@CSSModules(styles)
class TestMenuView extends Component<TestMenuViewProps & CSSModules.InjectedCSSModuleProps, State> {
    static displayName: string             = 'TestMenuView'
    static defaultProps: TestMenuViewProps = {}

    state: State = {}

    render() {
        return (
                <ul className="menu vertical icons icons-left">
                    <li className="menu-item">
                        <a className="menu-link" href="javascript:">
                            <i className="fa fa-rocket" />
                            <span>Link item</span>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a className="menu-link" href="javascript:">
                            <i className="fa fa-rocket" />
                            <span>Link item</span>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a className="menu-link" href="javascript:">
                            <i className="fa fa-rocket" />
                            <span>Link item</span>
                        </a>
                    </li>
                    <li className="menu-item-with-submenu">
                        <span className="menu-text">Item with sub  items</span>
                        <ul className="submenu ">
                            <li className="menu-item"><span className="menu-text">Item</span></li>
                            <li className="menu-item"><span className="menu-text">Item</span></li>
                            <li className="menu-item"><span className="menu-text">Item</span></li>
                            <li className="menu-item"><a className="menu-link" href="javascript:">Link item</a></li>
                            <li className="menu-item"><i className="fa fa-rocket" /><a className="menu-link" href="javascript:">Link item</a></li>
                        </ul>
                    </li>
                </ul>
        )
    }

    get className() {
        return classes(style(this.props.style), this.props.className);
    }
}
export default TestMenuView
// export default hot(module)(TestMenuView)
