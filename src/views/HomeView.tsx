import React, { Component } from 'react';
import { inject, Symbols } from 'ioc';
import { LayoutStore } from 'stores';
import { observer } from 'mobx-react';
import { InputSheet } from 'react-typestyle-preset';
import { StyleProps } from 'interfaces';
import { WithStyles } from 'decorators'
import { hot } from 'react-hot-loader';
import { GlobalHeader } from '@/layout/GlobalHeader';
import { GlobalFooter } from '@/layout/GlobalFooter';
import { Affix, Col, Layout, Menu, Row } from 'antd';
import { Icon } from '@/Icon';
import { classes, style } from 'typestyle';
import HomeContent from '@/HomeContent';
import { Link } from 'router';


const { SubMenu, Item }                  = Menu;
const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')


export interface HomeViewProps extends StyleProps {}

const HMenuItem = (props: { id: string, label: string, sublabel?: string, icon?: string, link?: string, params?: any }, className?: any) => {
    let cls   = {
        item    : style({ height: 'auto !important', lineHeight: '50px', $nest: { '&:hover': { backgroundColor: 'cadetblue' } } }),
        iconCol : style({ width: '50px' }),
        icon    : style({ fontSize: '30px', margin: '18px auto 0' }),
        labelCol: style({ whiteSpace: 'normal', width: 'calc(100% - 50px)' }),
        label   : style({ fontWeight: 'bold', padding: 0, height: '50%' }),
        sublabel: style({ fontSize: 10, lineHeight: '15px' })
    }
    const row = (
        <Row type="flex" justify="start">
            <Col order={1} className={cls.iconCol}>{props.icon ? <Icon name={props.icon} className={cls.icon} /> : null}</Col>
            <Col order={2} className={cls.labelCol}>
                <Row className={cls.label}>{props.label}</Row>
                {/*<span className={cls.labelSpan}>*/}
                {props.sublabel ? <Row className={cls.sublabel}>{props.sublabel}</Row> : null}
            </Col>
        </Row>
    )
    return (
        <Item key={props.id} className={classes(className, cls.item)}>
            {props.link ? <Link routeName={props.link} routeParams={props.params}>{row}</Link> : row}
        </Item>
    )
}

@observer
@WithStyles()
export class HomeView extends Component<HomeViewProps, {}> {
    @inject(Symbols.LayoutStore)
    protected layout: LayoutStore

    static displayName                       = 'HomeView';
    static styles: InputSheet<HomeViewProps> = {
        layout        : { minHeight: '100vh' },
        header        : { padding: '0 20px', height: '65px' },
        headerMenu    : { float: 'right', lineHeight: '64px' },
        headerMenuIcon: { fontSize: '30px', margin: '15px 10px' },
    }

    static inlineStyles: InputSheet<HomeViewProps> = (props) => ({
        contentGutter: { padding: 20 },
        left         : { float: 'left' },
        right        : { float: 'right' }
    })


    render() {
        const year                   = (new Date()).getFullYear()
        const { classNames, styles } = this.props
        log('render', { classNames })
        return (
            <Layout className={classNames.layout}>

                <Affix>
                    <Header className={classNames.header}>
                        <GlobalHeader title="Welcome">
                            <Menu mode="horizontal" theme="dark" className={classNames.headerMenu}>
                                {HMenuItem({ id: 'documentation.document', label: 'Demonstration', sublabel: 'View the live demo!', icon: 'desktop' })}
                                {HMenuItem({ id: 'documentation', label: 'Documentation', sublabel: 'Read the documentation', icon: 'book', link: 'documentation' })}
                            </Menu>
                        </GlobalHeader>
                    </Header>
                </Affix>
                <HomeContent/>
                <Footer>
                    <GlobalFooter>Copyright <Icon name="copyright"/> {year} {this.layout.header.title}</GlobalFooter>
                </Footer>
            </Layout>
        );
    }
}

export default hot(module)(HomeView);
