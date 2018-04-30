import { AxiosError } from 'axios';
import { reject } from '../../utils/promise';

const log = require('debug')('api:utils')

export const responseData = res => res.data;

export const handleErrors = (err: AxiosError, ...args) => {
    log('handleErrors', { err, args })
    return reject(err);
    // return err as any;
}
