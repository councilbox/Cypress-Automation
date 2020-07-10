import React from 'react';
import { TableCell, TableRow } from "material-ui/Table";
import { Tooltip, Card } from "material-ui";
import { getSecondary } from "../../../../styles/colors";
import * as CBX from "../../../../utils/CBX";
import {
	BasicButton,
	ButtonIcon,
	LoadingSection,
	EnhancedTable,
	Grid,
	GridItem
} from "../../../../displayComponents";
import { compose, graphql, withApollo } from "react-apollo";
import { downloadCBXData, updateConveneSends } from "../../../../queries";
import { convenedcouncilParticipants } from "../../../../queries/councilParticipant";
import { PARTICIPANTS_LIMITS, PARTICIPANT_STATES, PARTICIPANT_TYPE } from "../../../../constants";
import { isMobile } from "../../../../utils/screen";
import { useOldState, usePolling } from "../../../../hooks";
import AttendIntentionIcon from '../../../council/live/participants/AttendIntentionIcon';
import DownloadCBXDataButton from '../../../council/prepare/DownloadCBXDataButton';
import NotificationFilters from '../../../council/prepare/NotificationFilters';
import AddConvenedParticipantButton from '../../../council/prepare/modals/AddConvenedParticipantButton';
import AttendComment from '../../../council/prepare/modals/AttendComment';
import ConvenedParticipantEditor from '../../../council/prepare/modals/ConvenedParticipantEditor';
import gql from 'graphql-tag';
import StateIcon from '../../../council/live/participants/StateIcon';





