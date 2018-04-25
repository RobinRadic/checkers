import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react';
import { GUID, Hot } from 'decorators';
import { classes, style } from 'typestyle'
import { getElementType } from 'utils/getElementType';
import { observable } from 'mobx';
import { mapChildren } from './utils'
import MenuStore from '@/menu/MenuStore';
import PropTypes from 'prop-types'
import './style/index.scss'
import scssvars from '!!scss-vars!./style/_variables.scss';
import { CSSProperties } from 'typestyle/lib/types';
import SubMenu from '@/menu/SubMenu';
import MenuItem from '@/menu/MenuItem';

const log = require('debug')('components:menu')
log('scssvars', { scssvars })

export type MenuDirection = 'vertical' | 'horizontal'
export type MenuChildAlign = 'left' | 'right' | 'center'
export type MenuChildIconSide = 'left' | 'right' | 'top' | 'bottom'

export interface MenuProps {
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
    // horizontalHeight?: CSSProperties['height']
    verticalWidth?: CSSProperties['width']
    collapsedWidth?: CSSProperties['width']
    dropdown?: boolean
    itemSeperators?: boolean
}

export interface IMenuChildContext {
    store: MenuStore
    parent: IMenuComponentTypes
}

export type IMenuComponentTypes = Menu | MenuItem | SubMenu

export interface IMenuComponent {
    parent?: IMenuComponentTypes
    GUID?:string
    store?:MenuStore
}

interface State {
}

/**
 * Menu component
 */
@Hot(module)
@GUID()
@observer
export class Menu extends Component<MenuProps, State> implements IMenuComponent {
    @observable store: MenuStore   = new MenuStore(this)

    static displayName: string     = 'Menu'
    static defaultProps: MenuProps = {
        direction         : 'horizontal',
        collapsible       : false,
        collapsed         : false,
        as                : 'ul',
        alignChildren     : 'left',
        childIconSide     : 'left',
        equalizeChildWidth: false,
        dropdown          : true,
        verticalWidth     : 300,
        collapsedWidth    : 45,
        itemSeperators    : true
    }

    getChildContext          = (): IMenuChildContext => ({
        store : this.store,
        parent: this
    })
    static childContextTypes = {
        store : PropTypes.object.isRequired,
        parent: PropTypes.object.isRequired
    }

    isRoot = true

    componentWillMount(){
        window['menu'] = this;
    }
    render() {
        const children    = mapChildren(this)
        const ElementType = getElementType<MenuProps>(Menu, this.props)
        return (
            <ElementType className={this.getClassName()}>
                {children}
            </ElementType>
        )
    }

    getClassName() {
        const { dropdown, direction, alignChildren, collapsed, childIconSide, equalizeChildWidth, verticalWidth, collapsedWidth } = this.props;

        let cls                                                                                                                   = [ 'menu', direction, 'icons', 'icon-' + childIconSide ]
        if ( direction === 'vertical' ) {
            cls.push(style({ width: collapsed ? collapsedWidth : verticalWidth }))
            collapsed && cls.push('collapsed')
        }
        if ( equalizeChildWidth ) cls.push('expanded')
        return classes(...cls)
    }


}

export default Menu
