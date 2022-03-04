import { createActionTypes } from './utils';
import { getUserInfo, serialExists } from '../services/user';

const ACTIONS = createActionTypes([
	'USER_STATUS',
	'LOAD_USER'
]);

const INITIAL_STATE = {
	isLoggedIn: false,
	serial: {}
};

export default (state = INITIAL_STATE, { payload, type }) => {
	switch (type) {
		case ACTIONS.LOAD_USER:
			return { ...state, ...payload };
		case ACTIONS.USER_STATUS:
			return { ...state, ...payload };
		default:
			return state;
	}
};

export const loadUser = () => dispatch => {
	getUserInfo(payload => dispatch({ type: ACTIONS.LOAD_USER, payload }));
};

export const userStatus = (serial) => dispatch => {
	serialExists(serial).then(status =>
		dispatch({ type: ACTIONS.USER_STATUS, payload: status }));
};