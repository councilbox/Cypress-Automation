import React from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';
import CompanyDraftForm from './CompanyDraftForm';
import withTranslations from '../../../HOCs/withTranslations';
import { createCompanyDraft as createCompanyDraftMutation } from '../../../queries/companyDrafts';
import { checkRequiredFields } from '../../../utils/CBX';

const SaveDraftModal = ({ translate, ...props }) => {
	const [data, setData] = React.useState(props.data);
	const [errors, setErrors] = React.useState({});

	const updateState = object => {
		setData({
			...data,
			...object
		});
	};

	const updateErrors = object => {
		setErrors(object);
	};

	const createCompanyDraft = async () => {
		if (!checkRequiredFields(translate, data, updateErrors)) {
			const response = await props.createCompanyDraft({
				variables: {
					draft: {
						title: data.title,
						statuteId: data.statuteId,
						type: data.type,
						description: data.description,
						text: data.text,
						tags: data.tags,
						votationType: data.votationType,
						majorityType: data.majorityType,
						majority: data.majority,
						majorityDivider: data.majorityDivider,
						companyId: props.company.id
					}
				}
			});

			if (!response.errors) {
				props.requestClose();
			}
		}
	};

	const renderNewPointBody = () => (
		<div style={{ width: '800px', height: '60vh' }}>
			<CompanyDraftForm
				translate={translate}
				errors={errors}
				updateState={updateState}
				draft={data}
				companyStatutes={props.companyStatutes}
				draftTypes={props.draftTypes}
				votingTypes={props.votingTypes}
				majorityTypes={props.majorityTypes}
			/>
		</div>
	);

	return (
		<AlertConfirm
			requestClose={props.requestClose}
			open={props.open}
			acceptAction={createCompanyDraft}
			cancelAction={props.requestClose}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			bodyText={renderNewPointBody()}
			title={translate.new_draft}
		/>
	);
};


export default graphql(createCompanyDraftMutation, { name: 'createCompanyDraft' })(
	withTranslations()(SaveDraftModal)
);
