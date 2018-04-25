import * as React from 'react';
import { Icon, Spin } from 'antd';
import { SpinProps } from 'antd/es/spin';
import { IconProps } from 'antd/es/icon';
import { WithStyles } from 'decorators';
import { StyleProps } from 'interfaces';
import { InputSheet } from 'react-typestyle-preset';

const { Fragment } = React;
const antIcon      = <Icon type="loading" style={{ fontSize: 24 }} spin/>;

export interface LoaderProps extends StyleProps {
    loading: boolean
    spin?: Partial<SpinProps>
    icon?: Partial<IconProps>
    centered?: boolean
    component?: any
}

@WithStyles()
export class Loader extends React.Component<LoaderProps, {}> {
    static displayName = 'Loader'
    static styles: InputSheet<LoaderProps> = {
        centered: {
            position      : 'fixed',
            top           : 0,
            left          : 0,
            bottom        : 0,
            right         : 0,
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            overflow      : 'auto'
        },
        inner   : {
            margin: 'auto'
        }
    }
    static inlineStyles                    = {}

    renderCentered() {
        const { classNames } = this.props
        return (
            <div className={classNames.centered}>
                <div className={classNames.inner}>
                    {this.renderLoader()}
                </div>
            </div>
        )
    }

    renderLoader() {
        let spin: SpinProps = {
            indicator: this.renderIcon(),
            ...this.props.spin || {}
        }
        return (<Spin {...spin}/>)
    }

    renderIcon() {
        let icon: IconProps = {
            type : 'loading',
            style: { fontSize: 24 },
            spin : true,
            ...this.props.icon || {}
        }
        return (<Icon {...icon} />)
    }

    renderComponent() {
        const { component, children } = this.props
        return (<Fragment>{component ? component : children}</Fragment>)
    }

    render() {
        const { loading } = this.props
        return loading ? this.renderLoader() : this.renderComponent()
    }
}
