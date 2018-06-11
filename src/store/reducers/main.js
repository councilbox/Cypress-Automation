import initialState from "./initialState";

export default function mainReducer(state = initialState.main, action) {
	switch (action.type) {
		case "LOGIN_SUCCESS":
			return {
				...state,
				isLogged: true
			};

		case "LOGOUT":
			return {
				...state,
				isLogged: false,
				loading: false
			};

		case "LOADING_FINISHED":
			return {
				...state,
				loading: false
			};

		case "PARTICIPANT_LOGIN_SUCCESS":
			return {
				...state,
				isParticipantLogged: true
			};

		case "PARTICIPANT_LOGOUT":
			return {
				...state,
				isParticipantLogged: false
			};

		case 'NO_SERVER_RESPONSE':
			return {
				...state,
				serverStatus: false
			}

		case 'SERVER_RESTORED':
			return {
				...state,
				serverStatus: true
			}

		default:
			return {
				...state
			};
	}
}
