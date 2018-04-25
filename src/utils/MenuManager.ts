/*
 * Copyright (c) 2018. Codex Project
 *
 * The license can be found in the package and online at https://codex-project.mit-license.org.
 *
 * @copyright 2018 Codex Project
 * @author Robin Radic
 * @license https://codex-project.mit-license.org MIT License
 */

import { intersection, keys } from 'lodash'
import { Dictionary, MenuItem, MenuItemTypeEnum } from 'api';
import { Config, getRandomId } from '@radic/util';
import { action, observable, runInAction, toJS } from 'mobx';

import md5 from 'utils/md5';
import { container, Symbols } from 'ioc';
import { RootStore } from 'stores';
import { inject, injectable } from 'inversify';
import * as React from 'react';
import { ClickParam } from '@/menu/MenuItem';

const log     = require('debug')('utils:menus')
const sidelog = require('debug')('utils:menus:side-menu-handler')
export type MenuShortTypeHandler = (item: MenuItem, store: RootStore, controller: MenuController) => MenuItem
export type MenuHandler = (this: MenuManager, item: MenuItem, event: ClickParam, store: RootStore, controller: MenuController) => void
export type MenuCompiler = (this: MenuManager, item: MenuItem, store: RootStore, controller: MenuController) => void

function installer(manager: MenuManager) {

    const updateOpenKeys      = (controller, itemID, expand: boolean) => runInAction(() => {
        let openKeys = toJS(controller.openKeys)
        let open     = openKeys.includes(itemID)
        if ( expand && ! open ) {
            openKeys.push(itemID); // add to open
            if ( controller.behaviour.expand === 'single-root' ) {
                const latestOpenKey = openKeys.find(key => controller.openKeys.indexOf(key) === - 1);
                if ( controller.rootSubmenuKeys.indexOf(latestOpenKey) === - 1 ) {
                    controller.openKeys = openKeys
                } else {
                    controller.openKeys = latestOpenKey ? [ latestOpenKey ] : []
                }
            } else if ( controller.behaviour.expand === 'multi-root' ) {
                controller.openKeys = openKeys;
            }
            controller.log('updateOpen: expand && ! open', itemID, toJS(controller.openKeys), toJS(controller.rootSubmenuKeys))
            // if(controller.hasItem(itemID)) controller.getItem(itemID).expand = true
        } else if ( ! expand && open ) {
            controller.openKeys = controller.openKeys.filter(o => o !== itemID)
            // if(controller.hasItem(itemID)) controller.getItem(itemID).expand = false
            controller.log('updateOpen: ! expand && open', itemID, toJS(controller.openKeys), toJS(controller.rootSubmenuKeys))
        } else {
            controller.log('updateOpen: NONE OF BOTH', itemID, { open, expand, openKeys: toJS(controller.openKeys), rootSubmenuKeys: toJS(controller.rootSubmenuKeys) })
        }
        updateOpenItems(controller)
    })
    const updateOpenItems     = controller => runInAction(() => {
        // close if expanded and not in openkeys
        MenuUtils.rfilter(controller.items, i => i.expand && ! controller.openKeys.includes(i._id)).forEach(i => i.expand = false);
        // expand if closed and in openkeys
        MenuUtils.rfilter(controller.items, i => ! i.expand && controller.openKeys.includes(i._id)).forEach(i => i.expand = true);
    })
    const updateSelected      = (controller, itemID, show: boolean) => runInAction(() => {
        let selected = controller.selected.includes(itemID)
        if ( show && ! selected ) {
            if ( controller.behaviour.select === 'single' ) {
                controller.selected = [ itemID ]
            } else if ( controller.behaviour.select === 'multi' ) {
                controller.selected.push(itemID)
            }
            if ( controller.hasItem(itemID) ) controller.getItem(itemID).selected = false
            controller.log('updateSelected: show && ! selected', itemID, toJS(controller.selected))
        } else if ( ! show && selected ) {
            controller.selected = controller.selected.filter(s => s !== itemID);
            if ( controller.hasItem(itemID) ) controller.getItem(itemID).selected = false
            controller.log('updateSelected: ! show && selected', itemID, toJS(controller.selected))
        }
        updateSelectedItems(controller)
    })
    const updateSelectedItems = controller => runInAction(() => {
        // close if expanded and not in openkeys
        MenuUtils.rfilter(controller.items, i => i.selected && ! controller.selected.includes(i._id)).forEach(i => i.selected = false);
        // expand if closed and in openkeys
        MenuUtils.rfilter(controller.items, i => ! i.selected && controller.selected.includes(i._id)).forEach(i => i.selected = true);
    })

    manager.registerShortType('project', (item, store) => {
        item.type  = 'router-link';
        let params = {
            project: item.project || store.project ? store.project.key : store.projects.default
        }
        item.to    = { path: `/documentation/${params.project}` };
        return item;
    })
    manager.registerShortType('revision', (item, store) => {
        item.type  = 'router-link';
        let params = {
            project : item.project || store.project ? store.project.key : store.projects.default,
            revision: item.revision || store.revision.key
        }
        item.to    = { path: `/documentation/${params.project}/${params.revision}` }
        return item;
    })
    manager.registerShortType('document', (item, store) => {
        item.type  = 'router-link';
        let params = {
            project : item.project || store.project ? store.project.key : store.projects.default,
            revision: item.revision || store.revision.key,
            document: item.document
        }
        item.to    = { path: `/documentation/${params.project}/${params.revision}/${params.document}` }
        return item;
    })
    manager.registerShortType('revisions', (item, store) => {
        item.children = [
            { type: 'header', label: 'revisions' },
            { type: 'divider' }
        ]
        let params    = {
            project: item.project || store.project ? store.project.key : store.projects.default
        }
        Object.keys(store.project.revisions).forEach(revision => {
            item.children.push({
                type : 'router-link',
                to   : { path: `/documentation/${params.project}/${revision}` },
                label: revision
            })
        })
        return item;
    })
    manager.registerShortType('projects', (item, store) => {
        item.children = [
            { type: 'header', label: 'Projects' },
            { type: 'divider' }
        ]
        store.projects.items.forEach(project => {
            item.children.push({
                type    : 'router-link',
                to      : { path: `/documentation/${project}` },
                icon    : 'fa-folder',
                label   : project.display_name,
                sublabel: project.description
            })
        })
        return item;
    })


    manager.registerHandler('router-link', (item, event, store, controller) => {
        let match = store.router.router.matchPath(item.to[ 'path' ])
        controller.log('handler router-link', { match, itemTo: item.to })
        if ( match ) {
            console.groupCollapsed('Router navigate to: ', match.path)
            console.log(match)
            console.groupEnd()
            // store.router.router.navigate(match.name, match.params, ((err, state) => {
            //     updateSelected(controller, item._id, true)
            // }))
        }
    })
    manager.registerHandler('sub-menu', (item, event, store, controller) =>  runInAction(() => {
        log('handler sub-menu', { item, event, store, manager })
        let expand = item.expand = ! item.expand;
        // updateOpenKeys(controller, item._id, expand);
    }))

    manager.registerHandler('side-menu', (item, event, store, controller) => {
        let shouldOpenSideMenuAfterTransacton = true;
        let sideMenuOpenerFn;
        let side                              = store.layout[ item.side ];
        let { show }                          = side

        // transaction(() => {
        //     sidelog('side(', item.side, ')  show(', show, ')')
        //
        //     const openSideMenu = () => {
        //         item.expand   = true;
        //         item.selected = true;
        //         // remove the selected and open entries
        //         // set item._id in selected and openKeys
        //         // set sideMenuParent to this item._id
        //         side.setMeta('sideMenuParentItem', item._id);
        //         // open side for this item
        //         side.set('menu', toJS(item.children));
        //         side.set('show', true)
        //
        //         controller.selected = [ item._id ];
        //         controller.openKeys = [ item._id ];
        //
        //         sidelog('openSideMenu  id(', item._id, ')  side(', item.side, ')  show(', show, ')', { item: toJS(item), children: toJS(item.children), side })
        //
        //     }
        //
        //     if ( show ) {
        //         // is side shown by other side-menu item or this side-menu item?
        //         let shownByOther = side.meta.sideMenuParentItem !== null && side.meta.sideMenuParentItem !== item._id;
        //         let shownBySelf  = side.meta.sideMenuParentItem === item._id;
        //
        //         sidelog('side(', item.side, ')  show(', show, ')  byOther(', shownByOther, ')  bySelf(', shownBySelf, ')  id(', item._id, ')  sideMenuParentItem(', side.meta.sideMenuParentItem, ')')
        //         if ( shownByOther ) {
        //             // side was not show by this side-menu item,
        //             let otherItem      = controller.getItem(side.meta.sideMenuParentItem);
        //             otherItem.expand   = false;
        //             otherItem.selected = false;
        //         } else if ( shownBySelf ) {
        //             // this item had side-menu open, closing it
        //             item.expand   = false;
        //             item.selected = false;
        //         }
        //         controller.selected = [];
        //         controller.openKeys = [];
        //         side.setMeta('sideMenuParentItem', null);
        //         side.set('show', false);
        //         side.set('menu', [])
        //
        //         if ( shownByOther && ! shownBySelf ) {
        //             shouldOpenSideMenuAfterTransacton = true;
        //         }
        //     } else {
        //         // side is closed, open it
        //         openSideMenu();
        //     }
        // })
        // setTimeout(() => {
        //     transaction(() => {
        //
        //         sidelog('out of transaction')
        //
        //         sidelog('shouldOpenSideMenuAfterTransacton', shouldOpenSideMenuAfterTransacton)
        //         if ( shouldOpenSideMenuAfterTransacton ) {
        //             item.expand   = true;
        //             item.selected = true;
        //             // remove the selected and open entries
        //             // set item._id in selected and openKeys
        //             // set sideMenuParent to this item._id
        //             side.setMeta('sideMenuParentItem', item._id);
        //             // open side for this item
        //             side.set('menu', toJS(item.children));
        //             side.set('show', true)
        //
        //             controller.selected = [ item._id ];
        //             controller.openKeys = [ item._id ];
        //         }
        //     })
        // }, 50)

        controller.log('side-menu', item.side, { side: store.layout[ item.side ], item: toJS(item), selected: toJS(controller.selected), openKeys: toJS(controller.openKeys) })
    })
    manager.registerCompiler('router-link', (item, store, controller) => {
        if ( item.to !== undefined && item.to[ 'path' ] !== undefined ) {
            // log('locationsAreEqual',locationsAreEqual(this.router.location, item.to),'if equal',this.router.location.path === item.to['path'], {routerLocation:this.router.location, itemTo: item.to})
            try {
                item.selected = store.router.route.path === item.to[ 'path' ]; //locationsAreEqual(this.router.location, item.to)
            }catch(e){
                console.warn(e)
            }
        }
        // let match = store.router.router.matchPath(item.to[ 'path' ])
        // updateSelected(controller, item._id, item.selected)
    })
}

