import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Card, Col, Layout, Row, Select, Switch } from 'antd';
import styles from './dev.module.scss'
import { CSSModules, Hot } from 'decorators';
import { IconDirections, Menu, MenuItem, SubMenu } from '@/tmenu/Menu'
import TestMenuView from '@/tmenu/TestMenuView';
import { Link } from '#/router';
import { style } from 'typestyle';
import { observable, runInAction } from 'mobx';

const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')
const { Option }                         = Select

export interface DevViewProps extends React.CSSProperties {}

let icd = Menu.IconDirections
@Hot(module)
@CSSModules(styles)
@observer
export default class DevView extends Component<DevViewProps, {}> {
    static displayName = 'DevView';


    @observable vars = {
        vertical      : { options: [ true, false ], value: true },
        icons         : { options: [ true, false ], value: true },
        iconsDirection: { options: [ icd.TOP, icd.RIGHT, icd.BOTTOM, icd.LEFT ], value: icd.LEFT }

    }

    render() {

        function run(cb) {
            runInAction(() => {
                cb();
            })
        }

        let cp = {
            marginBottom: 5
        }
        return (
            <Layout styleName="layout">
                <Header>Header</Header>
                <Layout>
                    <Content>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <h1>HTML</h1>
                                <TestMenuView/>
                            </Col>
                            <Col span={18}>
                                <h1>COMPONENTS</h1>
                                <Menu
                                    vertical={this.vars.vertical.value}
                                    icons={this.vars.icons.value}
                                    iconsDirection={this.vars.icons.value ? this.vars.iconsDirection.value : null}
                                >
                                    <MenuItem icon="rocket">
                                        <Link routeName={''}>To home</Link>
                                    </MenuItem>
                                    <MenuItem icon="mars">To the Moon</MenuItem>
                                    <MenuItem icon="stethoscope">To the Moon</MenuItem>
                                    <MenuItem icon="chevron-down" >
                                        To the Moon
                                        <SubMenu>
                                            <MenuItem icon="rocket"> <Link routeName={''}>To home</Link> </MenuItem>
                                            <MenuItem icon="mars">To the Moon</MenuItem>
                                            <MenuItem icon="stethoscope">To the Moon</MenuItem>
                                            <MenuItem icon="code-fork">To the Moon</MenuItem>
                                            <MenuItem icon="chevron-down" >
                                                To the Moon
                                                <SubMenu>
                                                    <MenuItem icon="rocket"> <Link routeName={''}>To home</Link> </MenuItem>
                                                    <MenuItem icon="mars">To the Moon</MenuItem>
                                                    <MenuItem icon="stethoscope">To the Moon</MenuItem>
                                                    <MenuItem icon="code-fork">To the Moon</MenuItem>
                                                    <MenuItem icon="chevron-down">
                                                        To the Moon
                                                        <SubMenu>
                                                            <MenuItem icon="rocket"> <Link routeName={''}>To home</Link> </MenuItem>
                                                            <MenuItem icon="mars">To the Moon</MenuItem>
                                                            <MenuItem icon="stethoscope">To the Moon</MenuItem>
                                                            <MenuItem icon="code-fork">To the Moon</MenuItem>
                                                            <MenuItem icon="home">To the Moon</MenuItem>
                                                        </SubMenu>
                                                    </MenuItem>
                                                </SubMenu>
                                            </MenuItem>
                                        </SubMenu>
                                    </MenuItem>
                                    <MenuItem icon="code-fork">To the Moon</MenuItem>
                                    <MenuItem icon="home">To the Moon</MenuItem>
                                    <MenuItem icon="soundcloud">To the Moon</MenuItem>
                                </Menu>
                            </Col>
                        </Row>


                        <Row type="flex" justify="start" className={style({ borderTop: '1px solid grey', marginTop: 20 })}>
                            <Col span={18} offset={6}>
                                <h1>CP</h1>
                                <Card>
                                    <Row gutter={12} type="flex" justify="start" className={style({ marginBottom: cp.marginBottom })}>
                                        <Col span={12}>Menu Direction</Col>
                                        <Col span={12}>
                                            <Switch
                                                checkedChildren="vertical"
                                                unCheckedChildren="horizontal"
                                                defaultChecked={this.vars.vertical.value}
                                                onChange={(checked) => run(() => this.vars.vertical.value = checked)}/>
                                        </Col>
                                    </Row>

                                    <Row gutter={12} type="flex" justify="start" className={style({ marginBottom: cp.marginBottom })}>
                                        <Col span={12}>Icons</Col>
                                        <Col span={12}><Switch
                                            checkedChildren="enabled"
                                            unCheckedChildren="disabled"
                                            defaultChecked={this.vars.vertical.value} onChange={(checked) => run(() => this.vars.icons.value = checked)}/></Col>
                                    </Row>

                                    <Row gutter={12} type="flex" justify="start" className={style({ marginBottom: cp.marginBottom })}>
                                        <Col span={12}>Icons Directions</Col>
                                        <Col span={12}>
                                            <Select defaultValue={this.vars.iconsDirection.value} onChange={(value: IconDirections) => run(() => this.vars.iconsDirection.value = value)}>
                                                {this.vars.iconsDirection.options.map(dir => <Option key={dir} value={dir}>{dir}</Option>)}
                                            </Select>
                                        </Col>

                                    </Row>

                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>

        );
    }
}
