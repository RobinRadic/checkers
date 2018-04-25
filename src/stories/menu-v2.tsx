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
// import {Menu,Item,SubMenu} from '@/menu';

const log = require('debug')('storybook:menuv2')

storiesOf('MenuV2/General', module)
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
                                collapsed={boolean('Collapsed', false)}
                                as={text('HTML Element', 'ul')}
                                className={text('ClassName', '')}
                                childIconSide={selectV2('Child Icon Side', [ 'top', 'right', 'bottom', 'left' ], 'left')}
                            >
                                <Item label={'First'} icon={'cog'} />
                                <Item label={'Second'} icon={'puzzle-piece'} />
                                <Item label={'Third'} icon={'rocket'} />
                                <Item label={'Fourth'} icon={'file'} />
                                <Item label={'Fifth'} icon={'tablet'} />
                                <Item label={'Sixth'} icon={'git'} />
                                <Item label={'Seventh'} icon={'amazon'} />
                            </Menu>
                        </div>
                    </div>
                </div>
            </AppContainer>
        )


        window[ 'getStorybook' ] = getStorybook;


        return component()

    }))
