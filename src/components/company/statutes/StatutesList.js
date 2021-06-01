import React from 'react';
import { withApollo } from 'react-apollo';
import { deleteStatute as deleteStatuteMutation, } from '../../../queries';
import { TableCell, TableRow, Tooltip } from 'material-ui';
import { AlertConfirm, CloseIcon, EnhancedTable } from '../../../displayComponents';
import { client, moment } from '../../../containers/App';
import { getPrimary } from '../../../styles/colors';
import StatuteNameEditor from './StatuteNameEditor';


const StatutesList = ({ statutes, translate, refetch, company }) => {
	const [deleteId, setDeleteId] = React.useState(null);
	const [editName, setEditName] = React.useState(null);
	const primary = getPrimary();

	const deleteStatute = async () => {
		const response = await client.mutate({
			mutation: deleteStatuteMutation,
			variables: {
				statuteId: deleteId
			}
		});
		if (response) {
			refetch();
			setDeleteId(null);
		}
	};

	return (
		<>
			<AlertConfirm
				title={translate.attention}
				bodyText={translate.question_delete}
				open={deleteId}
				buttonAccept={translate.delete}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteStatute}
				requestClose={() => setDeleteId(null)}
			/>
			<EnhancedTable
				hideTextFilter={true}
				translate={translate}
				defaultLimit={10000}
				defaultFilter={'title'}
				// limits={DRAFTS_LIMITS}
				page={1}
				loading={false}
				length={statutes.length}
				total={statutes.length}
				selectedCategories={[{
					field: 'type',
					value: 'all',
					label: translate.all_plural
				}]}
				refetch={refetch}
				headers={[
					{
						text: translate.name,
						name: 'title',
					},
					{
						name: '',
						text: translate.last_edit
					},
					{
						name: '',
						text: ''
					}
				]}
				//companyID={company.id}
			>
				{statutes.map((statute, index) => (
					<TableRow key={statute.id}>
						<TableCell>
							{translate[statute.title]}
						</TableCell>
						<TableCell>
							{statute.lastEdited ? moment(statute.lastEdited).format('LLL') : '-'}
						</TableCell>
						<TableCell>
							<Tooltip title={translate.rename_council_type}>
								<i
									className="fa fa-pencil-square-o"
									aria-hidden="true"
									style={{
										cursor: 'pointer',
										fontSize: '1.8em',
										marginLeft: '0.2em',
										color: primary
									}}
									onClick={event => {
										event.stopPropagation();
										setEditName(statute);
									}}
								></i>
							</Tooltip>
							<Tooltip title={translate.edit}>
								<i
									className="fa fa-list-alt"
									aria-hidden="true"
									style={{
										cursor: 'pointer',
										fontSize: '1.8em',
										marginLeft: '0.2em',
										color: primary
									}}
									onClick={event => {
										event.stopPropagation();
										this.props.updateState({
											editId: statute.id
										});
									}}
								></i>
							</Tooltip>
							<Tooltip title={translate.delete}>
								<span>
									<CloseIcon
										id="statute-delete-button"
										style={{
											color: primary,
											marginTop: '-10px'
										}}
										onClick={event => {
											event.stopPropagation();
											setDeleteId(statute.id);
										}}
									/>
								</span>
							</Tooltip>
						</TableCell>
					</TableRow>
				))}
			</EnhancedTable>
			{editName &&
				<StatuteNameEditor
					requestClose={() => setEditName(null)}
					key={editName.id}
					statute={editName}
					translate={translate}
					refetch={refetch}
				/>
			}
		</>
	);
};

export default withApollo(StatutesList);
