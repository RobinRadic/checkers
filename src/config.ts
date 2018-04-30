import { AxiosRequestConfig } from 'axios';

export interface IConfig {
    api: AxiosRequestConfig
    auth: {
        loginRedirect:string
        logoutRedirect:string
    }
}

const config: IConfig = {
    api: {
        baseURL: 'http://checkers.local/api/'
    },
    auth: {
        loginRedirect: 'home',
        logoutRedirect: 'home'
    }
}

export default config;
