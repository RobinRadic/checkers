import { injectable } from 'inversify';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import { Api } from '#/api';
import { container, Symbols } from '#/ioc';
import { AxiosError } from 'axios';
import { reject, resolve } from '../../utils/promise';
import { UserStore } from '#/stores';

const log = require('debug')('logic:stores:auth')

@injectable()
export class AuthStore {
    get api(): Api {return container.get<Api>(Symbols.Api) }

    get user(): UserStore {return container.get<UserStore>(Symbols.UserStore) }

    @computed get loggedIn(): boolean { return this.token !== undefined && this.token !== null};

    @observable inProgress = false;
    @observable errors     = undefined;
    @observable token      = window.localStorage.getItem('jwt');

    constructor() {
        reaction(
            () => this.token,
            token => {
                if ( token ) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
    }

    @observable values = {
        name    : '',
        email   : '',
        password: ''
    };

    @action setName(username) {
        this.values.name = username;
    }

    @action setEmail(email) {
        this.values.email = email;
    }

    @action setPassword(password) {
        this.values.password = password;
    }

    @action reset() {
        this.values.name     = '';
        this.values.email    = '';
        this.values.password = '';
    }

    @action login() {
        this.inProgress = true;
        this.errors     = undefined;
        return this.api.Auth
            .login(
                this.values.email,
                this.values.password
            )
            .then((user) => runInAction(() => {
                this.inProgress = false;
                this.token      = user.access_token;
                log('login res action', { user, store: this })
            }))
            .catch((err: AxiosError) => {
                runInAction(() => {
                    this.inProgress = false;
                    this.errors     = err.response.statusText
                })
                log('login catch', { err, store: this })
                return reject(err);
            })
    }

    @action register() {
        this.inProgress = true;
        this.errors     = undefined;
        return this.api.Auth
            .register(
                this.values.email,
                this.values.password,
                this.values.name
            )
            .then((user) => runInAction(() => {
                this.inProgress = false;
                log('register res action', { user, store: this })
            }))
            .catch((err: AxiosError) => {
                runInAction(() => {
                    this.inProgress = false;
                    this.errors     = err.response.data.errors
                })
                log('register catch', { err, store: this })
                return reject(err);
            })
    }

    @action
    logout() {
        return this.api.Auth
            .logout()
            .then(() => {
                this.setToken(null)
                return resolve();
            });
    }

    @action setToken(token) {
        this.token = token;
    }
}
