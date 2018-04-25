import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { GUID, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import './style/tmenu.scss'
import { FontAwesomeIcon } from 'interfaces';
import { Icon } from '@/Icon';
import { isString } from 'lodash';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { IMenuComponent } from '@/tmenu/interfaces';
import { MenuUtil } from '@/tmenu/MenuUtil';

const log = require('debug')('components:Menu')

class MenuChildren {
    static get validNames(): string[] { return Menu.MenuComponents.map(cls => cls.displayName) }

    static isValidChild(child: React.ReactElement<any>) {
        if ( ! child || ! child.type || ! child.type[ 'displayName' ] ) return false;
        return MenuChildren.validNames.includes(child.type[ 'displayName' ]);
    }

    static map(children: any, props: any = {}) {
        return React.Children.map(children, (child: React.ReactElement<any>, index) => {
            if ( MenuChildren.isValidChild(child) ) {
                props.ref = 'child_' + index;
                return React.cloneElement(child as any, props)
            }
            return child;
        })
    }
}


//region: Menu

export interface MenuProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;

    icons?: boolean

    iconsDirection?: IconDirection

    vertical?: boolean

}

export type IconDirection = IconDirections.TOP | IconDirections.RIGHT | IconDirections.BOTTOM | IconDirections.LEFT

export enum IconDirections {
    TOP    = 'top',
    RIGHT  = 'right',
    BOTTOM = 'bottom',
    LEFT   = 'left'
}

interface State {}

/**
 * Menu component
 */
@GUID()
@Hot(module)
@observer
export class Menu extends Component<MenuProps, State> implements IMenuComponent {
    @observable util: MenuUtil = new MenuUtil(this)

    static displayName: string                              = 'Menu'
    static IconDirections: typeof IconDirections            = IconDirections
    static MenuComponents: Array<React.ComponentClass<any>> = []
    static defaultProps: MenuProps                          = {
        vertical      : true,
        icons         : true,
        iconsDirection: IconDirections.LEFT
    }
    static childContextTypes                                = {
        parent: PropTypes.object.isRequired,
        util  : PropTypes.object.isRequired
    }

    getChildContext = () => ({ parent: this, util: this.util })

    render() {
        return (
            <ul className={this.getClassName()}>{MenuChildren.map(this.props.children)}</ul>
        )
    }

    getClassName() {
        let { icons, iconsDirection, vertical } = this.props
        let cls                                 = [ 'menu' ];
        if ( vertical ) cls.push('vertical')
        if ( icons ) cls.push('icons', 'icons-' + iconsDirection)
        return classes(style(this.props.style), this.props.className, ...cls);
    }
}

//endregion


//region: MenuItem

export interface MenuItemProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;

    icon?: FontAwesomeIcon

}

interface State {}

/**
 * Menu component
 */
@GUID()
@Hot(module)
@observer
export class MenuItem extends Component<MenuItemProps, State> implements IMenuComponent {
    static displayName: string         = 'MenuItem'
    static defaultProps: MenuItemProps = {}
    static childContextTypes           = {
        parent: PropTypes.object.isRequired,
        util  : PropTypes.object.isRequired
    }
    static contextTypes                = {
        parent: PropTypes.object.isRequired,
        util  : PropTypes.object.isRequired
    }

    getChildContext = () => ({ parent: this, util: this.context.util })

    get util(): MenuUtil { return this.context.util }

    get parent() { return this.context.parent }

    render() {
        return (
            <li className={this.getClassName()} onClick={this.onClick}>
                {this.renderChildren()}
            </li>
        )
    }

    onClick = (event) => {
        this.util.toggleMenuItemSubMenu(this);
    }

    renderChildren() {
        const { children, icon } = this.props
        let totalChildren        = React.Children.count(children);
        // check if child is react component, probably a Link component of some sort
        if ( totalChildren > 0 ) {
            return React.Children.map(MenuChildren.map(children), (child, index) => {
                // if not a valid element, is probably just tekst. wrap it up with span
                if ( ! React.isValidElement(child) ) {
                    if ( isString(child) && child.length > 1 ) {
                        return (
                            <Fragment>
                                <span className="menu-link">
                                    {icon ? <Icon name={icon}/> : null}
                                    <span>{child}</span>
                                </span>
                            </Fragment>
                        );
                    }
                    return child;
                }
                if ( child.type[ 'displayName' ] && child.type[ 'displayName' ] === SubMenu.displayName ) {
                    return child;
                }
                let cloneChildren = null
                if ( isString(child.props[ 'children' ]) ) {
                    cloneChildren =
                        (<Fragment>
                            {icon ? <Icon name={icon}/> : null}
                            <span>{child.props[ 'children' ]}</span>
                        </Fragment>)
                }
                let clone = React.cloneElement(child as any, {
                    className: classes('menu-link')
                }, cloneChildren);

                return clone;
            });

        }
    }

    getClassName(): string {
        return classes(style(this.props.style), this.props.className, 'menu-item')
    }
}

//endregion


//region: SubMenu


export interface SubMenuProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;

}

interface State {}

/**
 * Menu component
 */
@GUID()
@Hot(module)
@observer
export class SubMenu extends Component<SubMenuProps, State> implements IMenuComponent {
    static displayName: string        = 'SubMenu'
    static defaultProps: SubMenuProps = {}
    static childContextTypes          = {
        parent: PropTypes.object.isRequired,
        util  : PropTypes.object.isRequired
    }
    static contextTypes               = {
        parent: PropTypes.object.isRequired,
        util  : PropTypes.object.isRequired
    }

    getChildContext = () => ({ parent: this, util: this.context.util })

    get util(): MenuUtil { return this.context.util }

    get parent() { return this.context.parent }

    @observable opened: boolean = false;

    @action open() { this.opened = true }

    @action close() { this.opened = false }

    @action toggle() { this.opened = ! this.opened }

    render() {
        return (
            <ul className={this.getClassName()}>
                {this.renderChildren()}
            </ul>
        )
    }

    renderChildren() {
        const { children } = this.props
        return MenuChildren.map(children)
    }

    getClassName(): string {
        let cls = [ 'submenu', 'nested' ];
        if ( this.opened ) {
            cls.push('open')
        }
        return classes(style(this.props.style), this.props.className, ...cls)
    }
}

//endregion

Menu.MenuComponents.push(Menu, MenuItem, SubMenu)


