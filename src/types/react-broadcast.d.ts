// Type definitions for react-broadcast 0.6
// Project: https://github.com/ReactTraining/react-broadcast
// Definitions by: Jaga Santagostino <https://github.com/kandros>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.6

import * as React from 'react';

export function createContext(defaultValue:any){

    return {
        Consumer,
        Provider
    }

}


export namespace Consumer {
    interface Props<T>  {
        quiet?: boolean;
        children?: ((state: T) => React.ReactNode);
    }
}

export namespace Provider {
    interface Props<T>   {
        children: React.ReactNode;
        value: T;
    }
}

export class Consumer<T> extends React.Component<Consumer.Props<T>, any> { }
export class Provider<T> extends React.Component<Provider.Props<T>, any> { }
