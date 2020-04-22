import { getCompanies } from "./companyActions";
import { client, bHistory, refreshWSLink } from "../containers/App";
import { getMe, getTranslations } from "../queries";
import DetectRTC from "detectrtc";
import { moment } from '../containers/App';
import gql from 'graphql-tag';
export let language = "es";

export const loginSuccess = (token, refreshToken) => {
	return dispatch => {
		sessionStorage.setItem("token", token);
		sessionStorage.setItem("refreshToken", refreshToken);
		refreshWSLink();
		dispatch(initUserData());
		dispatch(getCompanies());
		dispatch({ type: "LOGIN_SUCCESS" });
	};
};

export const setUnsavedChanges = value => (
	{ type: 'UNSAVED_CHANGES', value: value }
)

export const loadSubdomainConfig = () => {
	const subdomain = window.location.hostname.split('.')[0];
	return async dispatch => {
		const response = await client.query({
			query: gql`
				query SubdomainConfig($subdomain: String!) {
					subdomainConfig(subdomain: $subdomain){
						title
						primary
						secondary
						logo
						icon
						background
						roomBackground
						hideSignUp
					}
				}
			`,
			variables: {
				subdomain
			}
		});

		if(response.errors){
			window.location.replace('https://app.councilbox.com');
		}

		const config = response.data.subdomainConfig;

		if(config.primary){
			document.documentElement.style.setProperty('--primary', config.primary);
		}

		if(config.secondary){
			document.documentElement.style.setProperty('--secondary', config.secondary);
		}

		if(config.title){
			document.title = config.title;
		}

		dispatch({ type: 'LOAD_SUBDOMAIN_CONFIG', value: {
			...response.data.subdomainConfig,
			name: subdomain
		}});
	}
}

export const participantLoginSuccess = () => {
	return dispatch => {
		sessionStorage.setItem("participantLoginSuccess", true);
		dispatch({ type: "PARTICIPANT_LOGIN_SUCCESS" });
	};
};

export const loadingFinished = () => ({ type: "LOADING_FINISHED" });

export const initUserData = () => {
	return async dispatch => {
		const response = await client.query({
			query: getMe,
			errorPolicy: "all"
		});
		if (!response.errors) {
			if (response.data.me) {
				dispatch({
					type: "SET_USER_DATA",
					value: response.data.me
				});
				dispatch(getCompanies(response.data.me.id));
				dispatch(setLanguage(response.data.me.preferredLanguage));
			}
		} else {
			response.errors[0].code === 440 &&
				sessionStorage.removeItem("token");
		}
	};
};

export const setUserData = user => {
	return dispatch => {
		dispatch({
			type: "SET_USER_DATA",
			value: user
		});
		dispatch(setLanguage(user.preferredLanguage));
	};
};

export const noServerResponse = () => {
	return { type: 'NO_SERVER_RESPONSE' };
}

export const serverRestored = () => {
	return { type: 'SERVER_RESTORED' };
}

export const logout = () => {
	sessionStorage.clear();
	return { type: "LOGOUT" };
};

export const logoutParticipant = (participant, council) => {
	sessionStorage.removeItem('participantLoginSuccess');
	bHistory.push(`/participant/${participant.id}/council/${council.id}/login`);
	return { type: "PARTICIPANT_LOGOUT" };
};

export const buildTranslateObject = translations => {
	let translationObject = {};
	translations.forEach(translation => {
		translationObject[translation.label] = translation.text;
	});

	return translationObject;
}

export const setLanguage = language => {
	return async dispatch => {
		const response = await client.query({
			query: getTranslations,
			variables: {
				language
			}
		});
		if(!response.errors){
			const translationObject = buildTranslateObject(response.data.translations);
			let locale = language;
			if (language === "cat" || language === "gal") {
				locale = "es";
			}
			moment.updateLocale(locale, {
				months: translationObject.datepicker_months.split(","),
				monthsShort: translationObject.datepicker_months
					.split(",")
					.map(month => month.substring(0, 3))
			});
			localStorage.setItem(language, JSON.stringify(translationObject));
			dispatch({
				type: "LOADED_LANG",
				value: translationObject,
				selected: language
			});
		}
	}
};

export const setDetectRTC = () => {
	return  dispatch => {
		DetectRTC.load(() => {
			dispatch({
				type: "LOADED_DETECTRTC",
				detectRTC: DetectRTC
			});
		});
	};
};
