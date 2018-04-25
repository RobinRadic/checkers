import * as React from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { RouterStore } from 'stores';
import { injectable } from 'inversify';
import RootView from 'views/RootView';
import { hot } from 'react-hot-loader';

window['React'] = React;

@observer
@injectable()
export class App extends React.Component {
    @inject(Symbols.RouterStore) routerStore: RouterStore

    render() {
        let { route } = this.routerStore

        return (
            <RootView/>
        )
    }
}
export default hot(module)(App)

// export const App = hot(module)(Apps)

// export const App = AppComponent
