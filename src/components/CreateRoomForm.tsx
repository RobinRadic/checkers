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


const log = require('debug')('components:CreateRoomForm')

export interface CreateRoomFormProps {
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
export default class CreateRoomForm extends Component<CreateRoomFormProps & CSSModules.InjectedCSSModuleProps & Partial<FormComponentProps>> {
    @inject(Symbols.AuthStore) authStore: AuthStore
    @inject(Symbols.RouterStore) routerStore: RouterStore

    static displayName: string               = 'CreateRoomForm'
    static defaultProps: CreateRoomFormProps = {
        layout: 'vertical'
    }

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
                message.error(this.authStore.errors, 3)
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
                    label="Name"
                >
                    {getFieldDecorator('name', {
                        rules: [ { required: true, message: 'Please input the room name', whitespace: true } ]
                    })(
                        <Input placeholder="Room Name"/>
                    )}
                </Form.Item>
                <Form.Item >
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={this.authStore.inProgress}
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
