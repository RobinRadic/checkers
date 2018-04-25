/*
 * Copyright (c) 2018. Codex Project
 *
 * The license can be found in the package and online at https://codex-project.mit-license.org.
 *
 * @copyright 2018 Codex Project
 * @author Robin Radic
 * @license https://codex-project.mit-license.org MIT License
 */

import Axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import MD5 from 'utils/md5'
import {merge} from 'lodash'
import { Cache, NoCacheStrategy } from './cache';
import { ApiRequestConfig } from 'interfaces';
import { injectable,inject } from 'inversify';
import { Symbols } from '../ioc/Symbols';
import { reject, resolve } from 'utils/promise';

const log = require('debug')('api:client')

@injectable()
export class Client {
    private _cacheResponseInterceptorId: number                = null
    private _cacheKeyPrefix                                    = 'codex.api'
    private _client: AxiosInstance
    private _debug                                             = {
        limiterCount: 0
    }
    protected pendingRequests: { [key: string]: AxiosPromise } = {}
    protected config: ApiRequestConfig                         = {}
    public errorHandler: Function

    public get client(): AxiosInstance { return this._client; }

    @inject(Symbols.Cache)
    private _cache: Cache
    public get cache(): Cache { return this._cache; }

    constructor() {
        log('constructor', this);
        // this._cache.setStrategy(new NoCacheStrategy);
        // this.configure()

        this.errorHandler = (error: any) => {

            if ( error.response ) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with a status code outside of range 2xx', { status: error.response.status, headers: error.response.headers, data: error.response.data });
            } else if ( error.request ) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.error('The request was made but no response was received')
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Something happened in setting up the request that triggered an Error: ' + error.message);
            }
            console.error('Config', error.config);

        }
    }


    configure(config: ApiRequestConfig = {}) {
        log('configure', config);
        let defaultConfig: ApiRequestConfig = {
            headers: {
                // 'X-Requested-With': 'XMLHttpRequest',
                // 'Accept'          : 'application/json'
            },
            cache  : {
                enabled: false,
                useETag: false,
                expires: null
            },
            debug  : {
                limiter: false
            }
        }
        this.config                         = merge({}, defaultConfig, this.config, config);
        this._client                        = Axios.create(this.config);
        //
        // this._cacheResponseInterceptorId = this._client.interceptors.response.use((res) => {
        //     log('response', res)
        //     if ( ! res.config[ 'cache' ].useETag ) return res;
        //     if ( res.config.method !== 'get' ) return res;
        //
        //     this.cacheKey(res.config).set(res.headers.etag, res.data);
        //
        //
        //     return res;
        // }, this.handleInterceptorError)
    }

    protected cacheKey(config: AxiosRequestConfig): { key: string, hasEtag: boolean, etag: string, hasData: boolean, data: any, set: (etag: string, data: any) => void } {
        let key     = this.getCacheKey(config.url, config.params);
        let hasEtag = this._cache.has(key + ':etag');
        let etag    = hasEtag ? this._cache.get(key + ':etag') : undefined;
        let hasData = this._cache.has(key);
        let data    = hasData ? this._cache.get(key) : undefined;
        let set     = (etag: string, data: any) => {
            this._cache.set(key + ':etag', etag);
            this._cache.set(key, data);
        }
        return <any> { key, hasEtag, etag, hasData, data, set }
    }

    protected getCacheKey(url: string, params?: any): string {
        let key = `${this._cacheKeyPrefix}.${url.replace(/\./g, '__')}`
        if ( params ) {
            key += '?' + this.getParamsHash(params);
        }
        return key
    }

    protected getParamsHash(params: { [key: string]: any }): string {
        if ( params === undefined ) return '';
        let objectText = Object.keys(params).map(key => {
            let val = params[ key ];
            if ( typeof val === 'undefined' ) {
                throw new Error('as this is on key ' + key)
            }
            return key + val.toString()
        }).join('');
        return MD5(objectText)
    }

    //
    protected handleCatchedError(error: any) {
        this.errorHandler(error)
        // console.dir({ response: reason.response }, {depth: 6, colors: true});
    }

    protected handleInterceptorError(error) {
        return reject(error);
    }

    request(config: ApiRequestConfig): AxiosPromise {
        // codex.emit('api:request')
        if ( this.config.debug.limiter && this._debug.limiterCount > this.config.debug.limiter ) {
            return reject('Debug limiter reached: ' + this.config.debug.limiter)
        }
        if ( this.config.debug.limiter ) {
            this._debug.limiterCount ++;
        }

        let key = this.getCacheKey(config.url, config.params);
        if ( this.config.cache.enabled && this.cache.has(key) ) {
            return resolve(this.cache.get(key))
        }
        // let cache = this.cacheKey(config);
        // if ( this.config.cache.useETag && config.method.toLowerCase() === 'get' ) {
        //     if ( cache.hasEtag ) {
        //         config.headers = config.headers || {}
        //         config.headers[ 'If-None-Match' ] = cache.etag
        //     }
        // }
        if ( this.pendingRequests[ key ] === undefined ) {
            this.pendingRequests[ key ] = <any> this._client.request(config)
                .then((res: AxiosResponse) => {
                    if ( this.config.cache.enabled ) {
                        this.cache.set(key, res)
                        // if(res.status === 304){
                        //     res.data = cache.data
                        // } else {
                        //     cache.set(res.headers.etag, res.data)
                        // }
                    }
                    // codex.emit('api:response', res)
                    return resolve(res)
                })
                .then((res) => {
                    delete this.pendingRequests[ key ];
                    return resolve(res)
                })
                .catch((err) => this.handleCatchedError(err));
        }
        return this.pendingRequests[ key ]

    }

    options(url: string, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'OPTIONS', url, ...config }) }

    get(url: string, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'GET', url, ...config }) }

    delete(url: string, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'DELETE', url, ...config }) }

    head(url: string, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'HEAD', url, ...config }) }

    post(url: string, data?: any, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'POST', url, data, ...config }) }

    put(url: string, data?: any, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'PUT', url, data, ...config }) }

    patch(url: string, data?: any, config?: ApiRequestConfig): AxiosPromise { return this.request({ method: 'PATCH', url, data, ...config }) }

}

export default Client;
