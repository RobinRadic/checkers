import { inject, injectable } from 'inversify';
import { action, computed, observable, toJS } from 'mobx';
import { Breakpoint, Color, LayoutConfig, LayoutFooter, LayoutHeader, LayoutPage, LayoutSide, MenuItem } from 'api';
import { Symbols } from 'ioc';
import { kindOf, objectLoop, objectSet } from '@radic/util';
import { MenuUtils } from 'utils/MenuManager';

const log = require('debug')('store:layout')
export type LayoutPart = keyof LayoutConfig

@injectable()
export class LayoutStorePart<T> {
    defaults: any = {}

    @observable meta: any  = {}
    @observable class: any = {}
    @observable style: any = {}

    setDefaults(without: string[] = []) {
        without.push('defaults', '__mobxDidRunLazyInitializers', '$mobx')
        let names = Object.getOwnPropertyNames(this).filter(name => without.includes(name) === false)
        log('setDefaults', names);
        names.forEach(name => this.defaults[ name ] = toJS(this[ name ]))
        log('setDefaults', { names, defaults: this.defaults, me: this });
    }

    resetToDefaults(only?: string[]) {
        let names = Object.keys(this.defaults)
        if ( only ) names = names.filter(name => only.includes(name));
        names.forEach(name => this[ name ] = this.defaults[ name ]);
    }

    @computed get classes(): string {
        let classes = [];
        if ( kindOf(this.class) === 'object' ) {
            objectLoop(this.class, (key, item) => {
                if ( item === true ) classes.push(key);
            })
        } else if ( kindOf(this.class) === 'array' ) {
            classes = classes.concat(this.class);
        } else if ( kindOf(this.class) === 'string' ) {
            classes = classes.concat(this.class.split(' '));
        }
        return classes.join(' ');
    }

    @action setClass(name: string, show: boolean = true) {
        if ( kindOf(this.class) === 'object' ) {
            this.class[ name ] = show
        } else if ( kindOf(this.class) === 'array' ) {
            this.class.push(name);
        } else if ( kindOf(this.class) === 'string' ) {
            this.class += ' ' + name
        }
    }

    @action setStyle(name: string, value: any) {
        this.style[ name ] = value;
    }

    @action unsetStyle(name?: string | string[]) {
        if ( name === undefined ) {
            this.style = {}
        } else {
            name = Array.isArray(name) ? name : [ name ];
            name.forEach(name => delete this.style[ name ]);
        }
    }

    @action set<K extends keyof T>(key: K, value: T[K]) {
        this[ key as any ] = value;
    }

    @action merge(value: Partial<T>) {
        Object.keys(value).forEach(<K extends keyof T>(key: K) => this.set(key, value[ key ]));
    }

    @action setMeta(prop: string, val: any) {
        objectSet(this.meta, prop, val);
    }
}

@injectable()
export class LayoutStoreHeader extends LayoutStorePart<LayoutHeader> implements LayoutHeader {
    @observable color: Color             = 'blue-grey-9'
    @observable show: boolean            = true
    @observable static: boolean          = true
    @observable revealOnScroll: boolean  = true
    @observable menu: Array<MenuItem>    = []
    @observable title: string            = 'Codex'
    @observable showTitle: boolean       = true
    @observable showLeftToggle: boolean  = true
    @observable showRightToggle: boolean = true

    constructor() {
        super()
        this.class = { 'c-header': true }
        this.setDefaults();
    }

    @action toggleShow() { this.show = ! this.show }

    @action hide() { this.show = false }
}

@injectable()
export class LayoutStoreSide extends LayoutStorePart<LayoutSide> implements LayoutSide {
    @observable show: boolean          = true
    @observable static: boolean        = false
    @observable belowHeader: boolean   = true
    @observable aboveFooter: boolean   = true
    @observable class: any             = {}
    @observable style: any             = {}
    @observable menu: Array<MenuItem>  = []
    @observable collapsed: boolean     = false
    @observable collapsible: boolean   = true
    @observable collapsedWidth: number = 45
    @observable breakpoint: Breakpoint = 'md'
    @observable width: number          = 320

    @action toggleCollapsed() { this.collapsed = ! this.collapsed }

    @action collapse() { this.collapsed = true }

    @action open() { this.collapsed = false }

    @action toggleShow() { this.show = ! this.show }

    @action hide() { this.show = false }

    get menuItems(): MenuItem[] {return toJS(this.menu)}

    /**
     * class and setDefaults are called in the ioc/module.ts container module loader
     */
}

@injectable()
export class LayoutStorePage extends LayoutStorePart<LayoutPage> implements LayoutPage {
    constructor() {
        super()
        this.class = { 'c-page': true }
        this.setDefaults();
    }
}

@injectable()
export class LayoutStoreFooter extends LayoutStorePart<LayoutFooter> implements LayoutFooter {
    @observable color: Color          = 'blue-grey-9'
    @observable show: boolean         = true
    @observable static: boolean       = false
    @observable class: any            = { 'c-footer': true }
    @observable style: any            = {}
    @observable menu: Array<MenuItem> = []

    constructor() {
        super()
        this.class = { 'c-footer': true }
        this.setDefaults();
    }

    @action toggleShow() { this.show = ! this.show }

    @action hide() { this.show = false }
}

@injectable()
export class LayoutStore implements LayoutConfig {
    parts: LayoutPart[] = [ 'header', 'left', 'right', 'page', 'footer' ]

    @inject(Symbols.LayoutStoreHeader) header: LayoutStoreHeader
    @inject(Symbols.LayoutStoreLeft) left: LayoutStoreSide
    @inject(Symbols.LayoutStoreRight) right: LayoutStoreSide
    @inject(Symbols.LayoutStorePage) page: LayoutStorePage
    @inject(Symbols.LayoutStoreFooter) footer: LayoutStoreFooter

    set(layout: LayoutConfig)
    set<K extends keyof T, T = LayoutConfig>(part: K, partial: T[K])
    set<K extends keyof T, KK extends keyof TT, T = LayoutConfig, TT = T[K]>(part: K, key: KK, val: TT[KK])
    set(...args: any[]) {
        log('LayoutStore.set', { args })
        let len = args.length
        if ( len === 1 ) {
            let layout: LayoutConfig = args[ 0 ];
            Object.keys(layout).forEach(key => {
                this[ key as any ].merge(layout[ key ]);
            })
        } else if ( len === 2 ) {
            let part    = args[ 0 ];
            let partial = args[ 1 ];
            this[ part ].merge(partial);
        } else if ( len === 3 ) {
            let part = args[ 0 ];
            let key  = args[ 1 ];
            let val  = args[ 2 ];
            this[ part ].set(key, val);
        }
    }

    toJS() {
        let js = {}
        this.parts.forEach(part => js[ part ] = toJS(this[ part ]))
        return js;
    }

    @action setMenuSelected(cb: (item: MenuItem) => boolean) {
        this.parts.forEach(part => {
            if ( this[ part ][ 'menu' ] !== undefined ) {
                MenuUtils.each(this[ part ][ 'menu' ], item => {
                    if ( cb(item) ) {
                        item.selected = true;
                    }
                });
            }
        })
    }
}