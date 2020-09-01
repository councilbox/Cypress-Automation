import React from "react";
import { LiveToast } from '../../../displayComponents';
import withTranslations from "../../../HOCs/withTranslations";
import DelegationsModal from './DelegationsModal';
import { agendaPointOpened, agendaVotingsOpened } from '../../../utils/CBX';
import { toast } from 'react-toastify';
import AgendaNoSession from "./AgendaNoSession";
import { isMobile } from '../../../utils/screen';
import { getSubjectAbrv } from '../../../displayComponents/AgendaNumber';


class Agendas extends React.Component {
    state = {
        selected: 0,
        delegationsModal: false
    }

    updated = 0;

    selectAgenda = (index) => {
        this.setState({ selected: index });
    }

    agendaStateToastId = null;
    agendaVotingsToastId = null;

    componentDidMount() {
        if (this.props.participant.delegatedVotes.length > 0) {
            if (!sessionStorage.getItem('delegationsNotify')) {
                this.setState({
                    delegationsModal: true
                });
                sessionStorage.setItem('delegationsNotify', true);
            }
        }
    }

    showDelegationsModal = () => {
        this.setState({
            delegationsModal: true
        });
    }

    closeDelegationsModal = () => {
        this.setState({
            delegationsModal: false
        });
    }

    componentWillUnmount() {
        toast.dismiss(this.agendaStateToastId);
        toast.dismiss(this.agendaVotingsToastId);
    }

    componentDidUpdate(prevProps) {
        const { translate } = this.props;

        if (prevProps.data.agendas) {
            const { agendas: actualAgendas } = this.props.data;
            prevProps.data.agendas.forEach((agenda, index) => {
                let agendaToCheck = agenda.id === actualAgendas[index].id ?
                    actualAgendas[index]
                    :
                    actualAgendas.find(item => item.id === agenda.id)
                    ;
                if (!agendaPointOpened(agenda) && agendaPointOpened(agendaToCheck)) {
                    if (this.agendaStateToastId) {
                        toast.dismiss(this.agendaStateToastId);
                    }
                    this.agendaStateToastId = this.toastChanges(
                        `${translate.point_of_day_opened_number} ${!isNaN(getSubjectAbrv(agenda.agendaSubject))? getSubjectAbrv(agenda.agendaSubject): ""}`,
                        () => this.agendaStateToastId = null
                    );
                }

                if (agendaPointOpened(agenda) && !agendaPointOpened(agendaToCheck)) {
                    if (this.agendaStateToastId) {
                        toast.dismiss(this.agendaStateToastId);
                    }
                    this.agendaStateToastId = this.toastChanges(
                        `${translate.point_closed_num} ${!isNaN(getSubjectAbrv(agenda.agendaSubject))? getSubjectAbrv(agenda.agendaSubject): ""}`,
                        () => this.agendaStateToastId = null
                    );
                }

                if (!agendaVotingsOpened(agenda) && agendaVotingsOpened(agendaToCheck)) {
                    if (this.agendaVotingsToastId) {
                        toast.dismiss(this.agendaVotingsToastId);
                    }
                    this.agendaVotingsToastId = this.toastChanges(
                        `${translate.point_num_votings_open} ${!isNaN(getSubjectAbrv(agenda.agendaSubject))? getSubjectAbrv(agenda.agendaSubject): ""}`,
                        () => this.agendaVotingsToastId = null
                    );
                }

                if (agendaVotingsOpened(agenda) && !agendaVotingsOpened(agendaToCheck)) {
                    if (this.agendaVotingsToastId) {
                        toast.dismiss(this.agendaVotingsToastId);
                    }
                    this.agendaVotingsToastId = this.toastChanges(
                        `${translate.point_num_votings_closed} ${!isNaN(getSubjectAbrv(agenda.agendaSubject))? getSubjectAbrv(agenda.agendaSubject): ""}`,
                        () => this.agendaVotingsToastId = null
                    )
                }
            });
        }
    }

    toastChanges = (message, onClose) => {
        this.props.setAgendaBadge(true);
        if (!isMobile) {
            toast(
                <LiveToast
                    message={message}
                    action={() => this.selectAgenda}
                />, {
                // autoClose: false,
                autoClose: 10000,
                position: toast.POSITION.TOP_CENTER,
                onClose: onClose,
                className: "liveToast"
            }
            )
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.state.delegationsModal &&
                    <DelegationsModal
                        refetch={this.props.refetchParticipant}
                        council={this.props.council}
                        participant={this.props.participant}
                        requestClose={this.closeDelegationsModal}
                        open={this.state.delegationsModal}
                        fullWidth={false}
                        translate={this.props.translate}
                    />
                }
                <AgendaNoSession
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}

export default withTranslations()(Agendas);
