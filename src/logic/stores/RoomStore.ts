import { injectable } from 'inversify';
import { action, observable, runInAction } from 'mobx';
import { container, inject, Symbols } from '#/ioc';
import { Api } from '#/api';
const Echo = require('laravel-echo');


@injectable()
export class RoomStore {

    get echo(): typeof Echo { return container.get<any>(Symbols.Echo) }

    @inject(Symbols.Api) api: Api;

    @observable room                = undefined;
    @observable inProgress: boolean = false;
    @observable errors              = undefined;

    @action createRoom(name: string) {
        this.inProgress = true;
        return this.api.withAuth().Room
            .create(name)
            .then((room) => runInAction(() => {
                this.room       = room;
                this.inProgress = false;
            }))
    }

    @action joinRoom(name: string) {
        this.inProgress = true;
        return this.api.withAuth().Room
            .join(name)
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
