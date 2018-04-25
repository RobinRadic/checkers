import * as React from 'react';
import { Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { LayoutStore } from 'stores';
import { LayoutFooter } from 'api';
import { StyleProps } from 'interfaces';
import styles from './layout.module.styl'
import { Hot,CSSModules } from 'decorators';

const log         = require('debug')('components:footer')
const { Header }  = Layout;
const { SubMenu } = Menu

interface Props {
    links?: object
    copyright?: string | React.ComponentType<any> | React.ReactElement<any>
}

interface State {}

@Hot(module)
@CSSModules(styles)
@observer
export class GlobalFooter extends React.Component<Props, State> {
    @inject(Symbols.LayoutStore) layout: LayoutStore

    get footer(): LayoutFooter { return this.layout.footer }

    componentDidUpdate(prevProps: Readonly<Props & StyleProps>, prevState: Readonly<State>, prevContext: any): void {
        log('componentDidUpdate', { prevProps, prevState, prevContext });
    }

    render() {
        const footer = this.footer
        return <div styleName="footer">{this.props.children ? this.props.children : null}</div>
    }

}
