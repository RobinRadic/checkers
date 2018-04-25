import React, { Component } from 'react';
import { injectable } from 'inversify';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { InjectedProps } from 'react-typestyle-preset';
import { hot } from 'react-hot-loader';
import RootNode from 'views/nodes/RootNode';
import { BreakpointStore } from 'stores';

const log = require('debug')('component:Layout')

interface Props extends Partial<InjectedProps> {}

interface State {}

@observer
@injectable()
class RootView extends Component<Props, State> {
    static displayName = 'RootView'
    @inject(Symbols.BreakpointStore) store: BreakpointStore

    render() {
        return (
            <RootNode/>
        );
    }
}


export default hot(module)(RootView)
