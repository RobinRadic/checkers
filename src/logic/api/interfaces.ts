import { AxiosResponse } from 'axios';

export interface User {

}


export interface AuthLoginData {
    access_token: any
    expires_in: number
    token_type: string
}

export type AuthLoginResponse = AxiosResponse<AuthLoginData>
