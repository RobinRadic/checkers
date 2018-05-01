import { injectable } from 'inversify';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import { Api, AuthLoginData } from '#/api';
import { container, Symbols } from '#/ioc';
import { AxiosError } from 'axios';
import { reject, resolve } from '../../utils/promise';
import { UserStore } from '#/stores';
import { LocalStorage } from 'utils/storage';

const log = require('debug')('logic:stores:auth')

@injectable()
export class AuthStore {
    get api(): Api {return container.get<Api>(Symbols.Api) }

    get user(): UserStore {return container.get<UserStore>(Symbols.UserStore) }

    @observable inProgress          = false;
    @observable errors              = undefined;
    @observable auth: AuthLoginData = LocalStorage.get.item('auth');

    @computed get loggedIn(): boolean { return this.auth !== undefined && this.auth !== null};

    @computed get expired(): boolean {
        log('expired')

        if ( ! this.loggedIn ) {
            return false
        }
        let now       = Date.now() / 1000;
        let expiresIn = this.auth.expires_in;
        let elapsed   = now - this.auth.timestamp
        log('expired2', elapsed > expiresIn)

        return elapsed > expiresIn;
    }

    @action refreshIfExpired() {
        if ( this.expired ) {
            log('refreshIfExpired')
            return this.api.Auth.refresh()
        }
        return resolve()
    }


    constructor() {
        reaction(
            () => this.auth,
            data => {
                if ( data ) {
                    LocalStorage.set('auth', data);
                    return this.user.pullUser();
                } else {
                    LocalStorage.remove('auth');
                }
            }
        );
        reaction(
            () => this.expired,
            expired => {
                log('reaction expired', expired)
                if ( expired ) {
                    this.setAuth(null);
                    // this.refreshIfExpired();
                }
            },
            {
                fireImmediately: true
            }
        )
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
            .then((auth) => {
                runInAction(() => {
                    this.inProgress = false;
                    this.auth       = auth;
                    log('login res action', { user: auth, store: this })
                })
                return this.user.pullUser();
            })
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

    @action logout() {
        return this.api.Auth
            .logout()
            .then(() => {
                this.setAuth(null)
                return resolve();
            });
    }

    @action setAuth(auth: AuthLoginData) {
        this.auth = auth;
    }
}
