import { action, observable } from 'mobx';

import { injectable } from 'inversify';
import { container, Symbols } from '#/ioc';
import { Api } from '#/api';

@injectable()
export class UserStore {
    get api(): Api {return container.get<Api>(Symbols.Api) }

    @observable currentUser;
    @observable loadingUser;
    @observable updatingUser;
    @observable updatingUserErrors;

    @action pullUser() {
        this.loadingUser = true;
        return this.api.Auth.current()
            .then(action(({ user }) => { this.currentUser = user; }))
            .then(action(() => { this.loadingUser = false; }))
    }

    @action forgetUser() {
        this.currentUser = undefined;
    }

    // @action updateUser(newUser) {
    //     this.updatingUser = true;
    //     return this.api.Auth.save(newUser)
    //         .then(action(({ user }) => { this.currentUser = user; }))
    //         .then(action(() => { this.updatingUser = false; }))
    // }

}
