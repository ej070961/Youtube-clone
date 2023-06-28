import{
    LOGIN_USER,
    REGISTER_USER
} from '../actions/types';

export default function (state = {}, action){
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload} //state를 똑같이 가져오고, user_actions의 payload를 넣어줌 
            break;
        case REGISTER_USER:
        return {...state, register: action.payload} //state를 똑같이 가져오고, user_actions의 payload를 넣어줌 
        break;
        default:
            return state;
    }
}