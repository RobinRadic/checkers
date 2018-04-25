import React, { Component } from 'react';
import { Icon, Spin } from 'antd';
import { LoadingComponentProps } from 'react-loadable'

const log = require('debug')('component:Loading')

interface Props {}

interface State {}

export class Loading extends Component<Props & LoadingComponentProps, State> {
    render() {
        const { error, pastDelay, timedOut } = this.props
        if ( error ) {
            return <div>Error!</div>;
        } else if ( timedOut ) {
            return <div>Taking a long time...</div>;
        } else if ( pastDelay ) {
            return <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}/>;
        } else {
            return null;
        }
    }
}
