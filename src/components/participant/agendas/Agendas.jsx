import React from "react";
import { Steps } from 'antd';
import { Paper, Typography, Divider, IconButton } from "material-ui";
import Scrollbar from '../../../displayComponents/Scrollbar';
import { AgendaNumber, LoadingSection } from '../../../displayComponents';
import withTranslations from "../../../HOCs/withTranslations";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AgendaMenu from './AgendaMenu';

const styles = {
	container: {
		width: "100%",
		height: "100%",
        overflow: 'hidden'
	},
    agendasHeader:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
};

class Agendas extends React.Component {
    state = {
        selected: 0
    }

    selectAgenda = (index) => {
        this.setState({selected: index});
    }

	render() {
		const { translate, council, agendasAnchor, toggleAgendasAnchor } = this.props;
        const { selected } = this.state;

        let agendas = [];

        if(this.props.data.agendas){
            agendas = this.props.data.agendas.map(agenda => {
                return {
                    ...agenda,
                    voting: this.props.data.participantVotings.filter(voting => voting.agendaId === agenda.id)
                }
            });
        }

		return (
            <Paper style={styles.container} elevation={4}>
                <Scrollbar>
                    <div style={{padding: '8px'}}>
                        <div style={styles.agendasHeader}>
                            <div style={{width: '3em'}}>
                                {agendasAnchor === 'right' &&
                                    <IconButton
                                        size={'small'}
                                        onClick={toggleAgendasAnchor}
                                    >
                                        <i className="fa fa-caret-left"></i>
                                    </IconButton>
                                }
                            </div>
                            <Typography variant="title" style={{fontWeight: '700'}}>{translate.agenda}</Typography>
                            <div style={{width: '3em'}}>
                                {agendasAnchor === 'left' &&
                                    <IconButton
                                        size={'small'}
                                        onClick={this.props.toggleAgendasAnchor}
                                    >
                                        <i className="fa fa-caret-right"></i>
                                    </IconButton>
                                }
                            </div>
                        </div>
                        <Divider style={{marginBottom: '10px'}}/>
                        <Steps direction="vertical" size="small" current={selected}>
                            {this.props.data.agendas?
                                agendas.map((agenda, index) => {
                                    return (
                                        <Steps.Step
                                            icon={
                                                <AgendaNumber
                                                    index={index + 1}
                                                    open={agenda.pointState === 1}
                                                    active={selected === index}
                                                    activeColor={getPrimary()}
                                                    voting={agenda.votingState === 1 && agenda.subjectType !== 0}
                                                    translate={translate}
                                                    secondaryColor={getSecondary()}
                                                    onClick={() => this.selectAgenda(index)}
                                                    small={true}
                                                    style={{
                                                        position: 'static'
                                                    }}
                                                />
                                            }
                                            title={
                                                <div onClick={() => this.selectAgenda(index)}>
                                                    {agenda.agendaSubject}
                                                </div>
                                            }
                                            description={ selected === index ?
                                                    <React.Fragment>
                                                        <div dangerouslySetInnerHTML={{__html: agenda.description}}></div>
                                                        <AgendaMenu
                                                            agenda={agenda}
                                                            translate={translate}
                                                        />
                                                    </React.Fragment>
                                                :
                                                    ''
                                            }
                                            key={agenda.id}
                                        />
                                    )
                                })
                            :   
                                <LoadingSection />
                            }
                        </Steps>
                    </div>
                </Scrollbar>
			</Paper>
		);
	}
}


const agendas = gql`
    query Agendas($councilId: Int!, $participantId: Int!){
        agendas(councilId: $councilId){
            agendaSubject
            attachments {
                id
                agendaId
                filename
                filesize
                filetype
                councilId
                state
            }
            councilId
            dateEndVotation
            dateStart
            dateStartVotation
            description
            id
            orderIndex
            pointState
            subjectType
            votingState
        }
        participantVotings(participantId: $participantId){
            id
            comment
            agendaId
            vote
        }
    }
`;

export default graphql(agendas, {
    options: props => ({
        variables: {
            councilId: props.council.id,
            participantId: props.participant.id
        },
        pollInterval: 7000
    })
})(withTranslations()(Agendas));
