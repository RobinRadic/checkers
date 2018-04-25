import 'reflect-metadata';
import * as React from 'react';
import { Icon } from '@/Icon';
import * as storybook from '@storybook/react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { setDefaults, withInfo } from '@storybook/addon-info';
import { Viewport } from '@storybook/addon-viewport';
import { boolean, selectV2, text, withKnobs } from '@storybook/addon-knobs';
import { Loader } from '@/Loader';
import { SpinProps } from 'antd/es/spin';
import { IconProps } from 'antd/es/icon';
import { GlobalHeader } from '@/layout';
import { container, containerModule, Symbols } from 'ioc';

import { Layout, Menu } from 'antd';
import { DynamicMenu } from '@/DynamicMenu';
import { RootStore } from 'stores';
import { MenuItem } from 'api';
import { MenuProps } from 'antd/es/menu';

const { SubMenu }                        = Menu;
const { Header, Content, Sider, Footer } = Layout;

require('../src/.less/antd.less')

let link = document.createElement('link')
link.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
link.setAttribute('rel', 'stylesheet')
document.head.appendChild(link);
container.load(containerModule)
container.rebind(Symbols.ApiRequestConfig).toConstantValue({
    baseURL: '//codex.local/api/v1'
})
let store = container.get<RootStore>(Symbols.RootStore);
store.fetch().then(() => {
    store.setProject(store.projects.default, true)
});
setDefaults({ inline: true, propTables: false, header: false, source: false })
storybook.addDecorator(withKnobs)
storiesOf('Components/Icons', module)
    .add('Icon', withInfo(`
      Font awesome icon
    
    
    `)(() => {
        return (<div>
            <Icon name="cog"/>
        </div>)
    }))
storiesOf('Components/Loader', module)
    .addDecorator(centered)
    .add('Loader', withInfo(``)
    (() => {
        let spinProps: SpinProps          = {
            className: text('Spin Class', ''),
            spinning : boolean('Spinning', true),
            size     : selectV2('Size', { small: 'small', default: 'default', large: 'large' }, 'default'),
            tip      : text('Tip', '')


        }
        let iconProps: Partial<IconProps> = {
            className: text('Icon Class', ''),
            title    : text('Title', '')
        }
        return <div>
            <Loader
                loading={boolean('Loading', true)}
                spin={spinProps}
                icon={iconProps}
            >
                loaded!
            </Loader>
        </div>
    }))


storiesOf('Components/GlobalHeader', module)
    .add('Properties', withInfo(`
    The GlobalHeader component expects antd Layout.Header to be its parent`)(() => {
        return (
            <Layout>
                <Header style={{ padding: 0 }}>
                    <GlobalHeader

                        title={text('Title', 'Title')}
                        showLeftToggle={boolean('Show left toggle', true)}
                        showRightToggle={boolean('Show right toggle', true)}
                        leftToggled={boolean('Left toggled', false)}
                        rightToggled={boolean('Right toggled', true)}
                    >

                    </GlobalHeader>
                </Header>
            </Layout>
        )
    }))
    .add('Components/DynamicMenu', withInfo(`
    The GlobalHeader component expects antd Layout.Header to be its parent`)(() => {
        let collapsed         = boolean('Collapsed', false)
        let items: MenuItem[] = [
            {
                label: 'Menu Item',
                type : 'label'
            },
            {
                label   : 'Sub Menu',
                type    : 'sub-menu',
                children: [
                    {
                        label: 'Menu Item',
                        type : 'label'
                    }

                ]
            }
        ]
        let menu: MenuProps   = {
            mode : 'horizontal',
            style: { float: 'right', lineHeight: '64px' }
        }
        return (
            <Layout>
                <Header style={{ padding: 0 }}>
                    <GlobalHeader

                        title={text('Title', 'Title')}
                        showLeftToggle={boolean('Show left toggle', true)}
                        showRightToggle={boolean('Show right toggle', true)}
                        leftToggled={boolean('Left toggled', false)}
                        rightToggled={boolean('Right toggled', true)}
                    >
                        <DynamicMenu menu={menu} items={items}/>
                    </GlobalHeader>
                </Header>
            </Layout>
        )
    }))
