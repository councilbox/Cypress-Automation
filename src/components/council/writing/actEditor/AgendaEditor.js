import React from 'react';
import { toast } from 'react-toastify';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import {
	Grid, GridItem, TabsScreen, BasicButton, LiveToast
} from '../../../../displayComponents';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import AgendaRecount from '../../agendas/AgendaRecount';
import { AGENDA_TYPES, DRAFT_TYPES } from '../../../../constants';
import VotingsTableFiltersContainer from '../../live/voting/VotingsTableFiltersContainer';
import CommentsTable from '../../live/comments/CommentsTable';
import {
	checkForUnclosedBraces, changeVariablesToValues, hasParticipations, isCustomPoint, cleanAgendaObject, generateStatuteTag, isConfirmationRequest
} from '../../../../utils/CBX';
import LoadDraft from '../../../company/drafts/LoadDraft';
import AgendaDescriptionModal from '../../live/AgendaDescriptionModal';
import { updateAgenda as updateAgendaMutation } from '../../../../queries/agenda';
import CustomAgendaRecount from '../../live/voting/CustomAgendaRecount';
import { agendaRecountQuery } from '../../live/ActAgreements';
import { useOldState } from '../../../../hooks';
import { moment } from '../../../../containers/App';
import ConfirmationRequestRecount from '../../agendas/ConfirmationRequestRecount';


