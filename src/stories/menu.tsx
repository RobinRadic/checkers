import 'reflect-metadata';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getStorybook, storiesOf } from '@storybook/react';
import { Viewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { boolean, selectV2, text, withKnobs } from '@storybook/addon-knobs';
import { AppContainer } from 'react-hot-loader';
import SubMenu from '@/menu/SubMenu';
import Menu from '@/menu/Menu';
import MenuItem from '@/menu/MenuItem';
import { Link } from 'router';
import { container, containerModule, Symbols } from 'ioc';
import { RootStore } from 'stores';


window[ 'React' ]    = React;
window[ 'ReactDOM' ] = ReactDOM;
//
// const log = require('debug')('storybook:menu')
//
container.load(containerModule);
let store: RootStore = container.get(Symbols.RootStore);
// let menus: MenuManager = container.get(Symbols.MenuManager);
//
// runInAction(() => {
//     const { fetched, available, app, projects, layout } = require('../../build/mocks/api.v1.json')
//     store.config                                        = app;
//     store.projects                                      = projects;
//     store.project                                       = require('../../build/mocks/projects.codex.json')
//     store.revision                                      = require('../../build/mocks/projects.codex.revisions.master.json')
//     store.document                                      = require('../../build/mocks/projects.codex.revisions.master.documents.index.json')
//     store.layout.set(store.document.layout)
// })
//
// let menu = menus.createController(null);
// // menu.init(store.layout.left.menu);

storiesOf('Menu/General', module)
    .addDecorator(withKnobs)
    // .addDecorator(centered)
    .add('Menu', withInfo('')(() => {

        const component = () => (
            <AppContainer>
                <div className="grid-container">
                    <div className="grid-x grid-padding-x align-middle">
                        <div className="cell">
                            <Menu
                                direction={selectV2('Direction', { horizontal: 'horizontal', vertical: 'vertical' }, 'horizontal')}
                                collapsible={boolean('Collapsible', false)}
                                dropdown={boolean('Dropdown (horizontal)', false)}
                                collapsed={boolean('Collapsed', false)}
                                as={text('HTML Element', 'ul')}
                                className={text('ClassName', '')}
                                childIconSide={selectV2('Child Icon Side', [ 'top', 'right', 'bottom', 'left' ], 'left')}
                            >

                                <MenuItem key="1" icon="rocket" label="The first link" component={<Link routeName={''} />} />
                                <MenuItem key="2" icon="cog" label={'Second'} onClick={action('onClick Second MenuItem')}/>
                                <MenuItem key="3" icon="puzzle-piece" active={true} label={'Third'} onClick={action('onClick Third MenuItem')}/>
                                <MenuItem key="4" icon="angle-down" label={'More Options Here'}>
                                    <SubMenu hmode="dropdown" vmode="nested">
                                        <MenuItem key="1" icon="rocket" label={'First'} onClick={action('onClick First MenuItem')}/>
                                        <MenuItem key="2" icon="cog" label={'Second'} onClick={action('onClick Second MenuItem')}/>
                                        <MenuItem key="3" icon="puzzle-piece" label={'Third'} onClick={action('onClick Third MenuItem')}/>
                                        <MenuItem key="4" icon="angle-down" label={'More Options Here'}>
                                            <SubMenu>
                                                <MenuItem key="1" icon="rocket" label={'First'} onClick={action('onClick First MenuItem')}/>
                                                <MenuItem key="2" icon="cog" label={'Second'} onClick={action('onClick Second MenuItem')}/>
                                                <MenuItem key="3" icon="puzzle-piece" label={'Third'} onClick={action('onClick Third MenuItem')}/>
                                            </SubMenu>
                                        </MenuItem>
                                    </SubMenu>
                                </MenuItem>
                                <MenuItem key="6" icon="cog" label={'Sixth'} onClick={action('onClick 6 MenuItem')}/>
                                <MenuItem key="7" icon="angle-down" label={'Tenth'}>
                                    <SubMenu hmode="dropdown" vmode="nested">
                                        <MenuItem key="1" icon="rocket" label={'First'} onClick={action('onClick First MenuItem')}/>
                                        <MenuItem key="2" icon="cog" label={'Second'} onClick={action('onClick Second MenuItem')}/>
                                        <MenuItem key="3" icon="puzzle-piece" label={'Third'} onClick={action('onClick Third MenuItem')}/>
                                        <MenuItem key="4" icon="angle-down" label={'More Options Here'}/>
                                    </SubMenu>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </AppContainer>
        )


        // document.getElementById('storybook-preview-iframe').contentWindow
        //document.getElementById('root')
        window[ 'getStorybook' ] = getStorybook;


        return component()

    }))

//
// const renderItem = (item: IMenuItem) => {
//
//     switch ( item.type ) {
//         case 'header':
//             return (<MenuItem key={item._id} icon={item.icon as any} >{item.label}</MenuItem>)
//         case 'divider':
//             return (<MenuItem key={item._id} icon={item.icon as any} >{item.label}</MenuItem>)
//         case 'label':
//             return (<MenuItem key={item._id} icon={item.icon as any} >{item.label}</MenuItem>)
//         case 'custom':
//             return (<MenuItem key={item._id} icon={item.icon as any} >{item.label}</MenuItem>)
//         case 'router-link':
//             return (<MenuItem key={item._id} icon={item.icon as any} >{item.label}</MenuItem>)
//         case 'link':
//             return (<MenuItem key={item._id} icon={item.icon as any} >{item.label}</MenuItem>)
//         case 'sub-menu':
//             return (
//                 <MenuItem key={item._id} icon={item.icon as any} >
//                     {item.label}
//                     <SubMenu show={item.expand}>{item.children.map(child => renderItem(child))}</SubMenu>
//                 </MenuItem>
//             )
//         case 'side-menu':
//             return (<MenuItem icon={item.icon as any} >{item.label}</MenuItem>)
//
//     }
// }
//
// const menuContainer:types.CSSProperties = {
//     height: 60
// }
