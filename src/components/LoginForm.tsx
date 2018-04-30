import React, { Component, FormEvent, FormEventHandler } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, form, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import {message, Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { inject, Symbols } from '#/ioc';
import { AuthStore, RouterStore } from '#/stores';
import { Link } from '#/router';
import config from '../config';


const log = require('debug')('components:RegisterForm')

export interface RegisterFormProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;

    layout?: 'horizontal' | 'vertical'
}

/**
 * RegisterForm component
 */
@Hot(module)
@form(Form)
@CSSModules(styles)
@observer
export default class LoginForm extends Component<RegisterFormProps & CSSModules.InjectedCSSModuleProps & Partial<FormComponentProps>> {
    @inject(Symbols.AuthStore) authStore: AuthStore
    @inject(Symbols.RouterStore) routerStore: RouterStore

    static displayName: string             = 'LoginForm'
    static defaultProps: RegisterFormProps = {
        layout: 'vertical'
    }

    state = {
        confirmDirty      : false,
        autoCompleteResult: []
    };

    handleSubmit = (e:FormEvent<any>) => {
        e.preventDefault();
        log('handleSubmit', { e })
        const form = this.props.form;

        this.authStore.setEmail(form.getFieldValue('email'))
        this.authStore.setPassword(form.getFieldValue('password'))
        log('handleSubmit', { authStore: this.authStore })
        const close = message.loading('Authenticating...')
        this.authStore
            .login()
            .then(() => {
                close();
                message.success('Authenticated', 1, () => {
                    this.routerStore.navigate(config.auth.loginRedirect)
                })
            })
            .catch((err) => {
                close();
                message.error(err.toString(), 3000)
            })
    }

    render() {
        const { layout }            = this.props;
        window[ 'form' ]            = this;
        const { getFieldDecorator } = this.props.form;
        const validateStatus = this.authStore.inProgress ? 'validating':null

        const formItemLayout = layout === 'horizontal' ? {
            labelCol  : {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        } : null;

        return (
            <Form onSubmit={this.handleSubmit} className={this.getClassName()} layout={layout}>
                <Form.Item
                    {...formItemLayout}
                    label="Email"
                    validateStatus={validateStatus}
                >
                    {getFieldDecorator('email', {
                        rules: [ { required: true, message: 'Please input your email address' } ]
                    })(
                        <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="Email"/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Password"
                    validateStatus={validateStatus}
                >
                    {getFieldDecorator('password', {
                        rules: [ { required: true, message: 'Please input your password' } ]
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>} type="password" placeholder="Password"/>
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue : true
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <Link className={this.props.styles[ 'login-form-forgot' ]} routeName="user.forgot">Forgot password</Link>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={this.props.styles[ 'login-form-button' ]}
                        disabled={this.authStore.inProgress}
                    >
                        Log in
                    </Button>
                    Or <Link routeName="user.register">Register now!</Link>
                </Form.Item>
            </Form>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
