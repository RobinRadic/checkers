import { injectable } from 'inversify';
import Axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { AuthApi } from './AuthApi';
import { container, Symbols } from '#/ioc';
import { handleErrors } from './util';
import { AuthStore } from '#/stores';
import { RoomApi } from '#/api';

const log = require('debug')('api')

@injectable()
export class Api {
    protected client: AxiosInstance

    protected get authStore(): AuthStore { return container.get<AuthStore>(Symbols.AuthStore)}

    constructor() {
        this.configure();
    }

    configure(configuration: AxiosRequestConfig = {}) {
        this.client = Axios.create(configuration);
    }

    protected authInterceptorRequestId: number
    protected authInterceptorResponseId: number

    withAuth(): this {
        if(!this.authStore.loggedIn){
            return this;
        }
        this.client.defaults.headers.Authorization = 'Bearer ' + this.authStore.auth.access_token
        if ( this.authInterceptorResponseId === undefined ) {
            // this.authInterceptorRequestId = this.client.interceptors.request.use(
            //     (config) => {
            //         if ( this.authStore.loggedIn ) {
            //             config.headers.Authorization = 'Bearer ' + this.authStore.auth.access_token
            //         }
            //         return config
            //     }
            // )
            const eject = () => {
                this.client.defaults.headers.Authorization = undefined;
                this.client.interceptors.request.eject(this.authInterceptorRequestId)
                this.client.interceptors.response.eject(this.authInterceptorResponseId)
                this.authInterceptorResponseId = this.authInterceptorRequestId = undefined
            }
            this.authInterceptorResponseId = this.client.interceptors.response.use((v) => {
                eject();
                return v;
            }, (v) => {
                eject();
                return v;
            })
        }
        return this;
    }

    get Auth(): AuthApi { return container.get<AuthApi>(Symbols.AuthApi) }
    get Room(): RoomApi { return container.get<RoomApi>(Symbols.RoomApi) }

    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
        return this.client
            .request(config)
            .catch(handleErrors);
    }

    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> { return this.request({ method: 'get', url, ...config || {} }) }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise { return this.request({ method: 'delete', url, ...config || {} }); }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise { return this.request({ method: 'head', url, ...config || {} }); }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> { return this.request({ method: 'post', data, url, ...config || {} }); }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> { return this.request({ method: 'put', data, url, ...config || {} }); }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> { return this.request({ method: 'patch', data, url, ...config || {} }); }


}
