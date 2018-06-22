import React from 'react';
import { Grid, GridItem, Table } from '../../../displayComponents';
import { TableRow, TableCell } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import withSharedProps from '../../../HOCs/withSharedProps';

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



const AgendaRecount = ({ agenda, recount, majorityTypes, council, company, translate }) => {
    const agendaNeededMajority = CBX.calculateMajorityAgenda(agenda, company, council, recount);

    return(
        <React.Fragment>
            <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em'}}>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.convene_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${recount.numTotal || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${recount.partTotal || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.present_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numPresentCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${agenda.presentCensus || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.current_remote_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numCurrentRemoteCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${recount.currentRemoteCensus || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={{...columnStyle, backgroundColor: 'lightcyan'}}>
                    <div style={itemStyle}>
                        {translate.voting_rights_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numCurrentRemoteCensus + agenda.numPresentCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${agenda.presentCensus + agenda.currentRemoteCensus || 0}`}
                    </div>
                </GridItem>
            </Grid>
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
                            {CBX.approvedByQualityVote(agenda, council.qualityVoteId)? 
                                `${translate.approved} ${translate.by_quality_vote}`
                            :
                                `${translate.not_approved} ${translate.by_quality_vote}`
                            }
                        </div>
                    }
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.votes_in_favor_for_approve} ${agendaNeededMajority}`}
                        {agendaNeededMajority > agenda.positiveVotings + agenda.positiveManual? 
                            <i class="fa fa-times" style={{color: 'red', marginLeft: '0.3em'}}/>
                        :
                            <i class="fa fa-check" style={{color: 'green', marginLeft: '0.3em'}}/>
                        }
                    </div>
                </GridItem>
            </Grid>
            <Table
                headers={[
                    {name: translate.voting},
                    {name: translate.in_favor},
                    {name: translate.against},
                    {name: translate.abstentions},
                    {name: translate.no_vote}
                ]}
            >
                <TableRow>
                    <TableCell>
                        {translate.remote_vote}
                    </TableCell>
                    <TableCell>
                        {agenda.positiveVotings}
                    </TableCell>
                    <TableCell>
                        {agenda.negativeVotings}
                    </TableCell>
                    <TableCell>
                        {agenda.abstentionVotings}
                    </TableCell>
                    <TableCell>
                        {agenda.noVoteVotings}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate.present_vote}
                    </TableCell>
                    <TableCell>
                        {agenda.positiveManual}
                    </TableCell>
                    <TableCell>
                        {agenda.negativeManual}
                    </TableCell>
                    <TableCell>
                        {agenda.abstentionManual}
                    </TableCell>
                    <TableCell>
                        {agenda.noVoteManual}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        Total
                    </TableCell>
                    <TableCell>
                        {agenda.positiveVotings + agenda.positiveManual}
                    </TableCell>
                    <TableCell>
                        {agenda.negativeVotings + agenda.negativeManual}
                    </TableCell>
                    <TableCell>
                        {agenda.abstentionVotings + agenda.abstentionManual}
                    </TableCell>
                    <TableCell>
                        {agenda.noVoteVotings + agenda.noVoteManual}
                    </TableCell>
                </TableRow>
            </Table>
        </React.Fragment>
    )
}


export default withSharedProps()(AgendaRecount);