import { Menu, MenuItem, SubMenu } from '@/tmenu/Menu';
import { ReactInstance } from 'react';

export type IMenuComponentTypes = Menu | MenuItem | SubMenu

export interface IMenuComponent {
    parent?: IMenuComponentTypes
    GUID?:string
    refs?:{
        [key: string]: ReactInstance
    };
}

export type Flat = Array<FlatItem>

export interface FlatItem {
    GUID    ?: string
    type    ?:string
    instance: ReactInstance

}


export type Tree = Array<TreeItem>

export interface TreeItem extends FlatItem {
    children: Array<TreeItem>
}
