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

    public register(email: string, password: string, name: string) {
        return this.api.post('/auth/register', { email, password, password_confirmation:password, name }).then(responseData)
    }

    public logout() {
        return this.api.withAuth().post('/auth/logout');
    }
}
