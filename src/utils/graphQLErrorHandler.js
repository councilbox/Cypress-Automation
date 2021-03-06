import React from 'react';
import { printCifAlreadyUsed, printSessionExpiredError, printTrialEnded } from './CBX';
import { logout } from '../actions/mainActions';
import { refreshTokenQuery } from '../queries';
import { LiveToast } from '../displayComponents';

export const refreshToken = async (apolloClient, toast, store) => {
	const rToken = sessionStorage.getItem('refreshToken');
	if (rToken) {
		const response = await apolloClient.mutate({
			mutation: refreshTokenQuery,
			variables: {
				token: rToken
			}
		});
		if (!response.errors) {
			sessionStorage.setItem('token', response.data.refreshToken.token);
			sessionStorage.setItem('refreshToken', response.data.refreshToken.refreshToken);
			return response;
		}
	}

	if (!sessionStorage.getItem('token') && !sessionStorage.getItem('participantToken')) {
		toast(
			<LiveToast
				id="error-toast"
				message={printSessionExpiredError()}
			/>, {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: true,
				className: 'errorToast'
			}
		);
		store.dispatch(logout());
	}

	return true;
};

export const graphQLErrorHandler = async (graphQLError, toast, store, apolloClient, operation, bHistory) => {
	if (graphQLError.message === 'Validation error') {
		if (graphQLError.originalError) {
			if (graphQLError.originalError.fields) {
				if (graphQLError.originalError.fields.tin) {
					toast(
						<LiveToast
							id="error-toast"
							message={printCifAlreadyUsed()}
						/>, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: 'errorToast'
						}
					);
				}
			}
		}
	}
	if (graphQLError.message === 'Company trial ended') {
		toast(
			<LiveToast
				id="error-toast"
				message={printTrialEnded()}
			/>, {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: true,
				className: 'errorToast'
			}
		);
		bHistory.push('/');
	}
};
