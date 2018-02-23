import React, { Component } from 'react';
import AgendaDetailsSection from './AgendaDetailsSection';
import AgendaSelector from './AgendaSelector';
import { Card } from 'material-ui';

class AgendaManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedPoint: 0
        }
    }

    changeSelectedPoint = (index) => {
        this.setState({
            selectedPoint: index
        })
    }

    render(){
        const { council, translate } = this.props;

        if(this.props.fullScreen){
            return(
                <Card style={{width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'white'}} onClick={this.props.openMenu} >
                    <AgendaSelector
                        agendas={council.agendas}
                        selected={this.state.selectedPoint}
                        onClick={this.changeSelectedPoint}
                    />
                </Card>
            )
        }

        return(
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
                <Card style={{width: '5em', height: '100%', overflow: 'auto', backgroundColor: 'white'}} >
                    <AgendaSelector
                        agendas={council.agendas}
                        selected={this.state.selectedPoint}
                        onClick={this.changeSelectedPoint}
                    />
                </Card>
                <div style={{width: '94%', height: '5em', padding: '0', display: 'flex', flexDirection: 'row'}}>
                    <AgendaDetailsSection
                        council={council}
                        selectedPoint={this.state.selectedPoint}
                        attachments={council.agenda_attachments}
                        participants={this.props.participants}
                        councilID={this.props.councilID}
                        translate={translate}
                        refetch={this.props.refetch}
                    />
                </div>
            </div>
        );
    }
}

export default AgendaManager;