import ACTION from '../actions/actionTypes';
import CONSTANTS from '../constants';

const initialState = {
    isFetching: true,
    error: null,
    contests: [],
    customerFilter: CONSTANTS.CONTEST_STATUS_ACTIVE,
    creatorFilter: {
        typeIndex: 1,
        selectedContestsTypes: [],
        contestId: '',
        industry: '',
        awardSort: 'asc',
        ownEntries: false
    },
    haveMore: true
};


export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_CONTESTS_ACTION_REQUEST: {
            return {
                ...state,
                isFetching: true,
                error: null,
            }
        }
        case ACTION.GET_CONTESTS_ACTION_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                error: null,
                contests: [...state.contests, ...action.data.contests],
                haveMore: action.data.haveMore
            }
        }
        case ACTION.GET_CONTESTS_ACTION_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
                contests: []
            }
        }
        case ACTION.CLEAR_CONTESTS_LIST: {
            return {
                ...state,
                error: null,
                contests: []
            }
        }
        case ACTION.SET_NEW_CUSTOMER_FILTER: {
            return {
                ...initialState,
                isFetching: false,
                customerFilter: action.filter
            }
        }
        case ACTION.SET_NEW_CREATOR_FILTER: {
            return {
                ...initialState,
                isFetching: false,
                creatorFilter: {...state.creatorFilter,...action.filter}
            }
        }
        case ACTION.ADD_CONTEST_TYPE: {
            const {data} = action;
            const {creatorFilter: {selectedContestsTypes}, creatorFilter} = state;
            const options = new Set(selectedContestsTypes)
            options.add(data)
            return {
                ...state,
                creatorFilter: {
                    ...creatorFilter,
                    selectedContestsTypes: [...options]
                }
            }
        }
        case ACTION.REMOVE_CONTEST_TYPE: {
            const {data} = action;
            const {creatorFilter: {selectedContestsTypes}, creatorFilter} = state;
            const options = new Set(selectedContestsTypes)
            options.delete(data)
            return {
                ...state,
                creatorFilter: {
                    ...creatorFilter,
                    selectedContestsTypes: [...options]
                }
            }
        }
        default:
            return state;
    }
}

