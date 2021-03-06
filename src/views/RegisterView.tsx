import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { Col, Layout, Row } from 'antd';
import RegisterForm from '@/RegisterForm';

const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('components:LoginView')

export interface LoginViewProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

/**
 * LoginView component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class RegisterView extends Component<LoginViewProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string          = 'LoginView'
    static defaultProps: LoginViewProps = {}


    render() {
        // const {} = this.props;


        return (
            <Layout className={this.getClassName()}>
                <Content styleName='content'>
                    <Row>
                        <Col xs={{ span: 20, offset: 1 }} md={{ span: 6, offset: 9 }}>
                            <RegisterForm />
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
