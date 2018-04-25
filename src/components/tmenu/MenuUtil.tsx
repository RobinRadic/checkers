import { Menu, MenuItem, SubMenu } from './Menu';
import { Hot } from 'decorators';
import { action, observable } from 'mobx';
import { values } from 'lodash';
import { Flat, FlatItem, IMenuComponent, Tree } from '@/tmenu/interfaces';
import { ReactInstance } from 'react';

@Hot(module)
export class MenuUtil {
    constructor(menu: Menu) {
        this.setMenu(menu)
    }

    @action setMenu(menu: Menu) { this.menu = menu }

    @observable menu: Menu;

    toggleMenuItemSubMenu(item: MenuItem) {
        // opening the submenu of an menu item.
        // this requires all sibling items that might have submenus open to close them.
        // first close all submenus of sibling menu items
        // then  open submenu of the menu item
        let itemSubMenu = this.findChildByName<SubMenu>(item, SubMenu.displayName);
        values(item.parent.refs).forEach(menuItem => {
            this.getChildrenOfName(menuItem, SubMenu.displayName).forEach((subMenu: SubMenu) => {
                if ( subMenu !== itemSubMenu ) {
                    subMenu.close()
                }
            })
        })
        itemSubMenu.toggle();
    }

    getSiblings(instance: IMenuComponent): ReactInstance[] {
        return values(instance.parent.refs)
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

    flat(): Flat {
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

    getItemByGUID(guid: string):FlatItem {
        return this.flat().find(value => value.GUID === guid);
    }

    findChildByName<T extends ReactInstance>(instance, name): T | undefined {
        return values(instance.refs).find(value => value.constructor.name === name)
    }

    getChildrenOfName<T extends ReactInstance>(instance, name): T[] {
        return values(instance.refs).filter(value => value.constructor.name === name)
    }

    getChildTypes(instance): string[] {
        return values(instance.refs).map(value => value.constructor.name);
    }


}
