/*
 * Copyright (c) 2018. Codex Project
 *
 * The license can be found in the package and online at https://codex-project.mit-license.org.
 *
 * @copyright 2018 Codex Project
 * @author Robin Radic
 * @license https://codex-project.mit-license.org MIT License
 */


/**
 * Codex API
 * Codex API
 *
 * OpenAPI spec version: 1.0.0
 * Contact: rradic@hotmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


export interface Dictionary<T> {[index: string]: T;}

export interface FetchAPI {(url: string, init?: RequestInit): Promise<any>;}


export interface FetchArgs {
    url: string;
    options: any;
}


export interface ApplicationConfig {
    'name': string;
    'debug': boolean;
    /**
     * The application's configured base url
     */
    'url': string;
    'timezone': string;
    'locale': string;
}

export interface BaseProject {
    /**
     * Can be considered as a `slug`
     */
    'key': string;
    'display_name': string;
    'description': string;
    'default_revision': string;
    /**
     * An array of `revision` => `default_document`
     */
    'revisions': Array<{ [key: string]: string; }>;
}

/**
 * Supported color classes for the theme
 */
export interface Color {
}

export interface Document extends Dictionary<any> {
    'project': string;
    'revision': string;
    'author'?: string;
    'title'?: string;
    'subtitle'?: string;
    'path': string;
    'pathName': string;
    /**
     * The view to use for displaying documents
     */
    'view': string;
    layout?: LayoutConfig
    'processors': Processors;
    /**
     * If the request query contains 'render', the rendered HTML content will be included
     */
    'content'?: string;
}

export interface Error {
    'code': string;
    /**
     * The severity of the error
     */
    'level': ErrorLevelEnum;
    'message': string;
    'moreInfo'?: string;
}

export type ErrorLevelEnum = 'error' | 'warning' | 'info';

export interface Index {
    /**
     * A list of all available data structures you can fetch
     */
    'available'?: Array<string>;
    /**
     * One or more data blocks you want to fetch
     */
    'fetched'?: Array<string>;
    'layout'?: LayoutConfig;
    'app'?: ApplicationConfig;
    'projects'?: ProjectsConfig;
}

export interface LayoutConfig {
    'header'?: LayoutHeader;
    'left'?: LayoutSide;
    'right'?: LayoutSide;
    'page'?: LayoutPage;
    'footer'?: LayoutFooter;
}

export interface LayoutFooter {
    'color'?: Color;
    'show'?: boolean;
    'static'?: boolean;
    'class'?: any;
    'style'?: any;
    'menu'?: Array<MenuItem>;
}

export interface LayoutHeader {
    'color'?: Color;
    'show'?: boolean;
    'static'?: boolean;
    'revealOnScroll'?: boolean;
    'class'?: any;
    'style'?: any;
    'menu'?: Array<MenuItem>;
    'title'?: string;
    'showTitle'?: boolean;
    'showLeftMenu'?: boolean;
    'showRightMenu'?: boolean;
    'showLeftToggle'?: boolean;
    'showRightToggle'?: boolean;
}

export interface LayoutPage {
    'class'?: any;
    'style'?: any;
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface LayoutSide {
    show?: boolean;
    static?: boolean;
    belowHeader?: boolean;
    aboveFooter?: boolean;
    class?: any;
    style?: any;
    menu?: Array<MenuItem>;
    collapsed?: boolean
    collapsible?: boolean
    collapsedWidth?: number
    breakpoint?: Breakpoint
    width?: number
}

export interface MenuItem {
    _id?: string
    _parent?: () => MenuItem
    'type'?: MenuItemTypeEnum;
    'to'?: Partial<any> | string;
    'custom'?: (item: MenuItem, $event: MouseEvent) => void
    component?: string
    properties?: any
    /**
     * This will display the children in the `left` or `right` side-menu Only available when type is set to   - `side-menu`
     */
    'side'?: MenuItemSideEnum;
    /**
     * Only available when type is set to `link`
     */
    'href'?: string;
    /**
     * only available when `type` is set to   - `link`   - `router-link`
     */
    'target'?: MenuItemTargetEnum;
    /**
     * Only available when type is set to   - `side-menu`   - `sub-menu`
     */
    'children'?: Array<MenuItem>;
    /**
     * Only available when type is set to   - `side-menu`   - `sub-menu`
     */
    'expand'?: boolean;
    'selected'?: boolean;
    /**
     * The main text label
     */
    'label'?: string;
    /**
     * If a menu item supports sublabels, it will show, otherwise not
     */
    'sublabel'?: string;
    /**
     * Can optionally set a font-awesome icon. Use the `fa-` prefix.
     */
    'icon'?: string;
    'color'?: Color;
    /**
     * This is a ShortType. This will be transformed into a `router-link`. The link will point to a revision in the current project If `project` is also set, it will point to the a revision in that project
     */
    'project'?: string;
    /**
     * This is a ShortType. This will be transformed into a `router-link`. The link will point to a revision in the current project If `project` is also set, it will point to the a revision in that project
     */
    'revision'?: string;
    /**
     * This is a ShortType. This will be transformed into a `router-link`. The link will point to a document in the current revision of the current project If `revision` is also set, it will point to a document in that revision if `revision` and `project` are also set, it will point to a document in that project's revision
     */
    'document'?: string;
    /**
     * This is a ShortType. If true, this item will get the projects appended to it's children
     */
    'projects'?: boolean;
    /**
     * This is a ShortType. If true, this item will get the revisions for the current project appended to it's children
     */
    'revisions'?: boolean;
}

export type MenuItemTypeEnum = 'link' | 'router-link' | 'sub-menu' | 'side-menu' | 'header' | 'label' | 'divider' | 'custom';
export type MenuItemSideEnum = 'left' | 'right';
export type MenuItemTargetEnum = '_blank' | '_parent' | '_self' | '_top';

/**
 * Enabled processors and their configuration
 */
export interface Processors extends Dictionary<any> {
    /**
     * All enabled processors
     */
    'enabled': Array<string>;
}

export interface Project extends BaseProject {
    'disk': string;
    /**
     * The view to use for displaying documents
     */
    'view': string;
    'processors': Processors;
}

/**
 * A full structure of all projects, its revisions and their basic config
 */
export interface ProjectsConfig {
    /**
     * The default project key
     */
    'default': string;
    'items': Array<BaseProject>;
}

export interface Revision {
    'key': string;
    'project': string;
    'documents': Array<string>;
    'default_document': string;
    'view': string;
    'processors': Processors;
    'layout'?: LayoutConfig;
}

/**
 * VueRouter's route definition
 */
export interface RouterLocation {
    'name'?: string;
    'path'?: string;
    'hash'?: string;
    'query'?: any;
    'params'?: any;
    'append'?: boolean;
    'replace'?: boolean;
}
