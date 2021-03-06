import React from 'react';
import { AlertConfirm, Grid, GridItem } from '../../../displayComponents';
import { buildTagColumns, formatLabelFromName } from '../../../utils/templateTags';
import SelectedTag from '../../company/drafts/draftTags/SelectedTag';
import { getTagColor } from '../../company/drafts/draftTags/utils';
import { isMobile } from '../../../utils/screen';

const DraftDetailsModal = ({
	draft, requestClose, translate, companyStatutes
}) => {
	const TagColumn = props => (
		<div style={{
			display: 'flex',
			color: '#ffffff',
			fontSize: '12px',
			marginBottom: '0.5em ',
			flexDirection: 'column'
		}}>
			{props.children}
		</div>
	);

	const renderDraftDetails = () => {
		const columns = buildTagColumns(draft, formatLabelFromName(companyStatutes, translate));
		const width = window.innerWidth < 950 ? '100%' : '750px';
		return (
			<Grid style={{ width }}>
				<GridItem xs={12} md={12} lg={12}>
					<span style={{ fontWeight: '700' }}>{translate.title}</span>{`: ${draft.title}`}
				</GridItem>
				<GridItem xs={12} lg={12} md={12}>
					<span style={{ fontWeight: '700' }}>{translate.description}</span>{`: ${draft.description}`}
				</GridItem>
				<GridItem xs={12} lg={12} md={12}>
					<div style={{ display: isMobile ? '' : 'flex' }}>
						{Object.keys(columns).map((key, index) => (
							<TagColumn key={`column_${index}`}>
								{columns[key].map(tag => (
									<SelectedTag
										key={`tag_${tag.label}`}
										text={translate[tag.label] || tag.label}
										color={getTagColor(key)}
										action={() => { }}
										props={{}}
									/>
								))}
							</TagColumn>
						))}
					</div>
				</GridItem>
				<GridItem xs={11} lg={12} md={12}>
					<div dangerouslySetInnerHTML={{
						__html: draft.text
					}} />
				</GridItem>
			</Grid>
		);
	};

	return (
		<AlertConfirm
			requestClose={requestClose}
			open={!!draft}
			fullWidth={false}
			modal={false}
			buttonCancel={translate.cancel}
			bodyText={draft ? renderDraftDetails() : <span />}
			title={translate.draft_details}
		/>
	);
};

export default DraftDetailsModal;
