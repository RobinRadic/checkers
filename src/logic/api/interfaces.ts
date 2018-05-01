import { AxiosResponse } from 'axios';

export interface User {
    id:number
    name:string
}

export interface Player {
    id:number
    room_id:number
    name:string
    user?:User
}

export interface MessageData {
    id:number
    room_id:number
    created_at:string
    message:string
    player:Player
}

export interface RoomData {
    id:number
    is_full:boolean
    name:string
    messages?:MessageData
    players:Player[]
}

export interface AuthLoginData {
    access_token: any
    expires_in: number
    timestamp: number
    token_type: string
}

export type AuthLoginResponse = AxiosResponse<AuthLoginData>
export type RoomAllResponse = AxiosResponse<Array<RoomData>>
