import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { TableCell, TableRow } from 'material-ui/Table';
import { councils as councilsQuery, deleteCouncil } from '../../queries';
import {
	AlertConfirm,
	DateWrapper,
	ErrorWrapper,
	LoadingSection,
	MainTitle,
	Table,
	Scrollbar
} from '../../displayComponents/index';
import { getPrimary } from '../../styles/colors';
import TableStyles from '../../styles/table';
import { bHistory } from '../../containers/App';
import CloseIcon from '../../displayComponents/CloseIcon';

class Meetings extends Component {
	renderDeleteIcon = meetingID => {
		const primary = getPrimary();
		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					event.stopPropagation();
					this.openDeleteModal(meetingID);
				}}
			/>
		);
	};

	openDeleteModal = meetingID => {
		this.setState({
			deleteModal: true,
			meetingToDelete: meetingID
		});
	};

	deleteCouncil = async () => {
		this.props.data.loading = true;
		const response = await this.props.mutate({
			variables: {
				councilId: this.state.meetingToDelete
			}
		});
		if (response) {
			this.props.data.refetch();
			this.setState({
				deleteModal: false
			});
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			deleteModal: false
		};
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		const { translate } = this.props;
		const { councils, loading, error } = this.props.data;

		return (
			<div
				style={{
					height: '100%',
					overflow: 'hidden',
					position: 'relative'
				}}
			>
				<Scrollbar option={{ suppressScrollX: true }}>
					<div style={{ padding: '2em' }}>
						<MainTitle
							icon={this.props.icon}
							title={this.props.title}
							subtitle={this.props.desc}
						/>
						{loading ? (
							<LoadingSection />
						) : (
							<Fragment>
								{error ? (
									<div>
										{error.graphQLErrors.map((err, index) => (
											<ErrorWrapper
												key={`error_${index}`}
												error={err}
												translate={translate}
											/>
										))}
									</div>
								) : councils.length > 0 ? (
									<Table
										headers={[
											{ name: translate.date_real_start },
											{ name: translate.name },
											{ name: translate.delete }
										]}
										action={this.renderDeleteIcon}
										companyID={this.props.company.id}
									>
										{councils.map(meeting => (
											<TableRow
												hover
												style={TableStyles.ROW}
												key={`meeting${meeting.id}`}
												onClick={() => {
													bHistory.push(
														`/company/${this.props
															.company.id
														}/meeting/${meeting.id
														}${this.props.link}`
													);
												}}
											>
												<TableCell
													style={TableStyles.TD}
												>
													<DateWrapper
														format="DD/MM/YYYY HH:mm"
														date={
															meeting.dateStart
														}
													/>
												</TableCell>
												<TableCell
													style={{
														...TableStyles.TD,
														width: '65%'
													}}
												>
													{meeting.name
														|| translate.dashboard_new}
												</TableCell>
												<TableCell
													style={TableStyles.TD}
												>
													{this.renderDeleteIcon(
														meeting.id
													)}
												</TableCell>
											</TableRow>
										))}
									</Table>
								) : (
									<span>{translate.no_results}</span>
								)}

								<AlertConfirm
									title={translate.send_to_trash}
									bodyText={translate.send_to_trash_desc}
									open={this.state.deleteModal}
									buttonAccept={translate.send_to_trash}
									buttonCancel={translate.cancel}
									modal={true}
									acceptAction={this.deleteCouncil}
									requestClose={() => this.setState({ deleteModal: false })
									}
								/>
							</Fragment>
						)}
					</div>
				</Scrollbar>
			</div>
		);
	}
}

export default compose(
	graphql(deleteCouncil),
	graphql(councilsQuery, {
		name: 'data',
		options: props => ({
			variables: {
				state: props.state,
				companyId: props.company.id,
				isMeeting: true,
				active: 1
			}
		})
	})
)(Meetings);