const CouncilDetailsParticipants = ({ client, translate, council, participations, hideNotifications, hideAddParticipant, ...props }) => {
	const [filters, setFilters] = React.useState({
		options: {
			limit: PARTICIPANTS_LIMITS[0],
			//page: 1,
			offset: 0,
			orderBy: 'name',
			orderDirection: 'asc',
		},
		filters: [],
		attendanceIntention: null,
		notificationStatus: null,
		intentionFilter: null
	});
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [refreshing, setRefreshing] = React.useState(false);
	const [state, setState] = useOldState({
		editingParticipant: false,
		participant: {},
		loadingRefresh: false,
		showCommentModal: false,
		showComment: '',
	});
	const table = React.useRef();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: convenedcouncilParticipants,
			variables: {
				councilId: council.id,
				notificationStatus: filters.notificationStatus,
				attendanceIntention: filters.attendanceIntention,
				options: filters.options,
				filters: filters.filters
			}
		});
		setData(response.data);
		console.log(response.data)
		setLoading(false);
	}, [council.id, filters])

	React.useEffect(() => {
		getData();
	}, [getData]);

	usePolling(getData, 9000);

	React.useEffect(() => {
		//refreshEmailStates();
	}, [council.id]);


	const refreshEmailStates = async () => {
		setRefreshing(true);
		const response = await props.updateConveneSends({
			variables: {
				councilId: council.id
			}
		});

		if (response.data.updateConveneSends.success) {
			getData();
			setRefreshing(false);
		}
	};

	const closeParticipantEditor = () => {
		getData();
		setState({ editingParticipant: false });
	};

	const updateNotificationFilter = object => {
		setFilters({
			...filters,
			...object
		});
	}

	const updateFilters = object => {
		setFilters({
			...filters,
			...object
		})
	}

	const resetPage = () => {
		table.current.setPage(filters.page);
	}

	const showModalComment = comment => event => {
		event.stopPropagation();
		setState({
			showCommentModal: true,
			showComment: comment
		})
	}

	if (loading) {
		return <LoadingSection />
	}

	const refetch = getData;
	const councilParticipants = data.councilParticipantsWithNotifications;
	const { participant, editingParticipant } = state;

	let headers = [
		{
			text: translate.state,
			name: "name",
			canOrder: false
		},
		{
			text: translate.name,
			name: "name",
			canOrder: true
		},
		{
			text: translate.dni,
			name: "dni",
			canOrder: true
		},
		{ text: translate.position },
		{
			text: translate.votes,
			name: "numParticipations",
			canOrder: true
		}
	];

	if (participations) {
		headers.push({
			text: translate.census_type_social_capital,
			name: "socialCapital",
			canOrder: true
		});
	}

	if (CBX.councilIsNotified(council)) {
		if (!hideNotifications) {
			headers.push({
				text: translate.convene
			});
			if (CBX.councilHasAssistanceConfirmation(council)) {
				headers.push({
					text: translate.assistance_intention
				});
			}
		}
	}

	headers.push({ text: '' });
	if (CBX.councilHasAssistanceConfirmation(council)) {
		headers.push({ text: '' });
	}
	headers.push({ text: '' });


	return (
		<div style={{ width: "100%", height: '100%', padding: "1em" }}>
			<React.Fragment>
				<Grid style={{ margin: "0.5em 0" }}>
					<GridItem xs={12} lg={6} md={6}>
						{!hideNotifications &&
							<NotificationFilters
								translate={translate}
								refetch={updateNotificationFilter}
								council={council}
							/>
						}
					</GridItem>
				</Grid>
				{!!councilParticipants ?
					<EnhancedTable
						ref={table}
						translate={translate}
						menuButtons={
							<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '0.3em' }}>
								{!hideNotifications &&
									<Tooltip
										title={
											translate.tooltip_refresh_convene_email_state_assistance
										}
									>
										<div>
											<BasicButton
												floatRight
												text={translate.refresh_convened}
												color={getSecondary()}
												loading={refreshing}
												buttonStyle={{
													margin: "0",
													marginRight: '1.2em'
												}}
												textStyle={{
													color: "white",
													fontWeight: "700",
													fontSize: "0.9em",
													textTransform: "none"
												}}
												icon={
													<ButtonIcon
														color="white"
														type="refresh"
													/>
												}
												textPosition="after"
												onClick={refreshEmailStates}
											/>
										</div>
									</Tooltip>
								}
								{!hideAddParticipant &&
									<div>
										<AddConvenedParticipantButton
											participations={participations}
											translate={translate}
											councilId={council.id}
											council={council}
											refetch={refetch}
										/>
									</div>
								}
							</div>
						}
						defaultLimit={filters.options.limit}
						defaultFilter={"fullName"}
						defaultOrder={["name", "asc"]}
						limits={PARTICIPANTS_LIMITS}
						page={filters.page}
						loading={loading}
						length={councilParticipants.list.length}
						total={councilParticipants.total}
						refetch={updateFilters}
						headers={headers}
					>
						{councilParticipants.list.map(
							item => {
								let participant = formatParticipant(item);
								return (
									<React.Fragment
										key={`participant${participant.id}_${filters.notificationStatus}`}
									>
										<HoverableRow
											translate={translate}
											participant={participant}
											representative={participant.representative}
											showModalComment={showModalComment}
											cbxData={false}
											participations={participations}
											editParticipant={() => {
												!props.cantEdit &&
													setState({
														editingParticipant: true,
														participant
													})
											}}
											council={council}
											totalVotes={data.councilTotalVotes}
											socialCapital={data.councilSocialCapital}
											{...props}
										/>
									</React.Fragment>
								);
							}
						)}
					</EnhancedTable>
					:
					<div
						style={{
							height: '10em',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<LoadingSection />
					</div>
				}
				{editingParticipant &&
					<ConvenedParticipantEditor
						key={participant.id}
						translate={translate}
						close={closeParticipantEditor}
						councilId={council.id}
						council={council}
						participations={participations}
						participant={participant}
						opened={editingParticipant}
						refetch={refetch}
					/>
				}
				<AttendComment
					requestClose={() => setState({
						showCommentModal: false,
						showComment: false
					})}
					open={state.showCommentModal}
					comment={state.showComment}
					translate={translate}
				/>
			</React.Fragment>
			{props.children}
		</div>
	);
}

