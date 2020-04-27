
import { client, store } from "../containers/App";
import { loadingFinished } from "./mainActions";
import { companies, setCompanyAsSelected } from "../queries";

export const saveSignUpInfo = info => {
	return {
		type: "SIGN_UP_INFO",
		value: info
	};
};

export const getCompanies = userId => {
	return async dispatch => {
		if (userId) {
			const response = await client.query({
				query: companies,
				variables: { userId: userId },
				fetchPolicy: "network-only"
			});
			let selectedCompany = response.data.userCompanies.findIndex(element =>
				element.actived === 1
			);
			if(response.data.userCompanies.length === 0){
				dispatch({
					type: 'NO_COMPANIES'
				});
			}else{
				dispatch({
					type: "COMPANIES",
					value: response.data.userCompanies.map(item => {
						return { ...item.company };
					}),
					selected: selectedCompany !== -1 ? selectedCompany : 0
				});
			}
			dispatch(loadingFinished());
		}
	};
};

export const setCompany = company => {
	const index = store.getState().companies.selected;
	const companies = [...store.getState().companies.list];
	companies[index] = company;
	return {
		type: "COMPANIES",
		value: companies,
		selected: index
	};
};

let initialTranslations = null;

export const addSpecificTranslations = type => {
	if(!initialTranslations){
		initialTranslations = store.getState().translate;
	}
	const specificTranslations = getSpecificTranslations(initialTranslations.selectedLanguage, type);

	return {
		type: "LOADED_LANG",
		value: {
			...initialTranslations,
			...specificTranslations
		},
		selected: initialTranslations.selectedLanguage
	};
}

const getSpecificTranslations = (language, type) => {
	const specificTranslations = {
		society: {},
		10: {
			censuses: 'Propietarios',
			entity_name: 'Propiedad',
			present_vote: 'Presentes',
			remote_vote: 'Remotos',
			votes: 'Coeficiente',
			votes_in_favor_for_approve: 'Coeficiente necesario',
			total_votes: 'Coeficiente total'
		}
	}


	return specificTranslations[type]? specificTranslations[type] : specificTranslations.society;
}

export const changeCompany = (index, id) => {
	return async dispatch => {
		const companies = [...store.getState().companies.list];
		await client.mutate({
			mutation: setCompanyAsSelected,
			variables: {
				userId: store.getState().user.id,
				companyId: !!id? id: companies[index].id
			}
		});
		//dispatch());
		dispatch({
			type: "CHANGE_SELECTED",
			value: index
		});
	};
};