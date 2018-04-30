import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Hot } from 'decorators';
import { classes, style } from 'typestyle'
import { AuthStore, RouterStore } from '#/stores';
import { inject, Symbols } from '#/ioc';
import config from '../config';

const log = require('debug')('components:LogoutView')

/**
 * LoginView component
 */
@Hot(module)
@observer
export default class LogoutView extends Component<any> {
    static displayName: string           = 'LogoutView'
    @inject(Symbols.AuthStore) authStore: AuthStore;
    @inject(Symbols.RouterStore) routerStore: RouterStore;


    componentDidMount(): void {
        this.authStore.logout().then(() => {
            this.routerStore.navigate(config.auth.logoutRedirect);
        })
    }

    render() {
        // const {} = this.props;
        return null
    }

}
