import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import RootNode from 'views/nodes/RootNode';
import { BreakpointStore } from 'stores';
import { Hot } from 'decorators';

const log = require('debug')('component:Layout')

interface Props {}

interface State {}

@Hot(module)
@observer
export default class RootView extends Component<Props, State> {
    static displayName = 'RootView'
    @inject(Symbols.BreakpointStore) store: BreakpointStore

    render() {
        return (
            <RootNode/>
        );
    }
}


