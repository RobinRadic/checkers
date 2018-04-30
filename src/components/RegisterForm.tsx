import React, { Component, FormEvent } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, form, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { Button, Form, Icon, Input, message, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { inject, Symbols } from '#/ioc';
import { AuthStore, RouterStore } from '#/stores';
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

export default class RegisterForm extends Component<RegisterFormProps & CSSModules.InjectedCSSModuleProps & Partial<FormComponentProps>> {
    @inject(Symbols.AuthStore) authStore: AuthStore
    @inject(Symbols.RouterStore) routerStore: RouterStore

    static displayName: string             = 'RegisterForm'
    static defaultProps: RegisterFormProps = {
        layout: 'vertical'
    }

    state = {
        confirmDirty      : false,
        autoCompleteResult: []
    };

    handleSubmit           = (e:FormEvent<any>) => {
        log('handleSubmit', { e })
        e.preventDefault();
        const form = this.props.form;


        this.authStore.setEmail(form.getFieldValue('email'))
        this.authStore.setPassword(form.getFieldValue('password'))
        this.authStore.setName(form.getFieldValue('name'))
        this.authStore.register()
            .then(() => {
                close();
                message.success('Registered', 1, () => {
                    this.routerStore.navigate('user.login')
                })
            })
            .catch((err) => {
                close();
                let msg = Object.keys(this.authStore.errors).map(key => this.authStore.errors[key].map((error,numError) => <li key={key + numError}>{error}</li>));
                message.error(<ul className={this.props.styles['register-form-message-error-list']}>{msg}</ul>, 3)
            })
    }
    handleConfirmBlur      = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || ! ! value });
    }
    compareToFirstPassword = (rule, value, callback) => {
        log('compareToFirstPassword', { rule, value, callback })

        const form = this.props.form;
        if ( value && value !== form.getFieldValue('password') ) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        log('validateToNextPassword', { rule, value, callback })

        const form = this.props.form;
        if ( value && this.state.confirmDirty ) {
            form.validateFields([ 'password_confirmation' ], { force: true } as any);
        }
        callback();
    }

    render() {
        const { layout }            = this.props;
        window[ 'form' ]            = this;
        const { getFieldDecorator } = this.props.form;

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
            <Form onSubmit={this.handleSubmit} className={this.getClassName()} layout={layout} >
                <Form.Item
                    {...formItemLayout}
                    label="Email"
                >
                    {getFieldDecorator('email', {
                        rules: [ {
                            type: 'email', message: 'The input is not valid Email!'
                        }, {
                            required: true, message: 'Please input your Email!'
                        } ]
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Password"
                >
                    {getFieldDecorator('password', {
                        rules: [ {
                            required: true, message: 'Please input your password!'
                        }, {
                            validator: this.validateToNextPassword
                        } ]
                    })(
                        <Input type="password"/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Confirm Password"
                >
                    {getFieldDecorator('password_confirmation', {
                        rules: [ {
                            required: true, message: 'Please confirm your password!'
                        }, {
                            validator: this.compareToFirstPassword
                        } ]
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={(
                        <span>
                            Name&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('name', {
                        rules: [ { required: true, message: 'Please input your name!', whitespace: true } ]
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={this.authStore.inProgress}
                    >Submit</Button>
                </Form.Item>
            </Form>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
