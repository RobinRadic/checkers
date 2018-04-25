import React, { Component } from 'react';
import { inject, Symbols } from 'ioc';
import { DocumentStore, LayoutStore, RootStore, RouterStore } from 'stores';
import { observer } from 'mobx-react';
import { InputSheet } from 'react-typestyle-preset';
import { classes } from 'typestyle';
import { StyleProps } from 'interfaces';
import { WithStyles } from 'decorators'
import { hot } from 'react-hot-loader';
import { Affix, BackTop, Icon, Layout, Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';
import { GlobalFooter, GlobalHeader, GlobalSide } from '@/layout';
import { DynamicMenu } from '@/DynamicMenu';
import { Loader } from '@/Loader';
import { Document, Project, Revision } from 'api';


const { SubMenu, Item }                  = Menu;
const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:document')

export interface DocumentViewProps extends StyleProps {}

interface State {
    project?: Project
    revision?: Revision
    document?: Document
    loading: boolean
}

@WithStyles()
@observer
export class DocumentView extends Component<DocumentViewProps, State> {
    @inject(Symbols.RootStore) protected store: RootStore
    @inject(Symbols.LayoutStore) protected layout: LayoutStore
    @inject(Symbols.RouterStore) protected routerStore: RouterStore
    @inject(Symbols.DocumentStore) protected document: DocumentStore
    static displayName                                 = 'DocumentView';
    static styles: InputSheet<DocumentViewProps>       = {
        layout : { minHeight: '100vh' },
        content: { background: '#fff', padding: 24, margin: 0, minHeight: 280 }
    }
    static inlineStyles: InputSheet<DocumentViewProps> = (props) => ({
        contentGutter: { padding: 20 },
        left         : { float: 'left' },
        right        : { float: 'right' }
    })

    state = {
        document: null,
        loading : true
    }

    onSideCollapse = (side: 'left' | 'right') => (collapsed) => log('onSideCollapse', { side, collapsed })
    toggleSide     = (side: 'left' | 'right') => () => this.layout[ side ].set('collapsed', ! this.layout[ side ].collapsed)

    async load(): Promise<any> {
        const { route }  = this.routerStore
        const { params } = route
        this.setState({ loading: true });
        log('load', { route, props: this.props, me: this })
        // this.document.set(project, revision, document);
        let project  = await this.store.setProject(params.project)
        let revision = await this.store.setRevision(params.revision)
        let document = await this.store.setDocument(params.document, true)
        this.setState({ project, revision, document, loading: false });
        log('loaded', { route, props: this.props, me: this })
    }

    componentWillMount() {
        log('componentWillMount');
        this.load()
    }

    componentWillReceiveProps() {
        log('componentWillRecProp');
        this.load()
    }

    render() {
        const { classNames, styles } = this.props
        const headerMenu: MenuProps  = {
            theme: 'dark',
            mode : 'horizontal',
            style: { float: 'right', lineHeight: '64px' }
        }
        const year                   = (new Date()).getFullYear()
        log('render', { me: this })
        return (
            <Layout className={classNames.layout}>
                <Affix>
                    <Header className={classes(this.layout.header.classes)}>

                        <GlobalHeader
                            title={this.layout.header.title}
                            showLeftToggle={this.layout.left.show}
                            leftToggled={this.layout.left.collapsed}
                            onLeftToggleClick={this.toggleSide('left')}
                        >
                            {this.layout.header.show && this.layout.header.menu.length ?
                             <DynamicMenu menu={headerMenu} items={this.layout.header.menu} selectBehaviour="single" name="header"/> :
                             <Loader loading={true}/>}
                        </GlobalHeader>

                    </Header>
                </Affix>
                <Layout style={styles.contentGutter}>
                    <Layout>
                        <GlobalSide side="left" onCollapse={this.onSideCollapse('left')} sideBorder={true}/>
                        <Content className={classes(this.layout.page.classes, classNames.content)}>
                            {this.state && this.state.document && ! this.state.loading ? <div dangerouslySetInnerHTML={{ __html: this.state.document.content }}/> : <Loader loading={true}/>}
                        </Content>
                        <GlobalSide side="right" onCollapse={this.onSideCollapse('right')} sideBorder={true} itemRenderType="side-multi"/>
                    </Layout>
                </Layout>
                <Footer>
                    <GlobalFooter>Copyright <Icon type="copyright"/> {year} {this.layout.header.title}</GlobalFooter>
                </Footer>
                <BackTop/>
            </Layout>
        );
    }
}

export default hot(module)(DocumentView);
