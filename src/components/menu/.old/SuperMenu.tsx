import React, { Component, ReactNode } from 'react';
import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Hot } from 'decorators';
import { getElementType } from 'utils/getElementType';
import { classes, style } from 'typestyle';
import scssvars from '!!scss-vars!./style/_variables.scss';
import { CSSProperties } from 'typestyle/lib/types';
import { ClickParam, MenuItemProps } from '@/menu/MenuItem';
import { FontAwesomeIcon } from 'interfaces';
import { Icon } from '@/Icon';


const log = require('debug')('components:menuv2')

log('scssvars', { scssvars })

export type MenuDirection = 'vertical' | 'horizontal'
export type MenuChildAlign = 'left' | 'right' | 'center'
export type MenuChildIconSide = 'left' | 'right' | 'top' | 'bottom'


interface BaseMenuChild<T=any> {
    as?: React.ReactNode
    menu?: Menu
    state?: MenuState
    parent?: T
}

export class MenuState {
    constructor(public menu: Menu) {}
}

function prepareRootChildren(menu: Menu, parent: any, children: ReactNode): ReactNode {
    return React.Children.map(children, (child: React.ReactElement<any>) => {
        return React.cloneElement(child, { menu, parent, state: menu.state });
    })
}

function prepareChildren(component: Component<BaseMenuChild>): ReactNode {
    return React.Children.map(component.props.children, (child: React.ReactElement<any>) => {
        return React.cloneElement(child, { menu: component.props.menu, parent: component, state: component.props.state });
    })
}

export class Classes {
    @observable.shallow items: string[] = []

    // @action add(name) {this.items.push(name)}
    //
    // @action has(name): boolean {return this.items.includes(name)}
    //
    // @action ensure(name) {! this.has(name) ? this.items.push(name) : null }
    //
    // @action remove(name) {
    //     if ( ! this.has(name) ) return
    //     this.items = this.items.filter(n => n !== name)
    // }

    get itemsJS(): string[] { return toJS(this.items) }

    toArray() { return toJS(this.items) }

    @computed get className() { return classes(...this.items)}

    @action reset() { this.items = [] }

    @action add(...name: string[]) {this.items.push(...name)}

    @action remove(...name: string[]) {this.items = this.items.filter(n => name.includes(n) === false)}

    @action has(...name: string[]) {return name.filter(n => this.items.includes(n)).length === name.length}

    @action ensure(...name: string[]) {name.filter(n => this.has(n) === false).forEach(n => this.items.push(n))}

}


interface MenuProps {
    /** Either "vertical" or "horizontal" */
    direction?: MenuDirection
    /** Only usable when {direction} is vertical. When enabled, the menu is able to collapse to a smaller width */
    collapsible?: boolean
    /** Collapses the menu */
    collapsed?: boolean
    /** HTMLElement name */
    as?: React.ReactNode
    /** Extra styles that can be applied */
    style?: React.CSSProperties
    /** Extra class that can be applied */
    className?: string;
    /** Items can also be set to expand out and take up an even amount of space */
    expanded?: boolean
    /** Only usable when {direction} is vertical}. Aligns the child menu items to the left, right or center */
    alignChildren?: MenuChildAlign
    /** Menu items can have icons. This will set the global orientation to either top,left,right or bottom*/
    childIconSide?: MenuChildIconSide
    /** Only usable when {direction} is horizontal. items will automatically size themselves equally depending on how many are inside the menu. */
    equalizeChildWidth?: boolean
    /** Only usable when {direction} is vertical. Resizes the width of the menu */
    verticalWidth?: CSSProperties['width']
    /** Only usable when {direction} is vertical and {collapsible} & {collapsed} are enabled. Resizes to a small bar */
    collapsedWidth?: CSSProperties['width']

}

@Hot(module)
@observer
export class Menu extends Component<MenuProps> {
    static displayName             = 'Menu'
    static defaultProps: MenuProps = {
        direction         : 'horizontal',
        collapsible       : false,
        collapsed         : false,
        as                : 'ul',
        alignChildren     : 'left',
        childIconSide     : 'left',
        equalizeChildWidth: false,
        verticalWidth     : 300,
        collapsedWidth    : 45
    }

    @observable classes: Classes = new Classes()
    @observable state: MenuState = new MenuState(this)

    getClassName() {
        const { direction, collapsed, childIconSide, equalizeChildWidth, verticalWidth, collapsedWidth } = this.props;
        this.classes.reset()
        this.classes.add('menu', direction, 'icons')
        this.classes.add('icon-' + this.vertical ? 'left' : childIconSide)
        collapsed && this.classes.add('collapsed');
        this.horizontal && equalizeChildWidth === true && this.classes.add('equal-child-width')
        this.vertical && this.classes.add(style({ width: collapsed ? collapsedWidth : verticalWidth }))
        return this.classes.className;
    }

    render() {

        const children    = prepareRootChildren(this, this, this.props.children)
        const ElementType = getElementType<MenuProps>(Menu, this.props)
        return (
            <ElementType className={this.getClassName()}>
                {children}
            </ElementType>
        )
    }

    get vertical(): boolean { return this.props.direction === 'vertical' }

    get horizontal(): boolean { return this.props.direction === 'horizontal' }

}


interface ItemProps extends BaseMenuChild {
    /** FontAwesome icon */
    icon?: FontAwesomeIcon
    /** Enable if item simply contains text */
    isText?: boolean
    /** called when clicked on item */
    onClick?: (param: ClickParam) => void
    /** the text to display or react component to render*/
    label?: React.ReactNode
    /** not yet implemented */
    sublabel?: string
    /** mark as active item */
    active?: boolean
}

@Hot(module)
@observer
export class Item extends Component<ItemProps> {
    static displayName: string         = 'MenuItem'
    static defaultProps: MenuItemProps = {
        as    : 'li',
        active: false,
        isText: false,
        menu  : null
    }
    @observable classes: Classes       = new Classes()

    componentWillMount() {
        //todo change to other approach
        this.classes.add('menu-item')
    }

    render() {
        const children    = prepareChildren(this)
        const ElementType = getElementType<MenuProps>(Menu, this.props)
        return (
            <ElementType className={this.classes.className}>
                {this.getElementContent()}
            </ElementType>
        )
    }


    getElementContent() {
        const { children, active, icon, label, isText, menu } = this.props;


        if ( isText ) {
            if ( React.isValidElement(children) ) {
                return 'When isText is enabled, you can not pass a React Element. Only text allowed.'
            }
            return children ? children : label
        }
        let Link  = (props) => (<a href="#" onClick={this.onClick}>{props.children}</a>)
        let _icon = icon ? <Icon name={icon}/> : null
        let _span = <span>{label}</span>

        if ( menu ) {
            if ( menu.props.childIconSide === 'top' || menu.props.childIconSide === 'left' ) {
                return <Link>{_icon}{_span}</Link>
            }
            return <Link>{_span}{_icon}</Link>
        }
    }

    onClick = (event: React.MouseEvent<any>) => {
        log('onClick', { event, item: this });
        event.preventDefault();
    }
}


interface SubMenuProps extends BaseMenuChild {

}

@Hot(module)
@observer
export class SubMenu extends Component<SubMenuProps> {
    static displayName           = 'SubMenu'
    @observable classes: Classes = new Classes()


    render() {
        const children    = prepareChildren(this)
        const ElementType = getElementType<MenuProps>(Menu, this.props)
        return (
            <ElementType className={this.classes.className}>
                {children}
            </ElementType>
        )
    }
}

