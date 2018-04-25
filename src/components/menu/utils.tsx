import React, { Component, ReactNode } from 'react';
import { Menu } from '@/menu/Menu';

export interface BaseMenuChild<T=any> {
    as?: React.ReactNode
    // menu?: Menu
    // store?: MenuStore
    // parent?: any
    // store?: MenuStore


}

export interface GUIDComponent extends Component<any> {GUID: string}

//
// export class MenuasfsdfStore<T extends Component = Component> {
//
//     get itemsJS() {return toJS(this.submenuItems)}
//
//     @action handleClick(item: SubMenu & GUIDComponent, event: React.MouseEvent<any>, from: MenuItem) {
//         if(this.countAllOpenSubmenus() == 0){
//             this.toggleSubmenu(item);
//         } else {
//             this.closeAllSubmenus();
//             this.openSubmenu(item);
//         }
//     }
//
//     @action openSubmenu(item: SubMenu & GUIDComponent) {
//         item.opened = true
//     }
//
//     @action closeSubmenu(item: SubMenu & GUIDComponent) {
//         item.opened = false
//     }
//
//     @action toggleSubmenu(item: SubMenu & GUIDComponent) {
//         item.opened = ! item.opened
//     }
//
//     @action isSubmenuOpen(item: SubMenu & GUIDComponent) {
//         return item.opened;
//     }
//
//     @action countAllOpenSubmenus():number { return Object.keys(this.submenuItems).filter(guid => this.submenuItems[guid].opened).length}
//     @action closeAllSubmenus() {
//         Object.keys(this.submenuItems).forEach(guid => {
//             this.submenuItems[ guid ].opened = false;
//         })
//     }
//
//     @observable submenuItems: { [guid: string]: SubMenu & GUIDComponent } = {}
//
//     @action registerSubMenu(item: SubMenu & GUIDComponent) {
//         this.submenuItems[ item.GUID ] = item;
//     }
//
//     constructor(public menu: Menu) {}
// }

export function prepareRootChildren(menu: Menu, parent: any, children: ReactNode): ReactNode {
    return React.Children.map(children, (child: React.ReactElement<any>) => {
        return React.cloneElement(child, {
            parent
        });
    })
}

export function mapChildren(comp: Component<BaseMenuChild>, props: any = {}) {
    return React.Children.map(comp.props.children, (child: React.ReactElement<any>, index) => {
        props.ref = 'child_' + index;
        return React.cloneElement(child as any, props)
    })
}
