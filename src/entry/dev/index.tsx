import 'reflect-metadata'
/// @todo mobx problem workaround
// should now be included as entry < TEST THIS
// To overcome the problem of Array.isArray(observable([])) not returning true I used a dirty workaround.
// Basically I overwrite Array.isArray native function to include observableArrays detection.
// Array[ 'isArrayNative' ] = Array.isArray;
// Array[ 'isArray' ]       = function isArray(arg: any[]): arg is any[] {
//     return Array[ 'isArrayNative' ](arg) || require('mobx').isObservableArray(arg);
// };
/// end mobx problem workaround
import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { container, containerModule, Symbols } from '#/ioc';
import { makeRouter } from '#/router';
import App from '../../App';
import { PSEvents } from '../../PSEvents';


const log = require('debug')('_new')
require('../../.less/antd.less');
require('../../styles/stylesheet.scss');
const dev = window[ 'dev' ] = new class {
    Symbols = Symbols

    get store() { return container.get(Symbols.RootStore) }

    get router() { return container.get(Symbols.RouterStore) }

    get api() { return container.get(Symbols.Api) }

    get container() { return container}

    get psevents() { return container.get<PSEvents>(Symbols.PSEvents)}
}

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root')
    );
};

container.load(containerModule)

const router = makeRouter(container.get(Symbols.routes), container.get(Symbols.RouterStore))

router.start(() => {
    render(App);
})

if ( module.hot ) {
    module.hot.accept('../../App', () => {
        const NextApp = require('../../App').default;
        render(NextApp);
    });
}