const AgendaEditor = ({
	agenda, agendaData, error, recount, readOnly, majorityTypes, typeText, data, company, translate, council, ...props
}) => {
	const [comment, setComment] = React.useState(agenda.comment);
	const editor = React.useRef();
	const [state, setState] = useOldState({
		loadDraft: false,
		draftType: ''
	});
	const secondary = getSecondary();
	const primary = getPrimary();

	const updateAgenda = React.useCallback(async () => {
		if (!checkForUnclosedBraces(comment)) {
			await props.updateAgenda({
				variables: {
					agenda: {
						...cleanAgendaObject(agenda),
						comment,
						councilId: council.id
					}
				}
			});
			props.updateCouncilAct();
		} else {
			toast(
				<LiveToast
					id="error-toast"
					message={translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
		}
	});

	React.useEffect(() => {
		let timeout;
		if (comment !== agenda.comment) {
			timeout = setTimeout(updateAgenda, 500);
		}
		return () => clearTimeout(timeout);
	}, [comment]);

	const update = () => {
		props.refetch();
	};

	const loadDraft = async draft => {
		const {
			numPositive, numNegative, numAbstention, numNoVote
		} = agendaData.agendaRecount;
		const { positiveSC, negativeSC, abstentionSC } = agendaData.agendaRecount;
		const participations = hasParticipations(council);
		const totalPresent = agenda.socialCapitalPresent + agenda.socialCapitalCurrentRemote;

		const correctedText = await changeVariablesToValues(draft.text, {
			company,
			council,
			votings: {
				positive: agenda.positiveVotings + agenda.positiveManual,
				negative: agenda.negativeVotings + agenda.negativeManual,
				abstention: agenda.abstentionVotings + agenda.abstentionManual,
				noVoteTotal: agenda.noVoteVotings + agenda.noVoteManual,
				SCFavorTotal: participations ? `${((positiveSC / recount.partTotal) * 100).toFixed(3)}%` : 'VOTACIÓN SIN CAPITAL SOCIAL', // TRADUCCION
				SCAgainstTotal: participations ? `${((negativeSC / recount.partTotal) * 100).toFixed(3)}%` : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCAbstentionTotal: participations ? `${((abstentionSC / recount.partTotal) * 100).toFixed(3)}%` : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCFavorPresent: participations ? `${((positiveSC / totalPresent) * 100).toFixed(3)}%` : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCAgainstPresent: participations ? `${((negativeSC / totalPresent) * 100).toFixed(3)}%` : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCAbstentionPresent: participations ? `${((abstentionSC / totalPresent) * 100).toFixed(3)}%` : 'VOTACIÓN SIN CAPITAL SOCIAL',
				numPositive,
				numNegative,
				numAbstention,
				numNoVote
			}
		}, translate);

		editor.current.paste(correctedText);
		setState({
			loadDraft: false
		});
	};


	if (agendaData.loading) {
		return <span />;
	}
	const tabs = [];
	const {
		numPositive, numNegative, numAbstention, numNoVote
	} = agendaData.agendaRecount;
	const { positiveSC, negativeSC, abstentionSC } = agendaData.agendaRecount;
	const participations = hasParticipations(council);
	const totalPresent = agenda.socialCapitalPresent + agenda.socialCapitalRemote;

	const tags = [
		{
			value: numPositive,
			label: translate.num_positive
		},
		{
			value: numNegative,
			label: translate.num_negative
		},
		{
			getValue: () => moment().format('LLL'),
			label: translate.actual_date
		},
		{
			value: numAbstention,
			label: translate.num_abstention
		},
		{
			value: numNoVote,
			label: translate.num_no_vote
		},
	];

	if (participations) {
		tags.push({
			value: `${((positiveSC / recount.partTotal) * 100).toFixed(3)}%`,
			label: '% a favor / total capital social'
		},
		{
			value: `${((negativeSC / recount.partTotal) * 100).toFixed(3)}%`,
			label: '% en contra / total capital social'
		},
		{
			value: `${((abstentionSC / recount.partTotal) * 100).toFixed(3)}%`,
			label: '% abstención / total capital social'
		},
		{
			value: `${((positiveSC / totalPresent) * 100).toFixed(3)}%`,
			label: '% a favor / capital social presente'
		},
		{
			value: `${((negativeSC / totalPresent) * 100).toFixed(3)}%`,
			label: '% en contra / capital social presente'
		},
		{
			value: `${((abstentionSC / totalPresent) * 100).toFixed(3)}%`,
			label: '% abstención / capital social presente'
		});
	} else {
		tags.push({
			value: `${agenda.positiveVotings + agenda.positiveManual} `,
			label: translate.positive_votings
		},
		{
			value: `${agenda.negativeVotings + agenda.negativeManual} `,
			label: translate.negative_votings
		});
	}


	if (!readOnly) {
		tabs.push({
			text: translate.comments_and_agreements,
			component: () => (
				<div style={{ padding: '1em' }}>
					<RichTextInput
						ref={editor}
						translate={translate}
						type="text"
						errorText={error}
						loadDraft={
							<BasicButton
								text={translate.load_draft}
								color={secondary}
								textStyle={{
									color: 'white',
									fontWeight: '600',
									fontSize: '0.8em',
									textTransform: 'none',
									marginLeft: '0.4em',
									minHeight: 0,
									lineHeight: '1em'
								}}
								textPosition="after"
								onClick={() => setState({
									loadDraft: true,
									draftType: DRAFT_TYPES.COMMENTS_AND_AGREEMENTS
								})
								}
							/>
						}
						tags={tags}
						value={agenda.comment || ''}
						onChange={value => {
							if (value !== agenda.comment) {
								setComment(value);
							}
						}}
					/>
				</div>
			)
		});
	}

	tabs.push({
		text: translate.act_comments,
		component: () => (
			<div style={{ minHeight: '8em', padding: '1em', paddingBottom: '1.4em' }}>
				<CommentsTable
					translate={translate}
					agenda={agenda}
					council={council}
				/>
			</div>
		)
	});

	if (agenda.subjectType !== AGENDA_TYPES.INFORMATIVE) {
		tabs.push({
			text: isConfirmationRequest(agenda.subjectType) ? translate.answers : translate.voting,
			component: () => (
				<div style={{ minHeight: '8em', padding: '1em' }}>
					{isCustomPoint(agenda.subjectType)
						&& <CustomAgendaRecount
							agenda={agenda}
							company={company}
							translate={translate}
							council={council}
						/>
					}
					{isConfirmationRequest(agenda.subjectType) ?
						<ConfirmationRequestRecount
							agenda={agenda}
							council={council}
							translate={translate}
							recount={recount}
							majorityTypes={majorityTypes}
						/>
						: <AgendaRecount
							agenda={agenda}
							council={council}
							translate={translate}
							recount={recount}
							majorityTypes={majorityTypes}
						/>
					}
					<VotingsTableFiltersContainer
						translate={translate}
						hideStatus
						council={council}
						recount={recount}
						agenda={agenda}
					/>
				</div>
			)
		});
	}

	return (
		<div
			style={{
				width: '100%',
				margin: '0.6em 0',
			}}
		>
			<Grid spacing={16} style={{ marginBottom: '1em' }}>
				<GridItem xs={1}
					style={{
						color: primary,
						width: '30px',
						margin: '-0.25em 0',
						fontWeight: '700',
						fontSize: '1.5em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{agenda.orderIndex}
				</GridItem>
				<GridItem xs={9}>
					<div
						style={{
							fontWeight: '600',
							fontSize: '1.1em',
							marginBottom: '1em'
						}}
					>
						{agenda.agendaSubject}
					</div>
					<AgendaDescriptionModal
						agenda={agenda}
						translate={translate}
						council={council}
						companyStatutes={props.statutes}
						majorityTypes={majorityTypes}
						draftTypes={props.draftTypes}
						refetch={update}
					/>
					{agenda.description && (
						<div
							style={{
								width: '100%',
								marginTop: '0.3em',
								fontSize: '0.87rem'
							}}
							dangerouslySetInnerHTML={{ __html: agenda.description }}
						/>
					)}
				</GridItem>
				<GridItem xs={2}>{typeText}</GridItem>
			</Grid>
			<TabsScreen
				uncontrolled={true}
				tabsInfo={tabs}
			/>
			<Dialog
				open={state.loadDraft}
				maxWidth={false}
				onClose={() => setState({ loadDraft: false })}
			>
				<DialogTitle>{translate.load_draft}</DialogTitle>
				<DialogContent style={{ width: '800px' }}>
					<LoadDraft
						translate={translate}
						companyId={company ? company.id : ''}
						loadDraft={loadDraft}
						statute={council.statute}
						statutes={data ? data.companyStatutes : ''}
						defaultTags={
							{
								comments_and_agreements: {
									active: true,
									type: 2,
									name: 'comments_and_agreements',
									label: translate.comments_and_agreements
								},
								...generateStatuteTag(council.statute, translate)
							}}
						draftType={state.draftType}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};


export default compose(
	graphql(agendaRecountQuery, {
		name: 'agendaData',
		options: props => ({
			variables: {
				agendaId: props.agenda.id
			}
		})
	}),
	graphql(updateAgendaMutation, {
		name: 'updateAgenda'
	})
)(AgendaEditor);
