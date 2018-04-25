import { Hot } from 'decorators';
import { action, computed, observable } from 'mobx';
import Menu, { IMenuComponent, IMenuComponentTypes, MenuChildIconSide, MenuDirection } from '@/menu/Menu';
import { values } from 'lodash'
import SubMenu from '@/menu/SubMenu';
import MenuItem from '@/menu/MenuItem';

@Hot(module)
export default class MenuStore {
    constructor(menu: Menu) {
        this.setMenu(menu)
    }

    @action setMenu(menu: Menu) { this.menu = menu }

    @observable menu: Menu;


    @computed get isVertical(): boolean { return this.direction === 'vertical' }

    @computed get isHorizontal(): boolean { return this.direction === 'horizontal' }

    @computed get direction(): MenuDirection { return this.menu.props.direction }

    @computed get collapsed(): boolean { return this.menu.props.collapsed }

    @computed get iconSide(): MenuChildIconSide { return this.menu.props.childIconSide }

    toggleMenuItemSubMenu(item: MenuItem) {
        // opening the submenu of an menu item.
        // this requires all sibling items that might have submenus open to close them.
        // first close all submenus of sibling menu items
        // then  open submenu of the menu item
        let itemSubMenu = this.getChildByName<SubMenu>(item, SubMenu.displayName);
        values(item.parent.refs).forEach(menuItem => {
            this.getChildrenByName(menuItem, SubMenu.displayName).forEach((subMenu: SubMenu) => {
                if(subMenu !== itemSubMenu) {
                    subMenu.close()
                }
            })
        })
        itemSubMenu.toggle();


    }


    tree(): Tree {
        function toTreeItem(value) {
            return {
                GUID    : value.GUID,
                type    : value.constructor.name,
                instance: value,
                children: values(value.refs).map(value => toTreeItem(value))
            }
        }

        return values(this.menu.refs).map(value => toTreeItem(value))
    }

    flat() {
        let flat = [];

        function recurse(value) {
            flat.push({
                GUID    : value.GUID,
                type    : value.constructor.name,
                instance: value
            })
            values(value.refs).forEach(val => {
                // flat.push({ type: val.constructor.name, instance: val })
                recurse(val)
            })
        }

        recurse(this.menu)
        return flat;
    }

    getItemByGUID(guid: string) {
        return this.flat().find(value => value.GUID === guid);
    }

    getChildByName<T>(instance, name): T | undefined {
        return values(instance.refs).find(value => value.constructor.name === name)
    }

    getChildrenByName<T>(instance, name): T[] {
        return values(instance.refs).filter(value => value.constructor.name === name)
    }

    getChildTypes(instance): string[] {
        return values(instance.refs).map(value => value.constructor.name);
    }


}

export type Tree = Array<TreeItem>

export interface TreeItem {
    type: string
    instance: IMenuComponent
    children: Array<TreeItem>
}
