import React, { Component, Fragment } from 'react';
import AgendaAttachmentsManager from './AgendaAttachmentsManager';
import ActAgreements from './ActAgreements';
import OpenRoomButton from './OpenRoomButton';
import StartCouncilButton from './StartCouncilButton';
import EndCouncilButton from './EndCouncilButton';
import ToggleAgendaButton from './ToggleAgendaButton';
import ToggleVotingsButton from './ToggleVotingsButton';
import Comments from './Comments';
import Votings from './Votings';
import * as CBX from '../../../utils/CBX';


class AgendaDetailsSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openIndex: 1
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.agendas) {
            const openAgenda = nextProps.agendas.find((agenda, index) => agenda.pointState === 1 || (agenda.pointState === 0 && nextProps.agendas[ index > 0 ? index - 1 : 0 ].pointState === 2));
            if (openAgenda) {
                this.setState({
                    openIndex: openAgenda.orderIndex
                })
            } else {
                this.setState({
                    openIndex: 1
                })
            }
        }
    }

    render() {
        const { translate, council, agendas, participants, refetch } = this.props;
        if (!this.props.council.agendas) {
            return (<div>{translate.no_results}</div>)
        }
        const agenda = agendas[ this.props.selectedPoint ];

        return (<div style={{
            width: '100%',
            height: '100%',
            margin: 0,
            paddingLeft: '1px',
            overflow: 'auto',
            outline: 0
        }} tabIndex="0" onKeyUp={this.handleKeyPress}>
            <div className="row" style={{
                width: '100%',
                padding: '2em',
                height: '10em'
            }}>
                <div className="col-lg-6 col-md-5 col-xs-5">
                    {agenda.agendaSubject}<br/>
                    <div
                        style={{
                            fontSize: '0.9em',
                            marginTop: '1em'
                        }}
                        dangerouslySetInnerHTML={{ __html: agenda.description }}
                    />
                </div>
                <div className="col-lg-6 col-md-5 col-xs-5">
                    <div className="row">
                        {CBX.councilStarted(council) && !CBX.agendaClosed(agenda) &&
                        <div className="col-lg-6 col-md-12 col-xs-12" style={{
                            marginTop: '0.6em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ToggleAgendaButton
                                agenda={agenda}
                                translate={translate}
                                refetch={refetch}
                                active={agenda.orderIndex === this.state.openIndex}
                            />
                        </div>}
                        {council.state === 20 ? !CBX.councilStarted(council) ?
                            <div className="col-lg-6 col-md-12 col-xs-12" style={{ marginTop: '0.6em' }}>
                                <StartCouncilButton
                                    council={council}
                                    translate={translate}
                                    participants={participants}
                                    refetch={refetch}
                                />
                            </div> : <div className="col-lg-6 col-md-12 col-xs-12" style={{ marginTop: '0.6em' }}>
                                <EndCouncilButton
                                    council={council}
                                    translate={translate}
                                />
                            </div> : <OpenRoomButton
                            translate={translate}
                            council={council}
                            refetch={refetch}
                        />}
                        {CBX.showAgendaVotingsToggle(council, agenda) &&
                        <div className="col-lg-6 col-md-12 col-xs-12" style={{ marginTop: '0.6em' }}>
                            <ToggleVotingsButton
                                council={council}
                                agenda={agenda}
                                translate={translate}
                                refetch={refetch}
                            />
                        </div>}
                    </div>
                </div>
            </div>
            <div style={{
                width: '100%',
                marginTop: '2em'
            }} className="withShadow">
                <ActAgreements
                    agenda={agenda}
                    translate={translate}
                    council={this.props.council}
                    refetch={this.props.refetch}
                    data={this.props.data}
                />
            </div>
            {CBX.councilStarted(council) && CBX.agendaVotingsOpened(agenda) && <Fragment>
                {/*<div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                 <RecountSection
                 agenda={agenda}
                 council={council}
                 majorities={this.props.majorities}
                 translate={translate}
                 councilID={this.props.council.id}
                 refetch={this.props.refetch}
                 agendaID={agenda.id}
                 />
                 </div>*/}
                {CBX.councilHasComments(council.statute) && <div style={{
                    width: '100%',
                    marginTop: '0.4em'
                }} className="withShadow">
                    <Comments
                        agenda={agenda}
                        council={council}
                        translate={translate}
                    />
                </div>}
                <div style={{
                    width: '100%',
                    marginTop: '0.4em'
                }} className="withShadow">
                    <Votings
                        ref={(votings) => this.votings = votings}
                        agenda={agenda}
                        majorities={this.props.data.majorities}
                        translate={translate}
                    />
                </div>
            </Fragment>}
            <div style={{
                width: '100%',
                marginTop: '0.4em'
            }} className="withShadow">
                <AgendaAttachmentsManager
                    attachments={agenda.attachments}
                    translate={translate}
                    councilID={this.props.council.id}
                    refetch={this.props.refetch}
                    agendaID={agenda.id}
                />
            </div>
        </div>);
    }

}

export default AgendaDetailsSection;