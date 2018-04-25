import 'reflect-metadata';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getStorybook, storiesOf } from '@storybook/react';
import { Viewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { boolean, selectV2, text, withKnobs } from '@storybook/addon-knobs';
import { container, containerModule, Symbols } from 'ioc';
import { RootStore } from 'stores';
import { MenuManager } from 'utils/MenuManager';
import { runInAction } from 'mobx';
import { AppContainer } from 'react-hot-loader';
// import SubMenu from '@/menu/SubMenu';
// import Menu from '@/menu/Menu';
// import MenuItem from '@/menu/MenuItem';


storiesOf('Try', module)
    .addDecorator(withKnobs)
    // .addDecorator(centered)
    .add('First', withInfo('Just trying')(() => {


        interface MenuProps {

        }
        class Menu extends React.Component<MenuProps> {
            menuRef = React.createRef();
            constructor(props:MenuProps, context?:any){
                super(props, context)
            }
            render(){
                return this.props.children
            }
        }

        interface MenuItemProps {
        }
        class MenuItem extends React.Component<MenuItemProps> {
            menuItemRef = React.createRef();
            constructor(props:MenuItemProps, context?:any){
                super(props, context)
            }
            render(){
                return(
                    <li>{this.props.children}</li>
                )
            }
        }



        return (
            <Menu>
                <MenuItem>
                    asdf
                </MenuItem>
            </Menu>
        )

    }))
