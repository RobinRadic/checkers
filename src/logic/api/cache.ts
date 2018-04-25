/*
 * Copyright (c) 2018. Codex Project
 *
 * The license can be found in the package and online at https://codex-project.mit-license.org.
 *
 * @copyright 2018 Codex Project
 * @author Robin Radic
 * @license https://codex-project.mit-license.org MIT License
 */

import { LocalStorage } from 'utils/storage'
import { DAY } from '@radic/util';
import { injectable } from 'inversify';

const log = require('debug')('api:cache')

export interface StrategyOptions {

}

export interface CacheStrategy {

    get(key: string): any

    set(key: string, value: any): this

    has(key: string): boolean

    configure<T extends StrategyOptions>(options: T): this
}

export interface EtagStrategyOptions extends StrategyOptions {

}

@injectable()
export class EtagStrategy implements CacheStrategy {
    options?: EtagStrategyOptions;

    configure(options: EtagStrategyOptions): this {
        throw new Error('Method not implemented.');
    }

    get(key: string) {
        throw new Error('Method not implemented.');
    }

    set(key: string, value: any): this {
        throw new Error('Method not implemented.');
    }

    has(key: string): boolean {
        throw new Error('Method not implemented.');
    }

}

@injectable()
export class MemoryStrategy implements CacheStrategy {
    options?: StrategyOptions = {
    }

    protected cache = {}

    configure(options: StrategyOptions): this {
        // throw new Error('Method not implemented.');
        return this;
    }

    get(key: string) {
        return this.cache[key];
    }

    set(key: string, value: any): this {
        this.cache[key] = value;
        return this;
    }

    has(key: string): boolean {
        return this.cache[key] !== undefined
    }
}


export interface ExpiresStrategyOptions extends StrategyOptions {
    expires?: number
}

@injectable()
export class ExpiresStrategy implements CacheStrategy {
    options: ExpiresStrategyOptions = {
        expires: DAY
    }

    configure(options: ExpiresStrategyOptions): this {
        this.options = {
            ...(this.options || {}),
            ...options
        }
        return this
    }

    get(key: string) {
        return LocalStorage.get.item(key + ':data');
    }

    set(key: string, value: any): this {
        LocalStorage.set(key + ':data', value);
        LocalStorage.set(key + ':expires', Date.now() + this.options.expires);
        return this
    }

    has(key: string): boolean {

        if ( false === LocalStorage.has(key + ':expires') ) {
            return false;
        }

        let expires = LocalStorage.get.item(key + ':expires');
        //expired
        if ( Date.now() > expires ) {
            return false;
        }

        return true;
    }
}

@injectable()
export class NoCacheStrategy implements CacheStrategy {
    public get(key: string): any {
        return undefined;
    }

    public set(key: string, value: any): this {
        return this;
    }

    public has(key: string): boolean {
        return false;
    }

    public configure<T extends StrategyOptions>(options: T): this {
        return this;
    }

}

@injectable()
export class Cache {
    get strategy(): CacheStrategy { return this._strategy }

    protected _strategy: CacheStrategy

    constructor() {
        log('constructor', this)
        this._strategy = <CacheStrategy> new ExpiresStrategy();
    }

    setStrategy(strategy: CacheStrategy): this {
        this._strategy = strategy;
        return this
    }

    get(key: string): any {
        return this._strategy.get(key);
    }

    set(key: string, value: any): this {
        this._strategy.set(key, value);
        return this;
    }

    has(key: string): boolean {
        return this._strategy.has(key);
    }
}
