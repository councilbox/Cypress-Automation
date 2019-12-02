import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Tooltip, Typography } from 'material-ui';
import { getSecondary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import { AlertConfirm, TextInput } from '../../../../displayComponents';

const DenyVote = ({ translate, client, refetch, participant }) => {
    const [modal, setModal] = React.useState(false);
    const [text, setText] = React.useState(participant.voteDeniedReason? participant.voteDeniedReason : '');
    const secondary = getSecondary();
    const config = React.useContext(ConfigContext);

    if(!config.denyVote){
        return null;
    }

    const renderBody = () => {
        if(!participant.voteDenied){
            return (
            <div>
                ¿Desea denegar el derecho a voto a este participante? Puede indicar el motivo en el cuadro de texto inferior.
                <div style={{
                        marginTop: '1em'
                    }}
                >
                    <TextInput
                    floatingText={'Motivo denegación voto'}
                    value={text}
                    onChange={event => setText(event.target.value)}

                />
                </div>

            </div>
            )
        }

        return (
            <div>
                ¿Desea devolver el derecho a voto a este participante?
            </div>
        )
    }

    const toggleDeniedVote = async value => {
        const response = await client.mutate({
            mutation: gql`
                mutation SetParticipantVoteDenied($participantId: Int, $value: Boolean!, $text: String){
                    setParticipantVoteDenied(participantId: $participantId, value: $value, text: $text){
                        success
                    }
                }
            `,
            variables: {
                participantId: participant.id,
                value,
                text
            }
        });

        refetch();
        setModal(false);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}
        >
            <AlertConfirm
                requestClose={() => setModal(false)}
                title={translate.warning}
                open={modal}
                acceptAction={participant.voteDenied? () => toggleDeniedVote(false) : () => toggleDeniedVote(true)}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={renderBody()}
            />
            <div
                style={{
                    width: "2em",
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <i className="fa fa-times" aria-hidden="true" style={{
                        color: secondary,
                        fontSize: "0.8em",
                        marginRight: "0.3em"
                }}></i>
            </div>
            {participant.voteDenied?
                <Tooltip title={participant.voteDeniedReason}>
                    <Typography variant="body1" className="truncate">
                        <span style={{color: 'red', fontWeight: '700'}}>Voto denegado </span>
                        <span onClick={() => setModal(true)} style={{fontSize: '0.9em', color: secondary, cursor: 'pointer'}}>(Restaurar voto)</span>
                    </Typography>
                </Tooltip>
            :
                <Typography variant="body1" className="truncate" style={{cursor: 'pointer'}} onClick={() => setModal(true)}>
                    Denegar derecho a voto
                </Typography>
            }

        </div>
    )
}

export default withApollo(DenyVote);