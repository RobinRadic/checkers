//@formatter:off
import 'reflect-metadata'
//@formatter:on
import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Container, container, containerModule, Symbols } from 'ioc';
import { makeRouter } from 'router';
import App from '../../App';
import { defer } from 'utils/promise';
import { Router } from 'router5/create-router';

const log = require('debug')('start')
require('../../styles/stylesheet.scss');


const render = (elid, Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById(elid)
    );
};


export interface IBooter {
    router: Router
    Symbols:{[key:string]:Symbol}
    container: Container
    init: () => Promise<any>
    boot: (elementID: string) => Promise<any>
}

class Booter implements IBooter {
    private _router: Router
    get router():Router{
        log('getting router')
        if(this._router === undefined){
            this._router = makeRouter(container.get(Symbols.routes), container.get(Symbols.RouterStore))
        }
        return this._router;
    }
    Symbols:{[key:string]:Symbol} = Symbols

    constructor(public container: Container) {}

    public init() {
        let d = defer()
        log('init')
        container.load(containerModule)
        container.bind(Symbols.Router).toConstantValue(this.router);
        d.resolve(this);
        return d.promise;
    }

    public boot(elementID: string) {
        let d = defer()
        log('boot')
        this.router.start(() => {
            log('start render')
            render(elementID, App);
            d.resolve(this);
        })
        return d.promise;
    }
}

const starter = new Booter(container);
module.exports = starter
