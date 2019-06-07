import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm, BasicButton } from "../../../../displayComponents";
import { getSecondary } from "../../../../styles/colors";
import CustomPointVotingMenu from '../../../participant/agendas/CustomPointVotingMenu';

const NominalCustomVoting = ({ translate, agendaVoting, agenda, refetch, ...props }) => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();

    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const renderVotingMenu = () => {
        return (
            <div style={{width: '600px'}}>
                <CustomPointVotingMenu
                    agenda={agenda}
                    translate={translate}
                    refetch={refetch}
                    ownVote={agendaVoting}
                />
            </div>
        )
    }

    console.log(props);

    return (
        <div>
            <AlertConfirm
                open={modal}
                title="Marcar selección"
                requestClose={closeModal}
                bodyText={renderVotingMenu()}
            />
            <BasicButton
                text="Menu votación"
                onClick={openModal}
                color="white"
                buttonStyle={{ border: `1px solid ${secondary}`, marginRight: '0.6em'}}
                textStyle={{ color: secondary, fontWeight: '700' }}
            />
            {agendaVoting.ballots.length === 0?
                '-'
            :
                <div>
                    <DisplayVoting
                        ballots={agendaVoting.ballots}  
                        translate={translate}
                    />
                </div>
            }                  
        </div>
    )
}

export const DisplayVoting = ({ ballots, translate }) => {
    const getVoteValueText = value => {
        const texts = {
            'abstention': translate.abstention_btn,
            'default': value
        }

        return texts[value]? texts[value] : texts.default;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {ballots.map(ballot => (
                <div className="truncate" style={{marginTop: '0.3em', maxWidth: '20em'}}>
                    - {getVoteValueText(ballot.value)}
                </div>
            ))}
        </div>
    )
}

export default NominalCustomVoting;