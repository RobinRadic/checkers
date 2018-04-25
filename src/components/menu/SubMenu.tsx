import * as React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, GUID, Hot } from 'decorators';
import { getElementType } from 'utils/getElementType';
import { classes } from 'typestyle';
import { IMenuItemChildContext, MenuItem } from '@/menu/MenuItem';
import { action, observable } from 'mobx';
import { BaseMenuChild,  mapChildren } from '@/menu/utils';
import MenuStore from '@/menu/MenuStore';
import { IMenuChildContext, IMenuComponent } from '@/menu/Menu';
import PropTypes from 'prop-types';

const log = require('debug')('components:submenu')
export type SubMenuVerticalModeType = 'nested' | 'dropdown';
export type SubMenuHorizontalModeType = 'dropdown' | 'something' ;

export type SubMenuMode = SubMenuHorizontalModeType | SubMenuVerticalModeType

export interface SubMenuProps extends BaseMenuChild<MenuItem> {
    /** if true, the SubMenu will show. Otherwise it is hidden */
    show?: boolean

    /** only applies if the menu {direction} is 'vertical'. Nested works like an accordion and popout like a context menu  */
    vmode?: SubMenuVerticalModeType

    hmode?: SubMenuHorizontalModeType

    childDropdownSide?: 'left' | 'right'

    onRef?: (ref: any) => void

}

interface State {}


/**
 * MenuItem component
 */
@Hot(module)
@GUID()
@observer
export default class SubMenu extends Component<SubMenuProps & CSSModules.InjectedCSSModuleProps, State> implements IMenuComponent {
    static displayName: string                 = 'SubMenu'
    static defaultProps: Partial<SubMenuProps> = {
        as               : 'ul',
        show             : false,
        vmode            : 'nested',
        hmode            : 'dropdown',
        childDropdownSide: 'right'
    }

    @observable opened: boolean = false

    @action open() { this.opened = true; }

    @action close() { this.opened = false; }

    @action toggle() { this.opened = ! this.opened; }

    context: IMenuItemChildContext

    get store(): MenuStore { return this.context.store }

    get parent(): MenuItem { return this.context.parent as any }

    getChildContext          = (): IMenuChildContext => ({
        store : this.context.store,
        parent: this
    })
    static childContextTypes = {
        store : PropTypes.object.isRequired,
        parent: PropTypes.object.isRequired
    }
    static contextTypes      = {
        store : PropTypes.object.isRequired,
        parent: PropTypes.object.isRequired,
        ref   : PropTypes.func
    }

    render() {
        if(this.props.show){
            this.open();
        }

        const children    = mapChildren(this, {  })
        const ElementType = getElementType<SubMenuProps>(SubMenu, this.props)
        return (
            <ElementType className={this.getClassName()}>
                {children}
            </ElementType>
        )
    }


    getClassName() {
        let cls = [ 'submenu', 'menu' ]
        if ( this.store === undefined ) {
            console.trace('undefined store')
        }
        if ( this.store.isVertical && this.props.vmode === 'nested' ) {
            cls.push('nested', 'vertical')
        }
        if ( this.store.isHorizontal ) {
            cls.push('is-dropdown-submenu')
        }
        if ( this.opened ) {
            cls.push('submenu-open')
        }
        return classes(...cls)
    }
}



