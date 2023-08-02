import { combineReducers } from "redux";
import User from './user_reducer'

//combineReducer > 여러 reducer들을 rootReducer에서 하나로 합쳐줌 
const rootReducer = combineReducers({
    User
})
export default rootReducer