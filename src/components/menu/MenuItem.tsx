import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, GUID, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import { FontAwesomeIcon } from 'interfaces';
import { Icon } from '@/Icon';
// import styles from './style/MenuItem.mod.scss'
import { getElementType } from 'utils/getElementType';
import { IMenuChildContext, IMenuComponent, IMenuComponentTypes, Menu } from '@/menu/Menu';
import SubMenu from '@/menu/SubMenu';
import { BaseMenuChild } from './utils'
import { mapChildren } from '@/menu/utils';
import MenuStore from '@/menu/MenuStore';
import PropTypes from 'prop-types';


const log = require('debug')('components:MenuItem')

export type ClickParam<D = any> = { event: React.MouseEvent<any>, item: MenuItem }

export interface MenuItemProps extends BaseMenuChild<SubMenu | Menu> {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
    /** FontAwesome icon */
    icon?: FontAwesomeIcon
    /** HTMLElement name to use */
    /** Enable if link */
    link?: React.ReactNode

    component?: React.ReactNode
    /** called when clicked on item */
    onClick?: (param: ClickParam) => void
    /** the text to display or react component to render*/
    label?: React.ReactNode
    /** not yet implemented */
    sublabel?: string
    /** mark as active item */
    active?: boolean
    /** state passed from the root Menu */
    ref?: string
}

export interface IMenuItemChildContext extends IMenuChildContext {
}

/**
 * MenuItem component
 */
@Hot(module)
@GUID()
@observer
export class MenuItem extends Component<MenuItemProps & CSSModules.InjectedCSSModuleProps> implements IMenuComponent {
    static displayName: string         = 'MenuItem'
    static defaultProps: MenuItemProps = {
        as       : 'li',
        active   : false,
        link     : false,
        style    : null,
        className: null
    }
           context: IMenuChildContext

    get store(): MenuStore { return this.context.store }

    get parent(): IMenuComponentTypes { return this.context.parent }

    getChildContext = (): IMenuItemChildContext => ({
        store : this.context.store,
        parent: this
    })

    static childContextTypes = {
        store : PropTypes.object.isRequired,
        parent: PropTypes.object.isRequired
    }
    static contextTypes      = {
        store : PropTypes.object.isRequired,
        parent: PropTypes.object.isRequired
    }

    render() {
        const children    = mapChildren(this)
        const ElementType = getElementType<MenuItemProps>(MenuItem, this.props)
        return (
            <ElementType className={this.getClassName()} onClick={this.onClick}>
                {this.renderContent()}
                {children}
            </ElementType>
        )

    }

    renderContent(){
        let { style,  className, icon, link, onClick, label, sublabel, active, ref,component, ...otherProps } = this.props

        let hasComponent = React.isValidElement(component);
        let Component;
        if(hasComponent){
            React.cloneElement(component as any, {...otherProps})
        }

        let content = (
            <Fragment>
                {icon ? <Icon name={icon}/> : null}

            </Fragment>
        )
    }




    renderContent2() {
        let { label, icon, sublabel, link, onClick } = this.props


        let content = (
            <Fragment>
                {icon ? <Icon name={icon}/> : null}
                {label ? <span>{label}</span> : null}
            </Fragment>
        )

        if ( link ) {
            link['props']['children'] = label;
            let content = (
                <Fragment>
                    {icon ? <Icon name={icon}/> : null}
                    {link}
                </Fragment>
            )

        }
        return content
    }


    getClassName() {
        const { active, link, style: _style, className } = this.props;
        let names                                        = [ 'menu-item', className ]
        if ( active ) names.push('is-active');
        if ( ! link ) names.push('menu-text');
        if ( style ) names.push(style(_style));
        return classes(...names)
    }


    onClick = (event: React.MouseEvent<any>, ...args) => {
        log('onClick', { event, item: this, args })
        if ( this.props.onClick ) {
            this.props.onClick({ event, item: this });
        } else {
            if ( this.store.getChildTypes(this).includes('SubMenu') ) {
                let subMenu = this.store.getChildByName<SubMenu>(this, 'SubMenu')
                subMenu.toggle();
            }

        }

    }

    // generateContent() {
    //     const { children, active, icon, label, style, className } = this.props;
    //     if (  ) {
    //         if ( React.isValidElement(children) ) {
    //             return 'When isText is enabled, you can not pass a React Element. Only text allowed.'
    //         }
    //         return children ? children : label
    //     }
    //     let Link  = (props) => (<a href="#" onClick={this.onClick}>{props.children}</a>)
    //     let _icon = icon ? <Icon name={icon}/> : null
    //     let _span = <span>{label}</span>
    //
    //     if ( this.store.iconSide === 'top' || this.store.iconSide === 'left' ) {
    //         return <Link>{_icon}{_span}</Link>
    //     }
    //     return <Link>{_span}{_icon}</Link>
    // }

    //
    // getChildren() {
    //     return React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
    //         if ( ! React.isValidElement(child) ) {
    //             return child; // just text...
    //         }
    //         return React.cloneElement(child as any, {
    //             menu  : this.menu,
    //             parent: this,
    //             store : this.store
    //         });
    //     })
    // }


    // render() {
    //     const { active, isText, style, className } = this.props;
    //     let names                                  = [ 'menu-item', className ]
    //     if ( active ) names.push('is-active');
    //     if ( isText ) names.push('menu-text');
    //     if ( style ) names.push(_style(style));
    //
    //
    //     const children    = prepareChildren(this, this.subMenuChild, {
    //         store : this.store,
    //         parent: this,
    //         onRef(ref) {
    //             return (ref)
    //         },
    //         menu  : this.props.menu,
    //         open  : false
    //     });
    //     const ElementType = getElementType<MenuItemProps>(MenuItem, this.props)
    //     return (
    //         <ElementType className={classes(...names)}>
    //             <MenuContext.Consumer children={this.setProvided}/>
    //             {this.generateContent()}
    //             {this.hasSubMenu ? children : null}
    //         </ElementType>
    //     )
    // }
    //
    // @observable hasSubMenu: boolean = false
    // @observable subMenuChild: ReactElement<SubMenuProps>
    //
    // @action setSubMenu(child) {
    //     this.hasSubMenu   = true;
    //     this.subMenuChild = child;
    // }
    //
    //
    // isRoot = false
    //
    // get menu(): Menu {return this.props.menu }
    //
    // @computed get store(): MenuStore {return this.props.store }
    //
    // get parent(): SubMenu | Menu {return this.props.parent }
    //
    // componentDidMount() {
    //     React.Children.forEach(this.props.children, (child: ReactElement<{}>) => {
    //         if ( child.type && child.type instanceof SubMenu.constructor ) {
    //             this.setSubMenu(child);
    //         }
    //     })
    //
    // }

}

export default MenuItem
