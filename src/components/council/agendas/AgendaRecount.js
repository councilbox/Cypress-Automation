import React from 'react';
import { Grid, GridItem, Table } from '../../../displayComponents';
import { TableRow, TableCell, Tooltip, Card, CardHeader, CardContent, withStyles } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import { updateAgenda } from "../../../queries/agenda";
import * as CBX from '../../../utils/CBX';
import { Input } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import withSharedProps from '../../../HOCs/withSharedProps';
import { CONSENTIO_ID } from '../../../config';
import PropTypes from "prop-types";
import { isMobile } from '../../../utils/screen';

const columnStyle = {
    display: 'flex',
    fontWeight: '600',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.4em',
    fontSize: '0.8em'
};

const itemStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const AgendaRecount = ({ agenda, recount, majorityTypes, council, company, refetch, editable, translate, updateAgenda, classes }) => {

    const agendaNeededMajority = CBX.calculateMajorityAgenda(agenda, company, council, recount);
    const activatePresentOneVote = false;

    const getPartTotal = () => {

        if (council.companyId === CONSENTIO_ID) {
            if (agenda.orderIndex >= 2 && agenda.orderIndex <= 9) {
                return `${translate.votes}: ${CBX.showNumParticipations(recount.weighedPartTotal, company) || 0}`
            }
        }
        return `${translate.votes}: ${CBX.showNumParticipations(recount.partTotal, company) || 0}`
    }

    const renderTotal = () => {
        return (
            <>
                <div style={itemStyle}>
                    {translate.convene_census}
                </div>
                <div style={itemStyle}>
                    {`${translate.participants}: ${recount.numTotal || 0}`}
                </div>
                <div style={itemStyle}>
                    {getPartTotal()}
                </div>
            </>
        )
    }

    const renderPresentTotal = () => {
        return (
            <>
                <div style={itemStyle}>
                    {translate.present_census}
                </div>
                <div style={itemStyle}>
                    {`${translate.participants}: ${agenda.numPresentCensus || 0}`}
                </div>
                <div style={itemStyle}>
                    {`${translate.votes}: ${(editable && activatePresentOneVote) ?
                        CBX.showNumParticipations(agenda.numPresentCensus, company) :
                        CBX.showNumParticipations(agenda.presentCensus, company) || 0}`}
                </div>
            </>
        )
    }

    const renderRemoteTotal = () => {
        return (
            <>
                <div style={itemStyle}>
                    {translate.current_remote_census}
                </div>
                <div style={itemStyle}>
                    {`${translate.participants}: ${agenda.numCurrentRemoteCensus || 0}`}
                </div>
                <div style={itemStyle}>
                    {`${translate.votes}: ${CBX.showNumParticipations(agenda.currentRemoteCensus, company) || 0}`}
                </div>
            </>
        )
    }

    const renderCurrentTotal = () => {
        return (
            <>
                <div style={itemStyle}>
                    {translate.voting_rights_census}
                </div>
                <div style={itemStyle}>
                    {`${translate.participants}: ${agenda.numCurrentRemoteCensus + agenda.numPresentCensus || 0}`}
                </div>
                <div style={itemStyle}>
                    {`${translate.votes}: ${CBX.showNumParticipations(agenda.presentCensus + agenda.currentRemoteCensus, company) || 0}`}
                </div>
            </>
        )
    }

    if (isMobile) {
        return (
            <React.Fragment>
                <Grid style={{ border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em' }}>
                    <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                        {renderTotal()}
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                        {renderPresentTotal()}
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                        {renderRemoteTotal()}
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3} style={{ ...columnStyle, backgroundColor: 'lightcyan' }}>
                        {renderCurrentTotal()}
                    </GridItem>
                </Grid>
                <Grid style={{ border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em' }}>
                    <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                        <div style={itemStyle}>
                            {`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
                            {CBX.majorityNeedsInput(agenda.majorityType) && agenda.majority}
                            {agenda.majorityType === 0 && '%'}
                            {agenda.majorityType === 5 && `/ ${agenda.majorityDivider}`}
                        </div>
                    </GridItem>
                    <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                        {CBX.haveQualityVoteConditions(agenda, council) &&
                            <div style={itemStyle}>
                                {CBX.approvedByQualityVote(agenda, council.qualityVoteId) ?
                                    `${translate.approved} ${translate.by_quality_vote}`
                                    :
                                    `${translate.not_approved} ${translate.by_quality_vote}`
                                }
                            </div>
                        }
                    </GridItem>
                    <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                        <div style={itemStyle}>
                            {`${translate.votes_in_favor_for_approve}: ${agendaNeededMajority}`}
                            {agendaNeededMajority > (agenda.positiveVotings + agenda.positiveManual) ? (
                                <FontAwesome
                                    name={"times"}
                                    style={{
                                        margin: "0.5em",
                                        color: "red",
                                        fontSize: "1.2em"
                                    }}
                                />
                            ) : (
                                    <FontAwesome
                                        name={"check"}
                                        style={{
                                            margin: "0.5em",
                                            color: 'green',
                                            fontSize: "1.2em"
                                        }}
                                    />
                                )}
                        </div>
                    </GridItem>
                </Grid>
                <Card style={{ margin: "5px 0px 5px 0px", width: "calc( 100% + 8px )" }}>
                    <CardHeader
                        classes={{
                            title: classes.cardTitle,
                        }}
                        title={translate.remote_vote}
                        style={{ paddingBottom: "0px" }}
                    />
                    <CardContent style={{ paddingTop: "5px" }}>
                        <div style={{ fontSize: "0.8em" }}>
                            {translate.in_favor} : {agenda.positiveVotings}
                            <br></br>
                            {translate.against} : {agenda.negativeVotings}
                            <br></br>
                            {translate.abstentions} : {agenda.abstentionVotings}
                            <br></br>
                            {translate.no_vote} : {agenda.noVoteVotings}
                        </div>
                    </CardContent>
                </Card>
                <Card style={{ margin: "5px 0px 5px 0px", width: "calc( 100% + 8px )" }}>
                    <CardHeader
                        classes={{
                            title: classes.cardTitle,
                        }}
                        title={translate.present_vote}
                        style={{ paddingBottom: "0px" }}
                    />
                    <CardContent style={{ paddingTop: "5px" }}>
                        <div style={{ fontSize: "0.8em" }}>
                            {editable ?
                                <React.Fragment>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {translate.in_favor} :
                                    <EditableCell
                                            inCard={true}
                                            value={agenda.positiveManual}
                                            translate={translate}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {translate.against} :
                                    <EditableCell
                                            inCard={true}
                                            value={agenda.negativeManual}
                                            translate={translate}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {translate.abstentions} :
                                    <EditableCell
                                            inCard={true}
                                            value={agenda.abstentionManual}
                                            translate={translate}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {translate.no_vote} :
                                    <EditableCell
                                            inCard={true}
                                            value={agenda.noVoteManual}
                                            translate={translate}
                                        />
                                    </div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {translate.in_favor} : {agenda.positiveManual}
                                    <br></br>
                                    {translate.against} : {agenda.negativeManual}
                                    <br></br>
                                    {translate.abstentions} : {agenda.abstentionManual}
                                    <br></br>
                                    {translate.no_vote} : {agenda.noVoteManual}
                                </React.Fragment>
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card style={{ margin: "5px 0px 5px 0px", width: "calc( 100% + 8px )" }}>
                    <CardHeader
                        classes={{
                            title: classes.cardTitle,
                        }}
                        title={'Total'}
                        style={{ paddingBottom: "0px" }}
                    />
                    <CardContent style={{ paddingTop: "5px" }}>
                        <div style={{ fontSize: "0.8em" }}>
                            {translate.in_favor} : {agenda.positiveVotings + agenda.positiveManual}
                            <br></br>
                            {translate.against} :  {agenda.negativeVotings + agenda.negativeManual}
                            <br></br>
                            {translate.abstentions} : {agenda.abstentionVotings + agenda.abstentionManual}
                            <br></br>
                            {translate.no_vote} : {agenda.noVoteVotings + agenda.noVoteManual}
                        </div>
                    </CardContent>
                </Card>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {council.autoClose !== 1 &&
                <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em', marginBottom: '2em'}}>
                    <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                        {renderTotal()}
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                        {renderPresentTotal()}
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                        {renderRemoteTotal()}
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3} style={{...columnStyle, backgroundColor: 'lightcyan'}}>
                        {renderCurrentTotal()}
                    </GridItem>
                </Grid>
            }
            <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em'}}>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
                        {CBX.majorityNeedsInput(agenda.majorityType) && agenda.majority}
                        {agenda.majorityType === 0 && '%'}
                        {agenda.majorityType === 5 && `/ ${agenda.majorityDivider}`}
                    </div>
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    {CBX.haveQualityVoteConditions(agenda, council) &&
                        <div style={itemStyle}>
                            {CBX.approvedByQualityVote(agenda, council.qualityVoteId) ?
                                `${translate.approved} ${translate.by_quality_vote}`
                                :
                                `${translate.not_approved} ${translate.by_quality_vote}`
                            }
                        </div>
                    }
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.votes_in_favor_for_approve}: ${CBX.showNumParticipations(agendaNeededMajority, company)}`}
                        {agendaNeededMajority > (agenda.positiveVotings + agenda.positiveManual) ? (
                            <FontAwesome
                                name={"times"}
                                style={{
                                    margin: "0.5em",
                                    color: "red",
                                    fontSize: "1.2em"
                                }}
                            />
                        ) : (
                                <FontAwesome
                                    name={"check"}
                                    style={{
                                        margin: "0.5em",
                                        color: 'green',
                                        fontSize: "1.2em"
                                    }}
                                />
                            )}
                    </div>
                </GridItem>
            </Grid>
            <Table
                forceMobileTable={true}
                headers={[
                    { name: '' },
                    { name: translate.in_favor },
                    { name: translate.against },
                    { name: translate.abstentions },
                    { name: translate.no_vote }
                ]}
            >
                <TableRow>
                    <TableCell>
                        {translate.remote_vote}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.positiveVotings, company)}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.negativeVotings, company)}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.abstentionVotings, company)}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.noVoteVotings, company)}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate.present_vote}
                    </TableCell>
                    {editable ?
                        <React.Fragment>
                            <EditableCell
                                value={agenda.positiveManual}
                                translate={translate}
                            />
                            <EditableCell
                                value={agenda.negativeManual}
                                translate={translate}
                            />
                            <EditableCell
                                value={agenda.abstentionManual}
                                translate={translate}
                            />
                            <EditableCell
                                value={agenda.noVoteManual}
                                translate={translate}
                            />
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <TableCell>
                                {CBX.showNumParticipations(agenda.positiveManual, company)}
                            </TableCell>
                            <TableCell>
                                {CBX.showNumParticipations(agenda.negativeManual, company)}
                            </TableCell>
                            <TableCell>
                                {CBX.showNumParticipations(agenda.abstentionManual, company)}
                            </TableCell>
                            <TableCell>
                                {CBX.showNumParticipations(agenda.noVoteManual, company)}
                            </TableCell>
                        </React.Fragment>
                    }
                </TableRow>
                <TableRow>
                    <TableCell>
                        Total
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.positiveVotings + agenda.positiveManual, company)}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.negativeVotings + agenda.negativeManual, company)}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.abstentionVotings + agenda.abstentionManual, company)}
                    </TableCell>
                    <TableCell>
                        {CBX.showNumParticipations(agenda.noVoteVotings + agenda.noVoteManual, company)}
                    </TableCell>
                </TableRow>
            </Table>
        </React.Fragment>
    )
}
const regularCardStyle = {
    cardTitle: {
        fontSize: "1em",
    },
}

