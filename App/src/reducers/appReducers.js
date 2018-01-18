import { combineReducers } from 'redux'
import { TOKEN, USERLOGIN } from '../actions/appActions.js'
/* Reducer 是用來進行 state 的狀態更改  前面的action 只是告訴你說有這個事件發生 
並未對我們的state去進行記錄或是修改*/
function appDatas(state = { }, action) {
    switch (action.type) {
        case TOKEN:
            return [
                ...state, 
                action.token
            ]
        case USERLOGIN:
            return [
                ...state, 
                action.status
            ]
        default:
            return state
    }
}

let rootReducer = combineReducers({
    appDatas
})

  export default rootReducer