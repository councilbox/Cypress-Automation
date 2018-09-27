import React from 'react';
import { Table, DateWrapper, BasicButton } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import TableStyles from "../../styles/table";
import { getPrimary } from '../../styles/colors';
import { COUNCIL_STATES } from '../../constants';

const generateLink = (council, company) => {
    return `/company/${company.id}/council/${council.id}/finished`;
}

const CouncilsHistory = ({ councils, translate, deleteCouncil, openDeleteModal, company, link }) => {

    return(
        <Table
            headers={[
                { name: translate.type },
                { name: translate.date_real_start },
                { name: translate.table_councils_duration },
                { name: translate.name },
                { name: translate.certificates }
            ]}
            companyID={company.id}
        >
            {councils.map(council => {
                return (
                    <HoverableRow
                        key={`council_${council.id}`}
                        translate={translate}
                        council={council}
                        company={company}
                    />
                );
            })}
        </Table>
    )
}

class HoverableRow extends React.Component {

    state = {
        showActions: false
    }

    handleMouseEnter = () => {
        this.setState({
            showActions: true
        });
    }

    handleMouseLeave = () => {
        this.setState({
            showActions: false
        });
    }

    getCouncilState = state => {
        const { translate } = this.props;
        switch (state){
            case COUNCIL_STATES.NOT_CELEBRATED:
                return  translate.not_held_council;
            case COUNCIL_STATES.FINISHED:
                return translate.council_finished;
            case COUNCIL_STATES.FINAL_ACT_SENT:
                return 'Acta enviada' //TRADUCCION
            case COUNCIL_STATES.CANCELED:
                return translate.not_held_council;
            default:
                return translate.council_finished;
        }
    }

    render(){
        const { council, company, translate } = this.props;
        const primary = getPrimary();

        return(
            <TableRow
                hover
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={TableStyles.ROW}
                key={`council${council.id}`}
                onClick={() => {
                    bHistory.push(
                        generateLink(council, company)
                    );
                }}
            >
                <TableCell>
                    {this.getCouncilState(council.state)}
                </TableCell>
                <TableCell
                    style={TableStyles.TD}
                >
                    <DateWrapper
                        format="DD/MM/YYYY"
                        date={
                            council.dateStart
                        }
                    />
                </TableCell>

                <TableCell
                    style={TableStyles.TD}
                >
                    <div style={{width: '15em', display: 'flex', flexDirection: 'row'}}>
                        <DateWrapper
                            format="HH:mm"
                            date={
                                council.dateRealStart
                            }
                        /> {` - `}
                        <DateWrapper
                            format="HH:mm"
                            date={
                                council.dateEnd
                            }
                        />
                    </div>
                </TableCell>
                <TableCell
                    style={{
                        ...TableStyles.TD,
                        width: "35%"
                    }}
                >
                    {council.name ||
                        translate.dashboard_new}
                </TableCell>
                <TableCell
                    style={TableStyles.TD}
                >
                    <div style={{width: '12em'}}>
                        {this.state.showActions &&
                            <BasicButton
                                text={translate.certificates}
                                color="white"
                                textStyle={{textTransform: 'none', fontWeight: '700', color: primary}}
                                buttonStyle={{border: `2px solid ${primary}`}}
                                onClick={(event) => {
                                    bHistory.push(`/company/${company.id}/council/${council.id}/certificates`);
                                    event.stopPropagation();
                                }}
                            />
                        }
                    </div>
                </TableCell>
            </TableRow>
        )
    }
}

export default CouncilsHistory;