import React, { Component, ComponentClass, PureComponent } from 'react';
import { Icon, Spin } from 'antd';
import { SpinProps } from 'antd/es/spin';
import { IconProps } from 'antd/es/icon';


// https://scotch.io/tutorials/lazy-loading-routes-in-react

interface Props {
    className?: string
    style?: React.CSSProperties;
    spinner?: SpinProps
    icon?: Partial<IconProps>
}

export function createAsyncComponent(getComponent: () => Promise<any>, injectProps: Partial<Props> = {}): ComponentClass<Props> {
    return class AsyncComponent extends Component<Props> {
        static defaultProps: Partial<Props> = injectProps;
        static Component                    = null;
               state                        = { Component: AsyncComponent.Component };

        componentWillMount() {
            if ( ! this.state.Component ) {
                getComponent().then(Component => {
                    AsyncComponent.Component = Component
                    // this.setState({ Component })
                })
            }
        }

        render() {
            // const { Component } = this.state
            const Component = AsyncComponent.Component;
            if ( Component ) {
                return <Component className={this.props.className} style={this.props.style}/>
            }
            const antIcon = <Icon {...this.props.icon} type="loading" spin/>;
            return <Spin {...this.props.spinner} indicator={antIcon}/>
        }
    }

}


const AsyncComponent = createAsyncComponent(() => import('./GlobalHeader'))
