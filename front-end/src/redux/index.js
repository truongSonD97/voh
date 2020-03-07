import {addInputFormReducer,addInputNameAction} from './FormInputReducer';
import {combineReducers,createStore} from 'redux';
var redux = require("redux");


const reducers = combineReducers({
    inputForm : addInputFormReducer
})

const store = createStore(reducers,redux.compose(window.devToolsExtension ? window.devToolsExtension() : f => f));
// listen when store changed
store.subscribe(() => {
    console.log("Store Change", store.getState())
});
export default store;
