import * as React from 'react'
import { Hot } from 'decorators';
// import styles from './style/Menu.mod.scss'
import colors from '../../styles/compontents/_colors.scss'
import scssvars from '!!scss-vars!./style/_variables.scss';
import { pick } from 'lodash'
import * as csx from 'csx'
import { types } from 'typestyle'
import { MenuProps } from '@/menu/Menu';
import Menu from '@/menu/Menu';
import { colorMap } from 'src/stories/data/constants';

const log = require('debug')('components:menu')

log('scssvars', { scssvars })


const menuThemeVars = [ 'menuBgColor', 'menuBg', 'menuHorizontalHeight', 'menuVerticalWidth', 'menuVerticalCollapsedWidth', 'menuBorder', 'menuBorderRadius' ];

export interface MenuTheme {
    menuBgColor?: csx.ColorHelper
    menuBg?: csx.CsxBackground
    menuHorizontalHeight?: types.CSSProperties['height']
    menuVerticalWidth?: types.CSSProperties['width']
    menuVerticalCollapsedWidth?: types.CSSProperties['width']
    menuBorder?: types.CSSProperties['border']
    menuBorderRadius?: types.CSSProperties['borderRadius']
}

export interface MenuItemTheme {

}

@Hot(module)
export default class MenuThemeModifier {
    static modifyMenu<T extends Partial<MenuTheme>>(props:MenuProps, customizer: (set: (props: T ) => T, utils: typeof csx) => T ) {
        let defaults:T = pick.apply(pick, [ scssvars ].concat(menuThemeVars));

        const set = (props: T): T => {
            Object.keys(props).forEach(key => {
                defaults[ key ] = props[ key ]
            })
            return defaults as T;
        }

        let result:T = customizer(set, csx) as T;
        // handle result

        let styles:types.CSSProperties = {}

        result.menuBg.color = result.menuBgColor.toRGBA().toString();
        styles.background = result.menuBg;
        styles.border = result.menuBorder
        styles.borderRadius = result.menuBorderRadius

        return result;
    }



    static createCustomTheme(menu: Menu) {
        let res = MenuThemeModifier.modifyMenu(menu.props, (set, util) => {
            return set({
                menuBgColor               : util.color(colorMap[ 'blue-grey-7' ]),
                menuBorderRadius          : 0,
                menuBorder                : 'none',
                menuHorizontalHeight      : 60,
                menuVerticalWidth         : 300,
                menuVerticalCollapsedWidth: 40
            })
        })
    }
}
