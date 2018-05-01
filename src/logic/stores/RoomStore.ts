import { injectable } from 'inversify';
import { action, observable, runInAction } from 'mobx';
import { container, inject, Symbols } from '#/ioc';
import { Api, RoomData } from '#/api';

const Echo = require('laravel-echo');


@injectable()
export class RoomStore {

    get echo(): typeof Echo { return container.get<any>(Symbols.Echo) }

    @inject(Symbols.Api) api: Api;

    @observable room: RoomData         = undefined;
    @observable rooms: Array<RoomData> = [];
    @observable inProgress: boolean    = false;
    @observable errors                 = undefined;

    @action fetchRooms() {
        this.inProgress = true;

        return this.api.Room
            .all()
            .then((rooms) => runInAction(() => {
                this.rooms      = rooms;
                this.inProgress = false;
            }))
    }

    @action createRoom(name: string) {
        this.inProgress = true;
        return this.api.withAuth().Room
            .create(name)
            .then((room) => runInAction(() => {
                this.room       = room;
                this.inProgress = false;
            }))
    }

    @action joinRoom(id: number) {
        this.inProgress = true;
        return this.api.withAuth().Room
            .join(id)
            .then((room) => runInAction(() => {
                this.room       = room;
                this.inProgress = false;
            }))

    }

    @action leaveRoom() {
        this.inProgress = true;
        return this.api.withAuth().Room
            .leave()
            .then(() => runInAction(() => {
                this.room       = undefined;
                this.inProgress = false;
            }))

    }
}
