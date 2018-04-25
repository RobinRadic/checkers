import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { LayoutStoreSide, RootStore } from 'stores';
import { Hot } from 'decorators'
import CSSModules from 'utils/CSSModules'
import styles from './smenu.styl'
import { MenuController, MenuManager } from 'utils/MenuManager';

import { MenuItem } from 'api';
import { Accordion, Divider, Menu } from 'semantic-ui-react'
// import 'semantic-ui-less/definitions/modules/sidebar.less'
import 'semantic-ui-less/definitions/collections/menu.less'
import 'semantic-ui-less/definitions/modules/accordion.less'
// import 'semantic-ui-less/definitions/elements/icon.less'

import { MenuMenuProps } from 'semantic-ui-react/dist/commonjs/collections/Menu/MenuMenu';
import { AccordionTitleProps } from 'semantic-ui-react/dist/commonjs/modules/Accordion/AccordionTitle';
import { MenuItemProps } from 'semantic-ui-react/dist/commonjs/collections/Menu/MenuItem';
import { Icon } from '@/Icon';

const { Item, Header }                                 = Menu
const SubMenu: React.StatelessComponent<MenuMenuProps> = Menu.Menu

const log = require('debug')('component:SMenu')

interface Props extends CSSModules.InjectedCSSModuleProps {}

interface State {
    loading: boolean
    menu: MenuController
}


@Hot(module)
@CSSModules(styles)
@observer
export default class SMenu extends Component<Props, State> {
    @inject(Symbols.RootStore) store: RootStore
    @inject(Symbols.LayoutStoreLeft) side: LayoutStoreSide
    @inject(Symbols.MenuManager) menus: MenuManager;

    state: State = {
        loading: true,
        menu   : null
    }

    index = 0

    async componentDidMount() {
        await this.store.setProject('codex', true);
        let menu = this.menus.createController(this)
        menu.init(this.side.menu);

        this.setState({ loading: false, menu })
    }

    render() {
        if ( this.state.loading ) return null
        const { styles } = this.props

        return (
            <Accordion as={Menu} fluid={true} vertical={true}>
                {this.state.menu.items.map(item => this.renderMenuItem(item))}
            </Accordion>
        );
    }


    renderMenuItem(item: MenuItem) {
        const itemProps: MenuItemProps = {
            key    : item._id,
            active : item.selected,
            link   : item.type === 'link' || item.type === 'router-link',
            onClick: this.onItemClick(item)
        }

        const Label = () => (
            <Fragment>
                {item.icon ? <Icon name={item.icon}/> : null}
                {item.label}
            </Fragment>
        )

        switch ( item.type ) {
            case 'divider':
                return (<Divider key={item._id}/>)
            case 'header':
                return (<Menu.Header key={item._id}><Label/></Menu.Header>)
            case 'side-menu':
                return <Menu.Item {...itemProps}><Label/></Menu.Item>
            case 'label':
                return <Menu.Item {...itemProps}><Label/></Menu.Item>
            case 'link':
                return <Menu.Item {...itemProps}><Label/></Menu.Item>
            case 'router-link':
                return <Menu.Item {...itemProps}><Label/></Menu.Item>
            case 'sub-menu':
                return (
                    <Menu.Item key={item._id} >
                        {/*<Label />
                        <Menu.Menu>
                            {item.children.map(child => this.renderMenuItem(child))}
                        </Menu.Menu>
                        */}
                        <Accordion.Title
                            as="div"
                            active={item.expand}
                            content={<Label />}
                            onClick={this.onItemClick(item)}
                        />
                        <Accordion.Content
                            as={Menu.Menu}
                            active={item.expand}
                            content={item.children.map(child => this.renderMenuItem(child))}/>

                    </Menu.Item>
                )
        }
    }


    onItemClick = (item) => (event: React.MouseEvent<HTMLElement>, data: MenuItemProps | AccordionTitleProps) => {
        log('onItemClick', { item, event, data })
        this.state.menu.handleMenuItemClick(item, event);
    }
}
