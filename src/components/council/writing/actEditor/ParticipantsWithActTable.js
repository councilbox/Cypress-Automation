import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { TableRow, TableCell, Tooltip } from 'material-ui';
import gql from 'graphql-tag';
import { councilParticipantsWithActSends } from '../../../../queries';
import { LoadingSection, EnhancedTable, RefreshButton } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import * as CBX from '../../../../utils/CBX';
import AttendIntentionIcon from '../../live/participants/AttendIntentionIcon';
import DownloadCBXDataButton from '../../prepare/DownloadCBXDataButton';


const updateActSends = gql`
	mutation updateActSends($councilId: Int!){
		updateActSends(councilId: $councilId){
			success
			message
		}
	}
`;


class ParticipantsWithActTable extends React.Component {
	async componentDidMount() {
		this.refreshEmails();
	}

	refreshEmails = async () => {
		await this.props.updateActSends({
			variables: {
				councilId: this.props.council.id
			}
		});
		this.props.data.refetch();
	}

	render() {
		const { translate, council } = this.props;

		return (
			<div>
				<div style={{ width: '3em' }}>
					<RefreshButton
						id="refresh-act-sends-button"
						translate={translate}
						tooltip={translate.refresh_emails}
						onClick={this.refreshEmails}
					/>
				</div>
				<EnhancedTable
					ref={table => { this.table = table; }}
					translate={translate}
					defaultLimit={PARTICIPANTS_LIMITS[0]}
					defaultFilter={'fullName'}
					hideTextFilter={true}
					defaultOrder={['name', 'asc']}
					limits={PARTICIPANTS_LIMITS}
					page={1}
					loading={this.props.data.loading}
					length={this.props.data.loading ? [] : this.props.data.councilParticipantsWithActSends.list.length}
					total={this.props.data.loading ? [] : this.props.data.councilParticipantsWithActSends.total}
					refetch={this.props.data.refetch}
					headers={[]}
				>
					{this.props.data.loading ?
						<LoadingSection />
						: (
							this.props.data.councilParticipantsWithActSends.list.map(
								(participant, index) => (
									<React.Fragment
										key={`participant${participant.id}`}
									>
										<TableRow
											hover
											onClick={() => this.setState({
												editingParticipant: true,
												participant
											})}
											id={`participant-act-send-${index}`}
											style={{
												cursor: 'pointer'
											}}
										>
											<TableCell>
												{`${participant.name} ${participant.surname || ''}`}
											</TableCell>
											<TableCell>
												{participant.dni}
											</TableCell>
											<TableCell>
												{participant.email}
											</TableCell>
											<TableCell>
												{participant.actNotifications
													.length > 0 ? (
														<Tooltip
															title={
																translate[
																	CBX.getTranslationReqCode(
																		participant
																			.actNotifications[0]
																			.reqCode
																	)
																]
															}
														>
															<img
																style={{
																	height:
																		'2.1em',
																	width:
																		'auto'
																}}
																src={CBX.getEmailIconByReqCode(
																	participant
																		.actNotifications[0]
																		.reqCode
																)}
																alt="email-state-icon"
															/>
														</Tooltip>
													) : (
														''
													)
												}
											</TableCell>
											{CBX.councilHasAssistanceConfirmation(
												council
											) && (
												<TableCell>
													<AttendIntentionIcon
														participant={participant.live}
														translate={translate}
														size="2em"
													/>
												</TableCell>
											)}
											<TableCell>
												<DownloadCBXDataButton
													translate={translate}
													id={`download-cbx-data-${index}`}
													participantId={participant.id}
												/>
											</TableCell>
										</TableRow>
									</React.Fragment>
								)
							)
						)}
				</EnhancedTable>
			</div>
		);
	}
}


export default compose(
	graphql(councilParticipantsWithActSends, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0
				},
				// notificationStatus: 6
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: 'network-only'
		})
	}),
	graphql(updateActSends, {
		name: 'updateActSends'
	})
)(ParticipantsWithActTable);
