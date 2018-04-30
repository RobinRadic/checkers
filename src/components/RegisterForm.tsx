import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, form, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { Button, Form, Icon, Input, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { inject, Symbols } from '#/ioc';
import { AuthStore } from '#/stores';


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

    static displayName: string             = 'RegisterForm'
    static defaultProps: RegisterFormProps = {
        layout: 'vertical'
    }

    state = {
        confirmDirty      : false,
        autoCompleteResult: []
    };

    handleSubmit           = (e) => {
        log('handleSubmit', { e })
        const form = this.props.form;

        this.authStore.setEmail(form.getFieldValue('email'))
        this.authStore.setPassword(form.getFieldValue('password'))
        this.authStore.setUsername(form.getFieldValue('username'))
        this.authStore.register()
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
            form.validateFields([ 'confirm' ], { force: true } as any);
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
                    label="E-mail"
                >
                    {getFieldDecorator('email', {
                        rules: [ {
                            type: 'email', message: 'The input is not valid E-mail!'
                        }, {
                            required: true, message: 'Please input your E-mail!'
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
                    {getFieldDecorator('confirm', {
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
                            Nickname&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('nickname', {
                        rules: [ { required: true, message: 'Please input your nickname!', whitespace: true } ]
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary">Submit</Button>
                </Form.Item>
            </Form>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
