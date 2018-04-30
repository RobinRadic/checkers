import { Config, objectExists, objectGet, objectSet } from '@radic/util';
import { merge } from 'lodash'

export class Repository  {
    items: any = {}

    unset(prop: any) {
        objectSet(this.items, prop, undefined);
        return this;
    }

    has(prop?: any): boolean {
        return objectExists(this.items, prop);
    }

    get<T extends any>(prop?: any, defaultReturnValue?: any): T {
        return this.has(prop) ? objectGet(this.items, prop) : defaultReturnValue;
    }

    set(prop: string | Object, value?: any): this {
        objectSet(this.items, prop, value)
        return this;
    }

    merge(...args: any[]): this {
        merge(this.items, ...args);
        return this;
    }
}
