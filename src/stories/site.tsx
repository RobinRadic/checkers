import 'reflect-metadata';
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Viewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs';
import { classes, style } from 'typestyle';
import { Affix, BackTop, Icon, Layout, Menu } from 'antd';
import { GlobalFooter, GlobalHeader, GlobalSide } from '@/layout';
import { DynamicMenu } from '@/DynamicMenu';
import { Loader } from '@/Loader';
import { MenuProps } from 'antd/es/menu';
import { container, Symbols } from 'ioc';
import { LayoutStore, RootStore } from 'stores';


const { SubMenu, Item }                  = Menu;
const { Header, Content, Sider, Footer } = Layout;

storiesOf('Application/Layout', module)
    .addDecorator(centered)
    .addDecorator(withKnobs)
    .add('Welcome Page', withInfo(`The /index welcome page`)(() => {

        const layout: LayoutStore   = container.get(Symbols.LayoutStore);
        const store: RootStore       = container.get(Symbols.RootStore);

        async function loaderSTuff() {
            return store.setProject('codex', true)
        }

        const headerMenu: MenuProps = {
            theme: 'dark',
            mode : 'horizontal',
            style: { float: 'right', lineHeight: '64px' }
        }
        let classNames              = {
            layout : style({ minHeight: '100vh' }),
            content: style({ background: '#fff', padding: 24, margin: 0, minHeight: 280 })
        }
        const year                  = (new Date()).getFullYear()
        const state                 = {
            loading : true,
            document: null
        }
        loaderSTuff().then(() => {
            state.loading  = false;
            state.document = store.document
        })
        return (
            <Layout className={style({ minHeight: '100vh' })}>
                <Affix>
                    <Header className={classes(layout.header.classes)}>

                        <GlobalHeader
                            title={layout.header.title}
                            showLeftToggle={layout.left.show}
                            leftToggled={layout.left.collapsed}
                            //onLeftToggleClick={this.toggleSide('left')}
                        >
                            {layout.header.show && layout.header.menu.length ?
                             <DynamicMenu menu={headerMenu} items={layout.header.menu} selectBehaviour="single" name="header"/> :
                             <Loader loading={true}/>}
                        </GlobalHeader>

                    </Header>
                </Affix>
                <Layout style={{ padding: 20 }}>
                    <Layout>
                        <GlobalSide side="left" sideBorder={true}/>
                        <Content className={classes(layout.page.classes, classNames.content)}>
                            {state && state.document && ! state.loading ? <div dangerouslySetInnerHTML={{ __html: state.document.content }}/> : <Loader loading={true}/>}
                        </Content>
                        <GlobalSide side="right" sideBorder={true} itemRenderType="side-multi"/>
                    </Layout>
                </Layout>
                <Footer>
                    <GlobalFooter>Copyright <Icon type="copyright"/> {year} {layout.header.title}</GlobalFooter>
                </Footer>
                <BackTop/>
            </Layout>
        )
    }))