export interface MenuManagerEvents {
    'compiled': (items: MenuItem[]) => void
    'compile': (items: MenuItem[]) => void
    'compile:item': (item: MenuItem) => void
    'compiled:item': (item: MenuItem) => void
    'ensure': (items: MenuItem[]) => void
    'ensured': (items: MenuItem[]) => void
    'ensure:item': (item: MenuItem) => void
    'ensured:item': (item: MenuItem) => void
    'short': (items: MenuItem[]) => void
    'shorted': (items: MenuItem[]) => void
    'short:item': (item: MenuItem) => void
    'shorted:item': (item: MenuItem) => void
    'handle': (item: MenuItem, event: ClickParam, handler: MenuHandler) => void,
}

export interface ManagerMap {
    shortTypes: Map<string, MenuShortTypeHandler>
    handlers: Map<string, MenuHandler>
    compilers: Map<string, MenuCompiler>
}

@injectable()
export class MenuManager {
    @inject(Symbols.RootStore)
    public store: RootStore
    protected shortTypes = new Map<string, MenuShortTypeHandler>()
    protected handlers   = new Map<string, MenuHandler>()
    protected compilers  = new Map<string, MenuCompiler>()

    constructor() {
        console.log('menu plugin', this)
        installer(this);
    }

    public registerCompiler(type: string | MenuItemTypeEnum, handler: MenuCompiler) {
        this.compilers.set(type, handler);
    }

