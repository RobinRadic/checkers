import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputSheet } from 'react-typestyle-preset';
import { StyleProps } from 'interfaces';
import { WithStyles } from 'decorators'
import { hot } from 'react-hot-loader';
import { Carousel, Col, Layout, Menu, Row } from 'antd';
import Fade from 'react-reveal/Fade';
import {hideAll} from 'react-reveal/globals';
import { HomeViewProps } from 'views/HomeView';
import { color as material } from '@radic/util'
import { classes, media, style } from 'typestyle';
import { color } from 'csx';

const log                                = require('debug')('components:home-content')
const { SubMenu, Item }                  = Menu;
const { Header, Content, Sider, Footer } = Layout;

log('Fade', {Fade})

const colors                = {
    primary: '#FF5722',
    darkBg : material('blue-grey', '800'),
    darkFg : material('blue-grey', '200'),
    lightBg: '#ffffff',
    lightFg: material('blue-grey', '700')
}
const fontFamilyHeader      = `'Raleway', "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const createSectionVariant  = (name, fg, bg) => {
    return {
        section            : style({ background: bg, color: fg }),
        sectionTitleDivider: style({ borderColor: fg }),
        sectionTitle       : style({ color: fg }),
        sectionDivider     : style({ borderTop: 'inset ' + fg }),
        featureHeading     : style({ color: fg }),
        featureImage       : style({ border: '1px solid ' + color(bg).lighten(10) })
    }

}
export const sectionVariant = {
    dark : createSectionVariant('dark', colors.darkFg, colors.darkBg),
    light: createSectionVariant('light', colors.lightFg, colors.lightBg)
}
export const HomeSection    = (props: { children?: any, title?: string, variant: 'dark' | 'light' }) => {
    let vstyles      = sectionVariant[ props.variant ];
    const styles     = {
        section            : style({ paddingTop: '4rem', paddingBottom: '4rem', $nest: { p: { fontFamily: fontFamilyHeader } } }),
        sectionTitle       : style({
            textAlign: 'center',
            $nest    : { '&::after': { content: '.', fontWeight: 'bold', color: colors.primary, marginLeft: 2 } }
        }),
        sectionTitleDivider: style({ width: 120, borderWidth: '1px', borderStyle: 'dashed' }),
        container          : style({ paddingTop: '4rem', paddingBottom: '4rem' })
    }
    const classNames = {
        section            : classes(styles.section, vstyles.section),
        sectionTitleDivider: classes(styles.sectionTitleDivider, vstyles.sectionTitleDivider),
        sectionTitle       : classes(styles.sectionTitle, vstyles.sectionTitle)
    }
    return (
        <Content className={classNames.section}>
            {props.title ? <header>
                <h2 className={classNames.sectionTitle}>{props.title}</h2>
                <hr className={classNames.sectionTitleDivider}/>
            </header> : null}
            {props.title ?
             <div className={styles.container}>
                 {props.children}
             </div> : props.children}
        </Content>
    );
}


interface HomeFeatureProps extends Partial<StyleProps> {
    img: string
    title: string
    duration?: number
    delay?: number
}

@observer
@WithStyles()
export class HomeFeature extends Component<HomeFeatureProps, {}> {
    static displayName                             = 'HomeFeature';
    static defaultProps: Partial<HomeFeatureProps> = {
        duration: 1500,
        delay   : 0
    }
    static styles: InputSheet<HomeViewProps>       = {
        root   : {},
        feature: { textAlign: 'center' },
        image  : { height: 140, width: 140 },
        heading: {
            marginTop    : 10,
            fontWeight   : 300,
            lineHeight   : 1,
            letterSpacing: '-.05rem'
        },
        lead   : {}
    }
    static inlineStyles: InputSheet<HomeViewProps> = (props) => ({
        contentGutter: { padding: 20 }
    })

    render() {
        const { classNames } = this.props
        return (
            <Col xs={20} sm={20} lg={5} offset={2}>
                <Fade bottom duration={this.props.duration} delay={this.props.delay} wait={1000}>
                    <div className={classNames.feature}>
                        <img className={classNames.image} src={'assets/img/home/features/' + this.props.img}/>
                        <h3 className={classNames.heading}>{this.props.title}</h3>
                        <p className={classNames.leading}>{this.props.children}</p>
                    </div>
                </Fade>
            </Col>
        );
    }
}


interface HomeContentProps extends Partial<StyleProps> {

}

interface HomeContentState {

}

@observer
@WithStyles()
export class HomeContent extends Component<HomeContentProps, HomeContentState> {
    static displayName                             = 'HomeContent';
    static styles: InputSheet<HomeViewProps>       = {
        layout        : { minHeight: '100vh' },
        header        : { padding: '0 20px', height: '65px' },
        headerMenu    : { float: 'right', lineHeight: '64px' },
        headerMenuIcon: { fontSize: '30px', margin: '15px 10px' },
        content       : { overflow: 'hidden', height: 'calc(100vh - 61px)' },
        carousel      : {
            height    : 'calc(100vh - 60px)',
            marginTop: '-1px',
            $nest    : {
                '.slick-slide': {
                    textAlign : 'center',
                    height    : 'calc(100vh - 60px)', // full height - header height
                    lineHeight: '160px',
                    background: '#364d79',
                    overflow  : 'hidden'
                }
            }
        },
        carouselImg   : { width: '100%', height: 'calc(100vh - 60px)' },
        awesome       : {
            textAlign: 'center',
            $nest    : {
                h2: { fontSize: '3rem', color: material('blue-grey', '200'), margin: '0 0 5p 0' }
            }
        },
        awesomeDivider: { height: 1, width: 200, margin: '10px auto', backgroundColor: material('blue-grey', '200'), fontFamily: fontFamilyHeader },
        featureRow    : media({ minWidth: 600 }, { marginTop: 100 })
    }
    static inlineStyles: InputSheet<HomeViewProps> = (props) => ({
        contentGutter: { padding: 20 },
        left         : { float: 'left' },
        right        : { float: 'right' }
    })



    render() {
        window['hideAll'] = hideAll;
        const year                   = (new Date()).getFullYear()
        const { classNames, styles } = this.props
        log('render', { classNames })
        return (
            <Layout>
                <Content className={classNames.content}>
                    <Carousel className={classNames.carousel} autoplay dots={true} infinite={true} arrows={true} swipe={true} speed={2000}>
                        <div><img src="assets/img/home/slides/slide-typewriter-2000.jpg" className={classNames.carouselImg}/></div>
                        <div><img src="assets/img/home/slides/slide-html-2000.png" className={classNames.carouselImg}/></div>
                    </Carousel>
                </Content>
                <HomeSection variant="dark">
                    <Fade delay={500}>
                        <div className={classNames.awesome}>
                            <h2>Open Source</h2>
                            <p>Codex is available on <a href='#'>GitHub</a> under the <a href='#'>MIT license</a></p>
                            <div className={classNames.awesomeDivider}/>
                        </div>
                    </Fade>
                </HomeSection>
                <HomeSection title="Features" variant="light">
                    <Row gutter={32} className={classNames.featureRow}>
                        <HomeFeature img="plugins.png" title="Plugins">
                            Using a plugin based approach, Codex can easily be extended. Check out <a>existing plugins</a> or <a>create something custom</a>
                        </HomeFeature>
                        <HomeFeature img="laravel.svg" title="Laravel" delay={150}>
                            Codex is a file-based documentation platform built on top of Laravel 5.5. Use it as stand-alone or integrate it into your own application!
                        </HomeFeature>
                        <HomeFeature img="responsive.png" title="Responsive" delay={300}>
                            Documentation should be readable on all devices. Reading documents in Codex on a mobile phone or tablet device is actually enjoyable.
                        </HomeFeature>
                    </Row>
                    <Row gutter={32} className={classNames.featureRow}>
                        <HomeFeature img="flexible.png" title="Flexible" delay={750}>
                            Use Markdown, AsciiDoc, Creole or any other lightweight markup language. Use custom parsers to add support for other LML's.
                        </HomeFeature>
                        <HomeFeature img="vuejs.png" title="Vue.js" delay={600}>
                            The front-end uses the Vue.js framework to deliver a Single Page Application that guarantees a smooth experience
                        </HomeFeature>
                        <HomeFeature img="fast.png" title="Fast" delay={450}>
                            53% of users will abandon a site if it takes longer than 3 seconds to load! And once loaded, users expect them to be fast—no janky scrolling or slow-to-respond interfaces.
                        </HomeFeature>
                    </Row>
                </HomeSection>
                <HomeSection title="Overview" variant="dark">
                    <p>Dark stuff yo</p>
                </HomeSection>
            </Layout>
        );
    }
}

export default hot(module)(HomeContent);