export default withSharedProps()(graphql(updateAgenda, {
    name: 'updateAgenda'
})(withStyles(regularCardStyle)(AgendaRecount)));

class EditableCell extends React.Component {

    state = {
        showEdit: false,
        edit: false,
        tooltip: false,
        value: this.props.value
    }

    show = () => {
        this.setState({
            edit: true
        });
    }

    hide = () => {
        this.setState({
            showEdit: false
        })
    }

    toggleEdit = () => {
        this.setState({
            edit: !this.state.edit
        })
    }

    showTooltip = () => {
        this.setState({
            tooltip: true
        });
    }

    handleKeyUp = (event) => {
        const key = event.nativeEvent;

        if (key.keyCode === 13) {
            this.saveValue();
        }
    }

    saveValue = () => {
        if (this.state.value !== this.props.value) {
            this.props.blurAction(this.state.value);
        }
        this.toggleEdit();
    }
    render() {
        const { inCard } = this.props;
        if (inCard) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingLeft: "2px"
                    }}
                    onMouseOver={this.show}
                    onMouseLeave={this.hide}
                >
                    {this.state.edit ?
                        <Tooltip title={this.props.max === 0 ? this.props.translate.max_votes_reached : `${this.props.translate.enter_num_between_0_and} ${this.props.max}`}>
                            <div style={{ width: '4em' }}>
                                <Input
                                    type="number"
                                    fullWidth
                                    onKeyUp={this.handleKeyUp}
                                    max={this.props.max}
                                    min={0}
                                    onBlur={this.saveValue}
                                    value={this.state.value}
                                    onChange={(event) => {
                                        if (event.target.value >= 0 && event.target.value <= this.props.max) {
                                            this.setState({
                                                value: parseInt(event.target.value, 10)
                                            })
                                        } else {
                                            this.showTooltip()
                                        }
                                    }}
                                />
                            </div>
                        </Tooltip>

                        :
                        this.state.value
                    }
                </div>
            )
        }
        return (
            <TableCell
                onMouseOver={this.show}
                onMouseLeave={this.hide}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    {this.state.edit ?
                        <Tooltip title={this.props.max === 0 ? this.props.translate.max_votes_reached : `${this.props.translate.enter_num_between_0_and} ${this.props.max}`}>
                            <div style={{ width: '4em' }}>
                                <Input
                                    type="number"
                                    fullWidth
                                    onKeyUp={this.handleKeyUp}
                                    max={this.props.max}
                                    min={0}
                                    onBlur={this.saveValue}
                                    value={this.state.value}
                                    onChange={(event) => {
                                        if (event.target.value >= 0 && event.target.value <= this.props.max) {
                                            this.setState({
                                                value: parseInt(event.target.value, 10)
                                            })
                                        } else {
                                            this.showTooltip()
                                        }
                                    }}
                                />
                            </div>
                        </Tooltip>

                        :
                        this.state.value
                    }

                </div>
            </TableCell>
        )
    }
}

AgendaRecount.propTypes = {
    classes: PropTypes.object.isRequired,
    cardTitle: PropTypes.node,
}