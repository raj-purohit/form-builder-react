import { ACTION_TYPES } from './Actions';

const initState = {
    forms       : localStorage.getItem('forms')? JSON.parse(localStorage.getItem('forms'))  ? JSON.parse(localStorage.getItem('forms')) : [] : []
}

const Reducer = (state = initState, action) => {
    switch (action.type) {
        case ACTION_TYPES.ADDED_FORM:
            return {
                ...state,
                forms : action.data
            };
            
        default:
            return state;
    }
    
}

export default Reducer;