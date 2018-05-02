import React, { Component } from 'react';
import * as CBX from '../../utils/CBX';
import { Card } from 'material-ui';
import NewParticipantForm from '../councilEditor/NewParticipantForm';
import ConvenedParticipantsTable from './ConvenedParticipantsTable';
import { AlertConfirm } from "../displayComponents";


class ParticipantsSection extends Component{

    constructor(props){
        super(props);
        this.state = {
            showModal: false
        };
    }

    closeAddParticipantModal = () => {
        this.setState({
            addParticipantModal: false
        });
    }


    render(){
        const { translate, council, refetch, totalVotes, socialCapital } = this.props;
    
        return (
            <Card style={{marginTop: '1em', padding: '1.5em'}}>
                <ConvenedParticipantsTable
                    participants={council.participants}
                    councilId={council.id}
                    council={council}
                    totalVotes={totalVotes}
                    socialCapital={socialCapital}
                    participations={CBX.hasParticipations(council)}
                    translate={translate}
                    refetch={refetch}
                />    
            </Card>
        );
    }
}

export default ParticipantsSection;