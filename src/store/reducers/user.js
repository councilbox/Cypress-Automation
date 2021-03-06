import initialState from './initialState';

export default function userReducer(state = initialState.user, action) {
	switch (action.type) {
		case 'SET_USER_DATA':
			return {
				...state,
				...action.value
			};

		case 'LOGOUT':
			return {
				...initialState.user
			};

		default:
			return {
				...state
			};
	}
}
