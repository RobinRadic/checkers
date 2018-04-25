import { LayoutStoreFooter, LayoutStoreHeader, LayoutStorePage, LayoutStoreSide } from '../stores/LayoutStore';

export const Symbols = {
    RootStore: Symbol('RootStore'),
    LayoutStore: Symbol('LayoutStore'),
    BreakpointStore: Symbol('BreakpointStore'),
    RouterStore: Symbol('RouterStore'),
    DocumentStore: Symbol('DocumentStore'),
    LayoutStoreHeader: Symbol('LayoutStoreHeader'),
    LayoutStoreLeft: Symbol('LayoutStoreLeft'),
    LayoutStoreRight: Symbol('LayoutStoreRight'),
    LayoutStorePage: Symbol('LayoutStorePage'),
    LayoutStoreFooter: Symbol('LayoutStoreFooter'),

    Api: Symbol('Api'),
    ApiClient: Symbol('ApiClient'),
    ApiClientCacheStrategy: Symbol('ApiClientCacheStrategy'),
    Cache: Symbol('Cache'),
    ApiRequestConfig: Symbol('ApiRequestConfig'),

    MenuManager: Symbol('MenuManager'),
    InspectorDevStore: Symbol('InspectorDevStore'),
    routes: Symbol('routes'),
    DocumentPage: Symbol('DocumentPage'),
    Router: Symbol('Router')
}