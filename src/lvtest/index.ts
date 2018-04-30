import 'reflect-metadata'
import { Kernel } from './app/Console/Kernel';
import { app } from './bootstrap/app';
import { Dispatcher } from './framework/Events/Dispatcher';

const kernel = new Kernel(app);

app.get<Dispatcher>(Dispatcher).onAny((event, ...args) => {
    console.log('Event', event, { args });
})

kernel.handle()
