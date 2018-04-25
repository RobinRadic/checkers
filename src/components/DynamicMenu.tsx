import * as React from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { MenuItem } from 'api';
import { Col, Menu, Row } from 'antd';
import { MenuController, MenuExpandBehaviourType, MenuManager, MenuSelectBehaviourType } from 'utils/MenuManager';
import { StyleProps } from 'interfaces';
import { WithStyles } from 'decorators'
import { Icon } from '@/Icon';
import { MenuProps } from 'antd/es/menu';
import { RouterStore } from 'mobx-react-router';
import { LayoutStore } from 'stores';
import { classes, style } from 'typestyle';
import { runInAction, toJS } from 'mobx';


const { SubMenu, Item, ItemGroup } = Menu
const log                          = require('debug')('components:dynamic-menu')


export interface DynamicMenuProps extends StyleProps {
    name?: string
    menu: MenuProps
    items: MenuItem[]
    className?: string
    style?: React.CSSProperties
    border?: 'left' | 'right' | 'none'
    itemRenderType?: 'default' | 'side-multi' | 'header-multi'
    selectBehaviour?: MenuSelectBehaviourType
    expandBehaviour?: MenuExpandBehaviourType
    collapsed?: boolean
}


interface State {
    menu: MenuController
    collapsed: boolean
    items: MenuItem[]
}

@WithStyles()
@observer
export class DynamicMenu extends React.Component<DynamicMenuProps, State> {
    @inject(Symbols.RouterStore) router: RouterStore
    @inject(Symbols.LayoutStore) layout: LayoutStore
    @inject(Symbols.MenuManager) manager: MenuManager
    static displayName                             = 'DynamicMenu'
    static defaultProps: Partial<DynamicMenuProps> = {
        border         : 'none',
        className      : '',
        style          : {},
        itemRenderType : 'default',
        selectBehaviour: 'single',
        expandBehaviour: 'single-root',
        collapsed      : false
    }
    static styles                                  = {
        root      : {
            height: '100%'
        },
        headerItem: {
            fontWeight     : 'bold',
            color          : 'rgba(0, 0, 0, 0.65) !important',
            backgroundColor: 'transparent !important',
            cursor         : 'default'
        }
    }
    static renderers                               = {
        'default'   : (item: MenuItem, className?: any) => {
            return (<Item key={item._id} className={classes(className)}>{item.icon ? <Icon name={item.icon}/> : null}{item.label}</Item>)
        },
        'side-multi': (item: MenuItem, className?: any) => {
            let cls = {
                item    : style({ height: 'auto !important', paddingBottom: '10px !important', $nest: { '&:hover': { backgroundColor: 'cadetblue' } } }),
                iconCol : style({ width: '40px' }),
                icon    : style({ fontSize: '30px', margin: '15px auto 0' }),
                labelCol: style({ whiteSpace: 'normal', width: 'calc(100% - 40px)' }),
                label   : style({ fontWeight: 'bold', padding: '5px 0' }),
                sublabel: style({ fontSize: 10, lineHeight: '10px' })
            }
            return (
                <Item isSelected={true} active={true} key={item._id} className={classes(className, cls.item)}>
                    <Row type="flex" justify="start">
                        <Col order={1} className={cls.iconCol}>{item.icon ? <Icon name={item.icon} className={cls.icon} classNames={{ icon: '' }}/> : null}</Col>
                        <Col order={2} className={cls.labelCol}>
                            <Row className={cls.label}>{item.label}</Row>
                            {/*<span className={cls.labelSpan}>*/}
                            {item.sublabel ? <Row className={cls.sublabel}>{item.sublabel}</Row> : null}
                        </Col>
                    </Row>
                </Item>
            )
        }
    }

    state: State = {
        menu     : null,
        collapsed: false,
        items: []
    }

    log(...args) { require('debug')('components:dynamic-menu:' + this.props.name)(...args); }

    handleItems(force = false) {
        if ( ! force  ) { // && this.state.items !== this.props.items
            if ( this.state.menu ) return;
            if ( ! this.props.items || ! this.props.items.length ) return;
        }
        let menu = this.manager.createController(this)
        menu.setBehaviour(this.props.selectBehaviour, this.props.expandBehaviour)
        menu.init(this.props.items);
        this.setState({ menu, items: this.props.items })
        this.log('handleItems', { menu, propitems: toJS(this.props.items) })
    }

    componentWillMount() {this.handleItems()}

    componentWillReceiveProps() {this.handleItems()}

    render() {
        const { classNames, className, border } = this.props
        const borderClass                       = style({
            border          : '0px solid #e8e8e8',
            borderLeftWidth : border === 'left' ? 1 : 0,
            borderRightWidth: border === 'right' ? 1 : 0
        })
        let menu: MenuProps                     = { mode: 'inline', theme: 'dark', ...this.props.menu }
        this.log('render', { menu: this.state.menu, state: this.state, props: this.props })
        if ( ! this.state || ! this.state.menu ) return null;

        if ( this.props.collapsed !== this.state.collapsed ) {
            this.setState({ collapsed: this.props.collapsed }, () => {
                if ( this.props.collapsed ) {
                    runInAction(() => {
                        this.state.menu.selected = []
                        this.state.menu.openKeys = []
                    })
                }
            })
        }

        return (

            <Menu
                {...menu}
                openKeys={this.state.menu.openKeys}
                selectedKeys={this.state.menu.selected}
                // onOpenChange={this.state.menu.onOpenChange}
                // onSelect={this.state.menu.onSelect}
                // onDeselect={this.state.menu.onDeselect}
                onClick={this.state.menu.onClick}
                multiple={this.state.menu.behaviour.select === 'multi'}
                className={classes(classNames.root, className, borderClass)}
            >

                {this.state.menu.items.map(item => this.renderMenuItem(item))}
            </Menu>
        )

    }

    renderMenuItem(item: MenuItem) {
        const { classNames, itemRenderType } = this.props
        const renderer                       = this.constructor[ 'renderers' ][ itemRenderType ];
        switch ( item.type ) {
            case 'divider':
                return (<Menu.Divider key={item._id}/>)
            case 'header':
                return (<Item key={item._id} className={classNames.headerItem}>{item.icon ? <Icon name={item.icon}/> : null}{item.label}</Item>)
            // return (<ItemGroup key={item._id}>{item.children.map(child => this.renderMenuItem(child))}</ItemGroup>)
            case 'side-menu':
                return renderer(item)
            case 'label':
                return renderer(item)
            case 'link':
                return renderer(item)
            case 'router-link':
                return renderer(item)
            // return (<Item key={item._id}><Link to={item.to}>{item.icon ? <Icon name={item.icon}/> : null}{item.label}</Link></Item>)
            case 'sub-menu':
                return (
                    <SubMenu key={item._id} onTitleClick={this.state.menu.onSubMenuClick(item)} title={
                        <span>{item.icon ? <Icon name={item.icon}/> : null}<span>{item.label}</span></span>
                    }>
                        {item.children.map(child => this.renderMenuItem(child))}
                    </SubMenu>)
        }
        return null;
    }

}
