import ReactGa from 'react-ga';
import { store } from '../containers/App';

const filteredEmails = /councilbox|cocodin/;

const checkShouldTrack = () => {
	const state = store.getState();
	if (state.user && state.user.email) {
		const { email } = state.user;
		if (filteredEmails.test(email)) {
			return false;
		}
	}

	return true;
};

export const init = () => {
	if (checkShouldTrack()) {
		ReactGa.initialize(process.env.REACT_APP_GTAG_ID);
	}
};

export const sendGAevent = args => {
	if (window.location.hostname.includes('localhost')) {
		console.log(args);
	}
	if (checkShouldTrack()) {
		ReactGa.event(args);
	}
};

export const pageView = () => {
	if (checkShouldTrack()) {
		ReactGa.pageview(window.location.pathname.replace(/\d+\//g, '').replace(/\/\d+$/g, '') + window.location.search);
	}
};
