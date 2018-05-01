import { Api } from './Api';
import { responseData } from './util';
import { injectable } from 'inversify';
import { container, Symbols } from '#/ioc';
import { MessageData, RoomData } from '#/api';

const log = require('debug')('logic:api:auth')

@injectable()
export class RoomApi {

    get api(): Api {return container.get<Api>(Symbols.Api)}

    public create(name: string): Promise<RoomData> { return this.api.withAuth().post('/room', { name }).then(responseData); }

    public all(): Promise<Array<RoomData>> { return this.api.withAuth().get('/room').then(responseData) }

    public join(id:number): Promise<RoomData> { return this.api.withAuth().post(`/room/${id}/join`).then(responseData) }

    public get(id:number): Promise<RoomData> { return this.api.withAuth().get(`/room/${id}`).then(responseData) }

    public leave() { return this.api.withAuth().post('/room/leave').then(responseData) }

    public messages(): Promise<Array<MessageData>> { return this.api.withAuth().get(`/room/message`).then(responseData) }

    public sendMessage(message: string) { return this.api.withAuth().post(`/room/message`, { message }).then(responseData) }


}