    public registerHandler(type: string | MenuItemTypeEnum, handler: MenuHandler) {
        this.handlers.set(type, handler);
    }

    public registerShortType(name: string, handler: MenuShortTypeHandler) {
        this.shortTypes.set(name, handler);
    }

    public createController(component: React.Component) {
        let controller = MenuController.createFor(component);

        let map: ManagerMap = {
            compilers : this.compilers,
            shortTypes: this.shortTypes,
            handlers  : this.handlers
        }
        controller.setManagerMap(map)
        let name = component && component.props ? component.props['name'] : Math.round(Math.random() * 100);

        this.controllers[ name ] = controller
        return controller;
    }

    protected controllers: Dictionary<MenuController> = {}
}

export type MenuExpandBehaviourType = 'single-root' | 'multi-root'
export type MenuSelectBehaviourType = 'single' | 'multi'

@injectable()
export class MenuController {
    @inject(Symbols.MenuManager) private manager: MenuManager
                                         component: React.Component
    @observable.deep items: MenuItem[]         = []
    @observable rootSubmenuKeys: string[] = []
    @observable openKeys: string[]        = []
    @observable selected: string[]        = []

    get itemsJS() { return toJS(this.items) }

    get rootSubmenuKeysJS() { return toJS(this.rootSubmenuKeys) }

