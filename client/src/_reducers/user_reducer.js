//user에 관한 state을 변경하는 함수 
import{
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER
} from '../_actions/types.js';

export default function (state = {}, action){
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload} //state를 똑같이 가져오고, user_actions의 payload를 넣어줌 
        case REGISTER_USER:
        return {...state, register: action.payload} //state를 똑같이 가져오고, user_actions의 payload를 넣어줌 
        case AUTH_USER:
        return {...state, userData: action.payload}//state를 똑같이 가져오고, user_actions의 payload를 넣어줌 
        case LOGOUT_USER:
            return {...state }
        default:
            return state;
    }
}

