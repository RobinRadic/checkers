import { injectable } from 'inversify';
import { container, Symbols } from '../ioc';
import { AuthStore, BreakpointStore, GameStore, RoomStore, RouterStore, UserStore } from '#/stores';


@injectable()
export class RootStore {

    get auth(): AuthStore {return container.get<AuthStore>(Symbols.AuthStore) }

    get breakpoint(): BreakpointStore {return container.get<BreakpointStore>(Symbols.BreakpointStore) }

    get game(): GameStore {return container.get<GameStore>(Symbols.GameStore) }

    get room(): RoomStore {return container.get<RoomStore>(Symbols.RoomStore) }

    get router(): RouterStore {return container.get<RouterStore>(Symbols.RouterStore) }

    get user(): UserStore {return container.get<UserStore>(Symbols.UserStore) }
}
