import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Scrollbar } from '../../../../displayComponents';
import ActConvenedParticipants from './ActConvenedParticipants';
import ActAttendantsTable from './ActAttendantsTable';
import ActEditor from './ActEditor';
import withSharedProps from '../../../../HOCs/withSharedProps';
import Convene from '../../convene/Convene';
import SendActPage from './SendActPage';
import ActAttachments from './ActAttachments';
import AgendaTab from './AgendaTab';
import RecordingsSection from '../recordings/RecordingsSection';
import ActHTMLTab from '../actViewer/ActHTMLTab';
import EvidencesPage from '../evindences/EvidencesPage';
import { ConfigContext } from '../../../../containers/AppControl';
import { COUNCIL_STATES } from '../../../../constants';
import DelegationDocuments from './DelegationDocuments';
import NavigationHeader from './NavigationHeader';
import VoteLetters from './VoteLetters';
import Results from './Results';
import { hasParticipations } from '../../../../utils/CBX';
import CommenWallList from './CommenWallList';
import CouncilSurveyRecounts from './CouncilSurveyRecounts';


const ActEditorPage = ({
	council, translate, withoutAct, ...props
}) => {
	const [state, setState] = React.useState({
		participants: false,
		sendReminder: false,
		sendConvene: false,
		cancel: false,
		tab: withoutAct ? 'agenda' : 'editor',
		rescheduleCouncil: false,
		infoMenu: false
	});

	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		if (state.infoMenu && council.state > COUNCIL_STATES.FINISHED) {
			setState({
				...state,
				infoMenu: false
			});
		}
	}, [council.state]);

	let tabs = [];

	if (withoutAct) {
		tabs = [
			{
				label: translate.wizard_agenda,
				value: 'agenda',
				component: () => (
					<AgendaTab
						council={council}
						translate={translate}
						data={{ ...props }}
					/>
				)
			}
		];
	} else {
		tabs.push({
			label: translate.act,
			value: 'editor',
			persistent: true,
			component: () => (
				props.confirmed ?
					<div style={{ height: '100%' }}>
						<div style={{ height: 'calc(100%)', overflow: 'hidden', position: 'relative' }}>
							<Scrollbar>
								<div style={{ padding: '1.5em', overflow: 'hidden', position: 'relative' }}>
									<ActHTMLTab council={council} translate={translate} company={props.company} />
								</div>
							</Scrollbar>
						</div>
					</div>
					: <div style={{ height: '100%' }}>
						<ActEditor
							translate={translate}
							councilID={council.id}
							companyID={props.company.id}
							company={props.company}
							refetch={props.refetch}
						/>
					</div>
			)
		});

		if (props.confirmed) {
			tabs.push({
				label: translate.sending_the_minutes,
				value: 'sendAct',
				component: () => (
					<Scrollbar>
						<SendActPage
							council={council}
							translate={translate}
							refetch={props.refetch}
						/>
					</Scrollbar>
				)
			});
		}

		if (hasParticipations(council)) {
			tabs.push({
				label: translate.results,
				value: 'results',
				persistent: true,
				component: () => (
					<Scrollbar>
						<Results
							council={council}
							agendas={props.agendas}
							recount={props.councilRecount}
							company={props.company}
							translate={translate}
						/>
					</Scrollbar>
				)
			});
		}
	}


	if (council.wallActive === 1) {
		tabs.push({
			label: translate.council_comments,
			value: 'comments',
			component: () => (
				<Scrollbar>
					<CommenWallList
						council={council}
						translate={translate}
						refetch={props.refetch}
					/>
				</Scrollbar>
			)
		});
	}

	if (config.councilSurvey) {
		tabs.push({
			label: translate.survey,
			value: 'survey',
			component: () => (
				<Scrollbar>
					<CouncilSurveyRecounts
						council={council}
						translate={translate}
					/>
				</Scrollbar>
			)
		});
	}

	tabs = [...tabs,
		{
			label: translate.new_list_called,
			value: 'convened',
			component: () => (
				<ActConvenedParticipants
					council={council}
					totalVotes={props.totalVotes}
					socialCapital={props.socialCapital}
					translate={translate}
				/>
			)
		},
		{
			label: translate.show_assistants_list,
			value: 'attendants',
			component: () => (
				<ActAttendantsTable
					council={council}
					translate={translate}
				/>
			)
		},
		{
			label: translate.attachment_files,
			value: 'attachments',
			component: () => (
				<Scrollbar>
					<ActAttachments
						council={council}
						translate={translate}
					/>
				</Scrollbar>
			)
		},
		{
			label: translate.convene,
			value: 'convene',
			component: () => (
				<Scrollbar>
					<div style={{ paddingBottom: '2em' }}>
						<Convene
							council={council}
							hideAttachments
							translate={translate}
						/>
					</div>
				</Scrollbar>
			)
		}
	];

	if (council.councilType === 4) {
		tabs.push({
			label: translate.vote_letters,
			value: 'vote_letters',
			component: () => (
				<TabContainer>
					<Scrollbar>
						<VoteLetters
							council={council}
							hideAttachments
							translate={translate}
						/>
					</Scrollbar>
				</TabContainer>
			)
		});
	}


	if (config.proxies && council.statute.requireProxy === 1) {
		tabs.push({
			label: translate.delegation_proxies,
			value: 'proxies',
			component: () => (
				<TabContainer>
					<Scrollbar>
						<DelegationDocuments
							council={council}
							hideAttachments
							translate={translate}
						/>
					</Scrollbar>
				</TabContainer>
			)
		});
	}

	if (config.evidencesTab) {
		tabs.push({
			label: translate.evidences,
			value: 'evidences',
			component: () => (
				<Scrollbar>
					<EvidencesPage
						council={council}
						totalVotes={props.totalVotes}
						socialCapital={props.socialCapital}
						translate={translate}
					/>
				</Scrollbar>
			)
		});
	}

	tabs.push({
		label: translate.recordings_tab,
		value: 'recordings',
		component: () => (
			<RecordingsSection
				data={props.data}
				council={council}
				translate={translate}
			/>
		)
	});

	return (

		<div style={{ height: '100%', paddingTop: '0px', width: '100%' }}>
			<div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
				<NavigationHeader
					translate={translate}
					active={state.tab}
					setTab={tab => setState({
						...state,
						tab
					})}
					tabs={tabs}
				/>
				{tabs.map(tab => {
					if (tab.persistent) {
						return (
							<div key={`tab_${tab.value}`} style={{ width: '100%', height: state.tab === tab.value ? 'calc(100% - 2em)' : '0', overflow: 'hidden' }}>
								{tab.component()}
							</div>
						);
					}

					if (state.tab === tab.value) {
						return (
							<div key={`tab_${tab.value}`} style={{ width: '100%', height: 'calc(100% - 2em)' }}>
								{tab.component()}
							</div>
						);
					}

					return null;
				})}
			</div>
		</div>

	);
};

const TabContainer = ({ children, style }) => (
	<div style={{ height: 'calc(100% - 40px)', ...style }}>
		{children}
	</div>
);


const recordingsIframe = gql`
	query RecordingsIframe($councilId: Int!){
		recordingsIframe(councilId: $councilId)
	}
`;

export default graphql(recordingsIframe, {
	options: props => ({
		variables: {
			councilId: props.council.id
		}
	})
})(withSharedProps()(ActEditorPage));
