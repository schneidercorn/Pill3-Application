import { createActionTypes } from './utils';
import { getUserInfo, getUserStatus } from '../services/user';

const ACTIONS = createActionTypes([
	'LOAD_USER_AND_PRIVILEGE'
]);
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, { payload, type }) => {
	switch (type) {
		case ACTIONS.LOAD_USER_AND_PRIVILEGE:
			return { ...state, ...payload };
		default:
			return state;
	}
};

export const loadUser = () => dispatch => {
	getUserInfo(payload => dispatch({ type: ACTIONS.LOAD_USER_AND_PRIVILEGE, payload }));
};

export const userStatus = () => dispatch => {
	getUserStatus().then(status =>
		dispatch({ type: ACTIONS.USER_STATUS, payload: status }));
};