import  {combineReducers} from 'redux'

import userReducers from './User'

export default combineReducers({
    user: userReducers
    // all reducers.....
})