    get openKeysJS() { return toJS(this.openKeys) }

    get selectedJS() { return toJS(this.selected) }

    protected initialized: boolean                     = false
    protected selectBehaviour: MenuSelectBehaviourType = 'single'
    protected expandBehaviour: MenuExpandBehaviourType = 'single-root'
    protected map: ManagerMap

    log(...args) { require('debug')('utils:menu-controller')(...args)}

    public get behaviour(): { select: MenuSelectBehaviourType, expand: MenuExpandBehaviourType } { return { select: this.selectBehaviour, expand: this.expandBehaviour }}

    protected constructor() { }

    public static createFor(component: React.Component) {
        return container
            .make<MenuController>(MenuController)
            .setComponent(component)
    }

    private setComponent(component: React.Component): this {
        this.component = component
        return this
    }

    @action
    private setItems(items: MenuItem[]): this {
        this.items = items;
        return this
    }

    @action
    public init(items: MenuItem[]): this {
        if ( this.initialized !== false ) {
            throw new Error('Cannot init multiple times')
        }
        this.initialized     = true;
        items                = MenuUtils.mapItems(toJS(items), item => this.applyCompilers(this.applyShortTypes(this.applyDefaults(item))));
        this.rootSubmenuKeys = items.filter(item => item.type === 'sub-menu').map(item => item._id)
        this.items           = items
        return this;
    }

    public hasItem(id: string) { return this.getItem(id) !== undefined }

    public getItem(id: string) {return MenuUtils.rfind(this.items, i => i._id === id) }

    public setManagerMap(map: ManagerMap) {
        this.map = map
    }

    public setBehaviour(select: MenuSelectBehaviourType, expand: MenuExpandBehaviourType) {
        this.selectBehaviour = select;
        this.expandBehaviour = expand
    }

    protected applyDefaults(item: MenuItem): MenuItem {
        if ( item._id === undefined ) {
            item._id = md5(getRandomId(7))
        }
        if ( item.type === undefined ) {
            if ( item.children ) {
                item.type = 'sub-menu';
            } else if ( item.href ) {
                item.type = 'link';
            }
        }
        if ( item.selected === undefined ) {
            item.selected = false;
        }
        if ( item.expand === undefined ) {
            item.expand = false;
        }
        return item;
    }

    protected getShortTypesForItem(item: MenuItem) {
        return intersection(keys(item), Array.from(this.map.shortTypes.keys()));
    }

    protected applyShortTypes(item: MenuItem, recursive: boolean = true): MenuItem {
        this.getShortTypesForItem(item)
            .forEach(key => item = this.map.shortTypes.get(key).apply(this, [ item, this.manager.store, this ]))
        if ( recursive && item.children && item.children.length > 0 ) {
            MenuUtils.mapItems(item.children, (item) => this.applyShortTypes(item, false))
        }
        return item;
    }

    protected applyCompilers(item: MenuItem): MenuItem {
        let config = new Config({ ...item });
        // let newItem: MenuItem = {}
        Object.keys(item).forEach(key => {
            item[ key ] = config.get(key)
        })
        if ( this.map.compilers.has(item.type) ) {
            let compiler = this.map.compilers.get(item.type);
            compiler.apply(this, [ item, this.manager.store, this ]);
        }

        return item;
    }

