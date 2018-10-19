import React from "react";
import { TableCell, TableRow } from "material-ui/Table";
import { Card } from 'material-ui';
import { getPrimary, getSecondary } from "../../../../styles/colors";
import * as CBX from "../../../../utils/CBX";
import { CloseIcon, EnhancedTable, BasicButton, Checkbox, Grid, GridItem } from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { deleteParticipant } from "../../../../queries/councilParticipant";
import { PARTICIPANTS_LIMITS } from "../../../../constants";
import ChangeCensusMenu from "./ChangeCensusMenu";
import CouncilParticipantEditor from "./modals/CouncilParticipantEditor";
import { isMobile } from 'react-device-detect';


class ParticipantsTable extends React.Component {
	state = {
		editingParticipant: false,
		participant: {},
		selectedIds: new Map()
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	closeParticipantEditor = () => {
		this.setState({ editingParticipant: false });
	};

	select = id => {
        if(this.state.selectedIds.has(id)){
            this.state.selectedIds.delete(id);
        } else {
            this.state.selectedIds.set(id, 'selected');
        }

        this.setState({
            selectedIds: new Map(this.state.selectedIds)
        });
	}

	selectAll = () => {
		const newSelected = new Map();
		if(this.state.selectedIds.size !== this.props.data.councilParticipants.list.length){
			this.props.data.councilParticipants.list.forEach(participant => {
				newSelected.set(participant.id, 'selected');
			})
		}

		this.setState({
			selectedIds: newSelected
		});
	}

	deleteParticipant = async id => {
		let toDelete;
		if(Number.isInteger(id)){
			toDelete = [id];
		} else {
			toDelete = Array.from(this.state.selectedIds.keys());
		}
		const response = await this.props.mutate({
			variables: {
				participantId: toDelete
			}
		});

		if (response) {
			this.setState({
				selectedIds: new Map()
			})
			this.table.refresh();
			this.props.refetch();
		}
	};

	_renderDeleteIcon(participantID) {
		const primary = getPrimary();

		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					event.stopPropagation();
					this.deleteParticipant(participantID);
				}}
			/>
		);
	}

	refresh = async () => {
		this.props.refetch();
	}

	render() {
		const {
			translate,
			totalVotes,
			totalSocialCapital,
			participations,
			council
		} = this.props;
		const { editingParticipant, participant } = this.state;
		const { councilParticipants } = this.props.data;
		let headers = [
			{
				selectAll: <Checkbox onChange={this.selectAll} value={this.state.selectedIds.size > 0 && this.state.selectedIds.size === (councilParticipants.list? councilParticipants.list.length : -1)}/>
			},
			{
				text: translate.participant_data,
				name: "fullName",
				canOrder: true
			},
			{
				text: translate.dni,
				name: "dni",
				canOrder: true
			},
			{
				text: translate.position,
				name: "position",
				canOrder: true
			},
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
		headers.push({ text: '' });

		return (
			<div style={{ width: "100%" }}>
				<ChangeCensusMenu
					translate={translate}
					council={council}
					participations={participations}
					refetch={this.refresh}
					handleCensusChange={this.props.handleCensusChange}
					reloadCensus={this.props.reloadCensus}
					showAddModal={this.props.showAddModal}
					censuses={this.props.censuses}
					totalVotes={this.props.totalVotes}
					totalSocialCapital={this.props.totalSocialCapital}
				/>
				<CouncilParticipantEditor
					translate={translate}
					close={this.closeParticipantEditor}
					councilId={council.id}
					participations={participations}
					participant={participant}
					opened={editingParticipant}
					refetch={this.refresh}
				/>
				{!!councilParticipants && (
					<React.Fragment>
						<EnhancedTable
							ref={table => (this.table = table)}
							translate={translate}
							defaultLimit={PARTICIPANTS_LIMITS[0]}
							defaultFilter={"fullName"}
							defaultOrder={["fullName", "asc"]}
							limits={PARTICIPANTS_LIMITS}
							page={1}
							menuButtons={
								this.state.selectedIds.size > 0 &&
									<BasicButton
										//TRADUCCION
										text={this.state.selectedIds.size === 1? 'Borrar 1 elemento' : `Borrar ${this.state.selectedIds.size} elementos`}
										color={getSecondary()}
										buttonStyle={{marginRight: '0.6em'}}
										textStyle={{color: 'white', fontWeight: '700'}}
										onClick={this.deleteParticipant}
									/>
							}
							loading={!councilParticipants}
							length={councilParticipants.list.length}
							total={councilParticipants.total}
							refetch={this.props.data.refetch}
							action={this._renderDeleteIcon}
							fields={[
								{
									value: "fullName",
									translation: translate.participant_data
								},
								{
									value: "dni",
									translation: translate.dni
								},
								{
									value: "position",
									translation: translate.position
								}
							]}
							headers={headers}
						>
							{councilParticipants.list.map(
								(participant, index) => {
									return (
										<React.Fragment
											key={`participant${participant.id}`}
										>
											<HoverableRow
												participant={participant}
												editParticipant={() => this.setState({
													editingParticipant: true,
													participant: participant
												})}
												select={this.select}
												selected={this.state.selectedIds.has(participant.id)}
												totalSocialCapital={totalSocialCapital}
												totalVotes={totalVotes}
												participations={participations}
												translate={translate}
												representative={participant.representative}
												_renderDeleteIcon={() => this._renderDeleteIcon(participant.id)}
											/>
										</React.Fragment>
									);
								}
							)}
						</EnhancedTable>
					</React.Fragment>
				)}
				{this.props.children}
			</div>
		);
	}
}

