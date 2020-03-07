import {ADD_INPUT_NAME,ADD_INPUT_PHONE,ADD_INPUT_ADDRESS,ADD_INPUT_DIRECTION,
    ADD_INPUT_DISTRICT,ADD_INPUT_SPEED,
    ADD_INPUT_REASON,ADD_INPUT_NOTICE} from './actionType';
import {recordInput} from '../components/Common/form/constantsForm';
import {combineReducers} from 'redux';

// Init State ////
const initState = recordInput;

// create Action
export function addInputNameAction(name){
    return{
        type: ADD_INPUT_NAME,
        name
    }
}
export function addInputPhoneAction(phone){
    return{
        type: ADD_INPUT_PHONE,
        phone
    }
}
export function addInputAddressAction(address){
    return{
        type: ADD_INPUT_ADDRESS,
        address
    }
}
export function addInputDirectionAction(direction){
    return{
        type: ADD_INPUT_DIRECTION,
        direction
    }
}
export function addInputDistrictAction(district){
    return{
        type: ADD_INPUT_DISTRICT,
        district
    }
}
export function addInputSpeedAction(speed){
    return{
        type: ADD_INPUT_SPEED,
        speed
    }
}
export function addInputReasonAction(reason){
    return{
        type: ADD_INPUT_REASON,
        reason
    }
}
export function addInputNoticeAction(notice){
    return{
        type: ADD_INPUT_NOTICE,
        notice
    }
}

//create Reducer ///
export const  addInputFormReducer = (state = initState,action) => {
    switch (action.type) {
        case ADD_INPUT_NAME:
            return {...state,personSharing:action.name}
        case ADD_INPUT_PHONE:
            return {...state,phoneNumber:action.phone}
        case ADD_INPUT_ADDRESS:
            return{...state,addresses:action.address}
        case ADD_INPUT_DIRECTION:
            return {...state,direction:action.direction}
        case ADD_INPUT_DISTRICT:
            return { ...state,district:action.district}
        case ADD_INPUT_SPEED:
            return {...state,speeds:action.speed}
        case ADD_INPUT_REASON:
            return {...state,reasons:action.reason}
        case ADD_INPUT_NOTICE:
            return {...state,notice:action.notice}
        default:
            return state;
    }
}