    public handleMenuItemClick(item: MenuItem, event: React.MouseEvent<any>) {
        if ( false === this.map.handlers.has(item.type) ) {
            console.warn(`MenuManager::handleMenuItemClick. Could not find handler [${item.type}], `)
            return;
        }
        let handler = this.map.handlers.get(item.type);
        item        = this.applyCompilers(item);
        this.log('handleMenuItemClick', { item, event, handler })
        handler.apply(this, [ item, event, this.manager.store, this ]);
    }

    public onClick        = (param: ClickParam) => {
        this.log('onClick', { param })
        this.handleMenuItemClick(param.data, param.event)
    }
    //
    // public onClick        = (param: ClickParam) => {
    //     let key  = param.key.replace(/\.\$/g, '');
    //     let item = MenuUtils.rfind(this.items, item => item._id === key);
    //     this.log('onClick', { item, param })
    //     this.handleMenuItemClick(item, param)
    // }
    // public onSubMenuClick = item => (param: ClickParam) => {
    //     this.log('onSubMenuClick', { item, param })
    //     this.handleMenuItemClick(item, param)
    // }
}

export class MenuUtils {
    /**
     * Flattens the item tree recursively into the same level. Does not modify a item's children array.
     *
     * @param {MenuItem[]} items
     * @param {boolean} addParent If true, a reference to it's parent will be set on child items under _parent
     * @returns {MenuItem[]}
     */
    static flattenItems(items: MenuItem[], addParent: boolean = false) {
        let flat: MenuItem[] = [];

        const traverse = (items: MenuItem[], parent?: MenuItem) => {
            items.forEach(item => {
                if ( addParent && parent ) {
                    item._parent = () => parent;
                }
                flat.push(item);

                if ( item.children && item.children.length > 0 ) {
                    traverse(item.children, item);
                }
            })
        }

        traverse(items);

        return flat;
    }


    /**
     * Recursively transform each menu item
     * @param {MenuItem[]} items
     * @param {(item: MenuItem) => MenuItem} cb
     * @returns {MenuItem[]}
     */
    static mapItems(items: MenuItem[], cb: (item: MenuItem) => MenuItem): MenuItem[] {
        return items.map(item => {
            item = cb(item);
            MenuUtils.mapItems(item.children || [], cb);
            return item;
        })
    }

    /**
     * Recursively executes callback for each menu item
     * @param {MenuItem[]} items
     * @param {(item: MenuItem) => void} cb
     */
    static each(items: MenuItem[], cb: (item: MenuItem) => void) {
        items.forEach(item => {
            cb(item)
            MenuUtils.each(item.children || [], cb);
        })
    }

    static rfind(items: MenuItem[], predicate: (value: MenuItem, index: number, obj: MenuItem[]) => boolean) {
        return MenuUtils.flattenItems(items).find(predicate);
    }

    static rfilter(items: MenuItem[], predicate: (value: MenuItem, index: number, obj: MenuItem[]) => boolean) {
        return MenuUtils.flattenItems(items).filter(predicate);
    }


}

export class MenuCollection {
    _flat: MenuItem[]

    constructor(protected _items: MenuItem[]) {
        this._flat = MenuUtils.flattenItems(_items, true);
    }

    get tree(): MenuItem[] {return this._items};

    get flat(): MenuItem[] {return this._flat};

    find(id: string): MenuItem {
        return this._flat.find(item => item._id === id)
    }

    findBy(key: string, value: any): MenuItem {
        return this._flat.find(item => item[ key ] === value)
    }

    getParent(item: MenuItem): MenuItem | undefined {
        if ( this.hasParent(item) ) {
            return this._flat.find(_item => _item._id === item._id)._parent()
        }
    }

    hasParent(item: MenuItem): boolean {
        return this._flat.find(_item => _item._id === item._id)._parent !== undefined
    }

    getAnscestors(item: MenuItem): MenuItem[] {
        if ( ! this.hasParent(item) ) {
            return [];
        }
        let ancestors = [];
        const recurse = (_item) => {
            if ( this.hasParent(_item) ) {
                let parent = this.getParent(item);
                ancestors.push(parent);
                recurse(parent);
            }
        }
        recurse(item);
        return ancestors;
    }

    each(cb: (item: MenuItem) => void): this {
        this._flat.forEach(item => cb(item));
        return this;
    }

    filter(predicate: (value: MenuItem, index: number, obj: MenuItem[]) => boolean): MenuItem[] {
        return this._flat.filter(predicate)
    }
}
