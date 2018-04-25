import React, { Component } from 'react';
import { injectable } from 'inversify';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { RootStore } from 'stores';
import { InjectedProps, InputSheet } from 'react-typestyle-preset';
import { Col, Menu, Row } from 'antd'
import { Icon } from './Icon'
import { Link } from 'index.tsx';

const { Item } = Menu;

const log = require('debug')('component:HeaderMenuItem')

interface Props {
    id: string,
    label: string,
    sublabel?: string,
    icon?: string,
    link?: string,
    params?: any
}

interface State {}

@observer
@injectable()
export class HeaderMenuItem extends Component<Props & InjectedProps, State> {
    @inject(Symbols.BreakpointStore) store: RootStore
    // classNames
    static styles: InputSheet<Props>       = {
        item    : { height: 'auto !important', lineHeight: '50px', $nest: { '&:hover': { backgroundColor: 'cadetblue' } } },
        iconCol : { width: '50px' },
        icon    : { fontSize: '30px', margin: '18px auto 0' },
        labelCol: { whiteSpace: 'normal', width: 'calc(100% - 50px)' },
        label   : { fontWeight: 'bold', padding: 0, height: '50%' },
        sublabel: { fontSize: 10, lineHeight: '15px' }
    }
    // styles
    static inlineStyles: InputSheet<Props> = (props) => ({
        left : { float: 'left' },
        right: { float: 'right' }
    })

    render() {
        const { classNames, styles }                      = this.props
        const { icon, sublabel, label, link, params, id } = this.props
        return (

            <Item key={id} className={classNames.item}>
                {link ? <Link routeName={link} routeParams={params}>{this.renderRow()}</Link> : this.renderRow()}
            </Item>
        );
    }

    renderRow() {
        const { classNames }                              = this.props
        const { icon, sublabel, label, link, params, id } = this.props
        return (
            <Row type="flex" justify="start">
                <Col order={1} className={classNames.iconCol}>{icon ? <Icon name={icon} className={classNames.icon} classNames={{ icon: '' }}/> : null}</Col>
                <Col order={2} className={classNames.labelCol}>
                    <Row className={classNames.label}>{label}</Row>
                    {/*<span className={cls.labelSpan}>*/}
                    {sublabel ? <Row className={classNames.sublabel}>{sublabel}</Row> : null}
                </Col>
            </Row>
        )
    }
}

