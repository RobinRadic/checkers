import { Api } from './Api';
import { responseData } from './util';
import { injectable } from 'inversify';
import { container, Symbols } from '#/ioc';
import { AuthLoginData } from './interfaces';

const log = require('debug')('logic:api:auth')

@injectable()
export class RoomApi {

    get api(): Api {return container.get<Api>(Symbols.Api)}

    public create(name: string) {
        return this.api.withAuth().post('/room/create', { name }).then(responseData);
    }

    public join(name: string): Promise<AuthLoginData> {
        return this.api.withAuth().post('/room/join', { name }).then(responseData)
    }

    public get(name: string): any {
        return this.api.withAuth().get('/room', { data: { name } }).then(responseData)
    }

    public leave() {
        return this.api.withAuth().post('/room/leave').then(responseData)
    }

    public messages() {
        return this.api.withAuth().get('/room/messages').then(responseData)
    }

    public sendMessage(message: string) {
        return this.api.withAuth().post('/room/message', { message }).then(responseData)
    }


}
