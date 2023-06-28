import axios from 'axios';
import{
    LOGIN_USER, REGISTER_USER
} from './types'

export function loginUser(dataToSubmit){

    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data) //백엔드에서 가져온 모든 데이터 

    return{
        type: "LOGIN_USER",
        payload: request 

    }
}

export function registerUser(dataToSubmit){

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data) //백엔드에서 가져온 모든 데이터 

    return{
        type: "REGISTER_USER",
        payload: request 

    }
}