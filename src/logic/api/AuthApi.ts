import { Api } from './Api';
import { responseData } from './util';
import { injectable } from 'inversify';
import { container, Symbols } from '#/ioc';
import { AuthLoginData } from './interfaces';

const log = require('debug')('logic:api:auth')

@injectable()
export class AuthApi {
    get api(): Api {return container.get<Api>(Symbols.Api)}

    public current() {
        return this.api.withAuth().get('/auth/me').then(responseData);
    }

    public login(email: string, password: string): Promise<AuthLoginData> {
        return this.api.post('/auth/login', { email, password }).then(responseData)
    }

    public register(email: string, username: string, password: string) {
        return this.api.post('/users', { email, username, password })
    }

    public logout() {
        return this.api.withAuth().post('/auth/logout');
    }
}