class HoverableRow extends React.Component {

	state = {
		showActions: false
	};

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		});
	}

	render(){

		const { participant, editParticipant, _renderDeleteIcon, totalVotes, totalSocialCapital, representative, selected, translate } = this.props;

		if(isMobile){
            return(
                <Card
                    style={{marginBottom: '0.5em', padding: '0.3em', position: 'relative'}}
                    onClick={editParticipant}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.participant_data}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							<span style={{fontWeight: '700'}}>{`${participant.name} ${participant.surname}`}</span>
							{!!representative &&
								<React.Fragment>
									<br />
									{`${this.props.translate.represented_by}: ${representative.name} ${representative.surname}`}
								</React.Fragment>
							}
                        </GridItem>
						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.dni}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{!!representative?
								<React.Fragment>
									{representative.dni}
								</React.Fragment>
							:
								participant.dni
							}
                        </GridItem>
						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.position}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{!!representative?
								<React.Fragment>
									{representative.position}
								</React.Fragment>
							:
								participant.position
							}
                        </GridItem>
						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.votes}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{!CBX.isRepresentative(participant) &&
								`${
									participant.numParticipations
								} (${(
									(participant.numParticipations /
										totalVotes) *
									100
								).toFixed(2)}%)`
							}
                        </GridItem>
						{this.props.participations && (
							<React.Fragment>
								<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
									{translate.census_type_social_capital}
								</GridItem>
								<GridItem xs={7} md={7}>
									{!CBX.isRepresentative(participant) &&
										`${participant.socialCapital} (${(
										(participant.socialCapital /
											totalSocialCapital) *
										100).toFixed(2)}%)`
									}

								</GridItem>
							</React.Fragment>
						)}
                    </Grid>
                    <div style={{position: 'absolute', top: '5px', right: '5px'}}>
						{!CBX.isRepresentative(participant) &&
							_renderDeleteIcon(participant.id)}
                    </div>
                </Card>
            )
        }

		return (
			<TableRow
				hover={true}
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={editParticipant}
				style={{
					cursor: "pointer",
					fontSize: "0.5em"
				}}
			>
				<TableCell onClick={event => event.stopPropagation()} style={{cursor: 'auto'}}>
					<div style={{width: '2em'}}>
						{(this.state.showActions || selected) &&
							<Checkbox
								value={selected}
								onChange={() =>
									this.props.select(participant.id)
								}
							/>
						}
					</div>
				</TableCell>
				<TableCell>
					<span style={{fontWeight: '700'}}>{`${participant.name} ${participant.surname}`}</span>
					{!!representative &&
						<React.Fragment>
							<br/>
							{`${this.props.translate.represented_by}: ${representative.name} ${representative.surname}`}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.dni}
					{!!representative &&
						<React.Fragment>
							<br/>
							{representative.dni}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.position}
					{!!representative &&
						<React.Fragment>
							<br/>
							{representative.position}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{!CBX.isRepresentative(
						participant
					) &&
						`${
							participant.numParticipations
						} (${(
							(participant.numParticipations /
								totalVotes) *
							100
						).toFixed(2)}%)`
					}
					{!!representative &&
						<br/>
					}
				</TableCell>
				{this.props.participations && (
					<TableCell>
						{!CBX.isRepresentative(
							participant
						) &&
							`${
								participant.socialCapital
							} (${(
								(participant.socialCapital /
									totalSocialCapital) *
								100
							).toFixed(2)}%)`
						}
						{!!representative &&
							<br/>
						}
					</TableCell>
				)}
				<TableCell>
					<div style={{width: '6em'}}>

						{this.state.showActions &&
							!CBX.isRepresentative(
								participant
							) &&
								_renderDeleteIcon(
									participant.id
								)
						}
						{!!representative &&
							<br/>
						}
					</div>
				</TableCell>
			</TableRow>
		)
	}

}

export default compose(
	graphql(deleteParticipant)
)(ParticipantsTable);
