import { decorate, inject, injectable } from 'inversify';
import { ConstructorOptions, EventEmitter2 } from 'eventemitter2';

decorate(injectable(), EventEmitter2);

@injectable()
export class Dispatcher extends EventEmitter2 {
    constructor(@inject(Dispatcher.name + 'ConstructorOptions') options: ConstructorOptions) {
        super(options);
    }
}