const HoverableRow = ({ translate, participant, hideNotifications, totalVotes, socialCapital, council, editParticipant, representative, ...props }) => {
	const [showActions, setShowActions] = React.useState(false);
	const mouseEnterHandler = () => {
		setShowActions(true)
	}

	const mouseLeaveHandler = () => {
		setShowActions(false)
	}

	const { delegate } = participant;
	let { notifications } = participant.type === PARTICIPANT_TYPE.PARTICIPANT ? participant : participant.representatives.length > 0 ? representative : participant;

	notifications = [...notifications].sort((a, b) => {
		if (a.sendDate > b.sendDate) {
			return -1;
		}

		if ((b.sendDate > a.sendDate) || a.reqCode === 25) {
			return 1;
		}

		return 0;
	});

	const voteParticipantInfo = (
		participant.live.state === PARTICIPANT_STATES.DELEGATED ?
			<React.Fragment>
				<br />
				{`${translate.delegated_in}: ${delegate.name} ${delegate.surname || ''}`}
			</React.Fragment>
			:
			!!representative &&
			<React.Fragment>
				<br />
				{`${translate.represented_by}: ${representative.name} ${representative.surname || ''}`}
			</React.Fragment>
	);

	if (isMobile) {
		return (
			<Card
				style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
				onClick={editParticipant}
			>
				<Grid>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.participant_data}
					</GridItem>
					<GridItem xs={7} md={7}>
						<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''} ${
							!!representative ? ` - ${translate.represented_by}: ${representative.name} ${representative.surname || ''}` : ''}`}</span>
						{voteParticipantInfo}
					</GridItem>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.dni}
					</GridItem>
					<GridItem xs={7} md={7}>
						{!!representative ?
							<React.Fragment>
								{representative.dni}
							</React.Fragment>
							:
							participant.dni
						}
					</GridItem>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.position}
					</GridItem>
					<GridItem xs={7} md={7}>
						{!!representative ?
							<React.Fragment>
								{representative.position}
							</React.Fragment>
							:
							participant.position
						}
					</GridItem>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.votes}
					</GridItem>
					<GridItem xs={7} md={7}>
						{!CBX.isRepresentative(participant) ?
							`${
							participant.numParticipations
							} (${participant.numParticipations > 0 ? (
								(participant.numParticipations /
									totalVotes) *
								100
							).toFixed(2) : 0}%)`
							:
							`${
							participant.representing.numParticipations
							} (${participant.representing.numParticipations > 0 ? (
								(participant.representing.numParticipations /
									totalVotes) *
								100
							).toFixed(2) : 0}%)`
						}
					</GridItem>
					{props.participations && (
						<React.Fragment>
							<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
								{translate.census_type_social_capital}
							</GridItem>
							<GridItem xs={7} md={7}>
								{!CBX.isRepresentative(participant) &&
									`${participant.socialCapital} (${participant.socialCapital > 0 ? (
										(participant.socialCapital /
											socialCapital) *
										100).toFixed(2) : 0}%)`
								}

							</GridItem>
						</React.Fragment>
					)}
				</Grid>
				<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
					<DownloadCBXDataButton
						translate={translate}
						participantId={participant.live.id}
					/>
				</div>
			</Card>
		)
	}

	return (
		<TableRow
			hover
			onMouseOver={mouseEnterHandler}
			onMouseLeave={mouseLeaveHandler}
			onClick={editParticipant}
			style={{
				cursor: "pointer",
				height: "7em"
			}}
		>
			<TableCell>
				{voteParticipantInfo ?
					<div>
						<StateIcon state={participant.live.state} translate={translate} ratio={1.4} />
						<StateIcon state={participant.live.state} translate={translate} ratio={1.4} />
					</div>
					:
					<StateIcon state={participant.live.state} translate={translate} ratio={1.4} />
				}
			</TableCell>
			<TableCell>
				<span style={{ fontWeight: '700', height: "31px" }}>
					{`${participant.name} ${participant.surname}
					  ${(participant.live.state === PARTICIPANT_STATES.DELEGATED &&
							participant.representatives.length > 0) ? ` - ${translate.represented_by}: ${
							participant.representatives[0].name} ${
							participant.representatives[0].surname || ''}` : ''}`}
				</span>
				{voteParticipantInfo &&
					<div style={{ height: "31px" }}>{voteParticipantInfo}</div>
				}
			</TableCell>
			<TableCell>
				{participant.dni}
				{!!representative &&
					<React.Fragment>
						<br />
						{representative.dni}
					</React.Fragment>
				}
			</TableCell>
			<TableCell>
				<div style={{ height: "31px" }}>
					{participant.position}
				</div>
				<div style={{ height: "31px" }}>
					{!!representative &&
						<React.Fragment>
							<br />
							{representative.position}
						</React.Fragment>
					}
				</div>
			</TableCell>
			<TableCell>
				{`${
					participant.numParticipations
					} (${participant.numParticipations > 0 ? (
						(participant.numParticipations /
							totalVotes) *
						100
					).toFixed(2) : 0}%)`}
				{!!representative &&
					<React.Fragment>
						<br />
					</React.Fragment>
				}
			</TableCell>
			{props.participations && (
				<TableCell>
					{`${
						participant.socialCapital
						} (${participant.socialCapital > 0 ?
							((participant.socialCapital / socialCapital) * 100).toFixed(2)
							:
							0
						}%)`}
					{!!representative &&
						<React.Fragment>
							<br />
						</React.Fragment>
					}
				</TableCell>
			)}

			{props.cbxData &&
				<TableCell>
					<div style={{ width: '4em' }}>
						{showActions &&
							<DownloadCBXDataButton
								translate={translate}
								participantId={participant.live.id}
							/>
						}
					</div>
				</TableCell>

			}

			{!hideNotifications &&
				<React.Fragment>
					<TableCell>

						{notifications
							.length > 0 ? (
								<Tooltip
									title={
										translate[
										CBX.getTranslationReqCode(
											notifications[0].reqCode
										)
										]
									}
								>
									<img
										style={{
											height:
												"2.1em",
											width:
												"auto"
										}}
										src={CBX.getEmailIconByReqCode(
											notifications[0].reqCode
										)}
										alt="email-state-icon"
									/>
								</Tooltip>
							) : (
								""
							)}
					</TableCell>
					{CBX.councilHasAssistanceConfirmation(council) &&
						(
							<TableCell>
								<AttendIntentionIcon
									participant={participant.live}
									representative={participant.representatives.length > 0 ? participant.representative.live : null}
									council={council}
									showCommentIcon={participant.representatives.length > 0 ? !!participant.representative.live.assistanceComment : !!participant.live.assistanceComment}
									onCommentClick={props.showModalComment({
										text: participant.representatives.length > 0 ? participant.representative.live.assistanceComment : participant.live.assistanceComment,
										author: participant.representatives.length > 0 ?
											`${participant.name} ${participant.surname || ''} - ${translate.represented_by} ${representative.name} ${representative.surname || ''}`
											:
											`${participant.name} ${participant.surname || ''}`
									})}
									translate={translate}
									size="2em"
								/>
							</TableCell>
						)}
					<TableCell>
						asd
					</TableCell>
				</React.Fragment>
			}
		</TableRow>
	)

}

const formatParticipant = participant => {
	let { representing, ...newParticipant } = participant;

	if (participant.representatives.length > 0) {
		newParticipant = {
			...newParticipant,
			representative: participant.representatives[0]
		}
	}

	if (participant.live.state === PARTICIPANT_STATES.DELEGATED) {
		newParticipant = {
			...newParticipant,
			delegate: participant.live.representative
		}
	}
	return newParticipant;
}

const applyFilters = (participants, filters) => {

	return applyOrder(participants.filter(item => {
		const participant = formatParticipant(item);
		if (filters.text) {
			const unaccentedText = CBX.unaccent(filters.text.toLowerCase());

			if (filters.field === 'fullName') {
				const fullName = `${participant.name} ${participant.surname || ''}`;
				let repreName = '';
				if (participant.representative) {
					repreName = `${participant.representative.name} ${participant.representative.surname || ''}`;
				}
				if (!CBX.unaccent(fullName.toLowerCase()).includes(unaccentedText)
					&& !CBX.unaccent(repreName.toLowerCase()).includes(unaccentedText)) {
					return false;
				}
			}

			if (filters.field === 'position') {
				if (participant.representative) {
					if (!CBX.unaccent(participant.position.toLowerCase()).includes(unaccentedText) &&
						!CBX.unaccent(participant.representative.position.toLowerCase()).includes(unaccentedText)) {
						return false;
					}
				} else {
					if (!CBX.unaccent(participant.position.toLowerCase()).includes(unaccentedText)) {
						return false;
					}
				}
			}

			if (filters.field === 'dni') {
				if (participant.representative) {
					if (!CBX.unaccent(participant.dni.toLowerCase()).includes(unaccentedText) &&
						!CBX.unaccent(participant.representative.dni.toLowerCase()).includes(unaccentedText)) {
						return false;
					}
				} else {
					if (!CBX.unaccent(participant.dni.toLowerCase()).includes(unaccentedText)) {
						return false;
					}
				}
			}
		}

		if (filters.notificationStatus) {
			if (participant.representative) {
				if (participant.representative.notifications[0].reqCode !== filters.notificationStatus) {
					return false;
				}
			} else {
				if (participant.notifications[0].reqCode !== filters.notificationStatus) {
					return false;
				}
			}
		}

		return true;
	}), filters.orderBy, filters.orderDirection);
}

const applyOrder = (participants, orderBy, orderDirection) => {
	return participants.sort((a, b) => {
		let participantA = formatParticipant(a);
		let participantB = formatParticipant(b);
		return participantA[orderBy] > participantB[orderBy]
	});
}

export default compose(
	graphql(updateConveneSends, {
		name: "updateConveneSends"
	}),
	graphql(downloadCBXData, {
		name: "downloadCBXData"
	}),
	withApollo
)(CouncilDetailsParticipants);