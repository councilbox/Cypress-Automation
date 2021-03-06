import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from 'material-ui/Dialog';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import {
	BasicButton,
	ButtonIcon,
	ErrorWrapper,
	LoadingSection,
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import ParticipantsTable from '../../council/editor/census/ParticipantsTable';
import { councilStepTwo, updateCouncil } from '../../../queries';

class MeetingEditorCensus extends React.Component {
	closeAddParticipantModal = () => {
		this.setState({
			addParticipantModal: false
		});
	};

	saveDraft = () => {
		const {
			__typename,
			participants,
			...council
		} = this.props.data.council;
		this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: this.props.actualStep > 2 ? this.props.actualStep : 2
				}
			}
		});
	};

	handleCensusChange = event => {
		if (event.target.value !== this.props.data.council.selectedCensusId) {
			this.setState({
				censusChangeAlert: true,
				censusChangeId: event.target.value
			});
		}
	};

	nextPage = () => {
		this.saveDraft();
		this.props.nextStep();
	};

	previousPage = () => {
		this.saveDraft();
		this.props.previousStep();
	};

	sendCensusChange = async () => {
		const response = await this.props.mutate({
			variables: {
				censusId: this.state.censusChangeId,
				councilId: this.props.councilID
			}
		});
		if (response) {
			this.setState({
				censusChangeAlert: false
			});
			const newData = await this.props.data.refetch();
			if (newData) {
				this.setState({
					data: {
						...this.state.data,
						...newData.data.council
					}
				});
			}
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			placeModal: false,
			censusChangeAlert: false,
			addParticipantModal: false,
			censusChangeId: '',
			data: {
				censuses: []
			}
		};
	}

	async componentDidMount() {
		this.props.data.refetch();
	}

	renderCensusChangeButtons() {
		const { translate } = this.props;

		return (
			<React.Fragment>
				<BasicButton
					text={translate.cancel}
					color={'white'}
					textStyle={{
						color: getPrimary(),
						fontWeight: '700',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					textPosition="after"
					onClick={() => this.setState({ censusChangeAlert: false })}
					buttonStyle={{ marginRight: '1em' }}
				/>
				<BasicButton
					text={translate.want_census_change}
					color={getPrimary()}
					textStyle={{
						color: 'white',
						fontWeight: '700',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					icon={<ButtonIcon type="save" color="white" />}
					textPosition="after"
					onClick={this.sendCensusChange}
				/>
			</React.Fragment>
		);
	}

	render() {
		const { translate } = this.props;
		const { loading, error } = this.props.data;

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						padding: '2em'
					}}
				>
					<ErrorWrapper error={error} translate={translate} />
				</div>
			);
		}

		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					padding: '2em'
				}}
			>
				<ParticipantsTable
					censuses={this.props.data.censuses}
					handleCensusChange={this.handleCensusChange}
					council={this.props.data.council}
					translate={translate}
					refetch={this.props.data.refetch}
				/>
				<div className="row" style={{ marginTop: '2em' }}>
					<div className="col-lg-12 col-md-12 col-xs-12">
						<div style={{ float: 'right' }}>
							<BasicButton
								text={translate.previous}
								color={getPrimary()}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									fontSize: '0.9em',
									textTransform: 'none'
								}}
								textPosition="after"
								onClick={this.previousPage}
							/>
							<BasicButton
								text={translate.save}
								color={getPrimary()}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									fontSize: '0.9em',
									marginLeft: '0.5em',
									marginRight: '0.5em',
									textTransform: 'none'
								}}
								icon={<ButtonIcon type="save" color="white" />}
								textPosition="after"
								onClick={this.saveDraft}
							/>
							<BasicButton
								text={translate.table_button_next}
								color={getPrimary()}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									fontSize: '0.9em',
									textTransform: 'none'
								}}
								textPosition="after"
								onClick={this.nextPage}
							/>
						</div>
					</div>
				</div>
				<Dialog
					disableBackdropClick={false}
					open={this.state.censusChangeAlert}
					onClose={() => this.setState({ censusChangeAlert: false })}
				>
					<DialogTitle>{translate.census_change}</DialogTitle>
					<DialogContent>
						{translate.census_change_warning.replace('<br/>', '')}
					</DialogContent>
					<DialogActions>
						{this.renderCensusChangeButtons()}
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const changeCensus = gql`
	mutation ChangeCensus($councilId: Int!, $censusId: Int!) {
		changeCensus(councilId: $councilId, censusId: $censusId)
	}
`;

export default compose(
	graphql(councilStepTwo, {
		name: 'data',
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.companyID
			},
			notifyOnNetworkStatusChange: true
		})
	}),

	graphql(changeCensus),

	graphql(updateCouncil, {
		name: 'updateCouncil'
	})
)(withRouter(MeetingEditorCensus));
