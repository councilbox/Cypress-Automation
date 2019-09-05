import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import DelegationsRestrictionModal from './DelegationsRestrictionModal';
import { AlertConfirm, BasicButton, Checkbox, SectionTitle, ButtonIcon } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { Table, TableBody, TableCell, TableRow } from 'material-ui';
import { TableHead, Card } from 'material-ui';
import { isMobile } from 'react-device-detect';


const councilDelegates = gql`
    query CouncilDelegates($councilId: Int!){
        councilDelegates(councilId: $councilId){
            participant {
                id
                name
                surname
            }
        }
    }
`;

const addCouncilDelegateMutation = gql`
    mutation AddCouncilDelegate($councilId: Int!, $participantId: Int!){
        addCouncilDelegate(councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;

const removeCouncilDelegateMutation = gql`
    mutation RemoveCouncilDelegate($councilId: Int!, $participantId: [Int]){
        removeCouncilDelegate(councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;

const DelegationRestriction = ({ translate, council, client, fullScreen, ...props }) => {
    const [participants, setParticipants] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [selectedIds, setselectedIds] = React.useState(new Map());
    const [warningModal, setWarningModal] = React.useState(false);
    const primary = getPrimary();
    const secondary = getSecondary();

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: councilDelegates,
            variables: {
                councilId: council.id
            }
        });

        setParticipants(response.data.councilDelegates.map(item => item.participant));

        setLoading(false);
    }, [council.id]);

    const openSelectModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const openDeleteWarning = participantId => {
        setWarningModal(participantId);
    }

    const closeDeleteWarning = () => {
        setWarningModal(false);
    }

    const addCouncilDelegate = async participantId => {
        const response = await client.mutate({
            mutation: addCouncilDelegateMutation,
            variables: {
                councilId: council.id,
                participantId: participantId
            }
        });

        if (response.data.addCouncilDelegate) {
            getData();
        }
    }

    const renderWarningText = () => {
        //TRADUCCION
        return (
            <div>
                Si quita a este usuario de la lista se le borrarán todos las posibles delegaciones que tenga asignadas. ¿Continuar?
            </div>
        )
    }

    const removeCouncilDelegate = async participantId => {
        let arrayIds = []
        if (selectedIds.size > 0) {
            arrayIds = Array.from(selectedIds.keys());
        }
        const response = await client.mutate({
            mutation: removeCouncilDelegateMutation,
            variables: {
                councilId: council.id,
                participantId: selectedIds.size > 0 ? arrayIds : [participantId]
            }
        })

        if (response.data.removeCouncilDelegate.success) {
            setselectedIds(new Map());
            getData();
            setWarningModal(false)
        }
    }

    const select = id => {
        if (selectedIds.has(id)) {
            selectedIds.delete(id);
        } else {
            selectedIds.set(id, 'selected');
        }

        setselectedIds(new Map(selectedIds));
    }

    const selectAll = () => {
        const newSelected = new Map();
        if (selectedIds.size !== participants.length) {
            participants.forEach(participant => {
                newSelected.set(participant.id, 'selected');
            })
        }

        setselectedIds(newSelected);
    }

    React.useEffect(() => {
        getData()
    }, [getData]);


    const _renderBody = () => {
        if (!isMobile) {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <SectionTitle
                        text={'Pueden recibir delegaciones: ' /*TRADUCCION*/}
                        color={primary}
                        style={{
                            marginTop: '1.6em'
                        }}
                    />
                    <div style={{ paddingBottom: "1em" }}>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "115px" }}>
                                <BasicButton
                                    color={getPrimary()}
                                    textStyle={{
                                        color: "white",
                                        fontWeight: "700",
                                        fontSize: "0.9em",
                                        textTransform: "none",
                                        fontWeight: "500",
                                        minWidth: "100px"
                                    }}
                                    textPosition="after"
                                    buttonStyle={{
                                        marginRight: "1em",
                                        borderRadius: "1px",
                                        boxShadow: "none",
                                        marginBottom: "0.5em"
                                    }}
                                    onClick={openSelectModal}
                                    text={"Seleccionar"} //TRADUCCION
                                >
                                </BasicButton>
                                {participants.length > 0 &&
                                    <BasicButton
                                        color={'white'}
                                        textStyle={{
                                            color: primary,
                                            fontWeight: "700",
                                            fontSize: "0.9em",
                                            textTransform: "none",
                                            fontWeight: "500",
                                            borderRadius: '2px',
                                            border: `solid 2px ${primary}`,
                                            minWidth: "100px"
                                        }}
                                        textPosition="after"
                                        buttonStyle={{
                                            marginRight: "1em",
                                            borderRadius: "1px",
                                            boxShadow: "none"
                                        }}
                                        text={translate.all_plural} //TRADUCCION
                                        onClick={() => {
                                            selectAll()
                                            setWarningModal(true);
                                        }}
                                    >
                                    </BasicButton>
                                }
                            </div>
                            <div style={{ width: "100%" }}>
                                {participants.map(participant => (
                                    <Etiqueta
                                        participant={participant}
                                        removeCouncilDelegate={removeCouncilDelegate}
                                        openDeleteWarning={openDeleteWarning}
                                        council={council}
                                        key={`participant_${participant.id}`}
                                        translate={translate}
                                    />
                                ))}
                                {participants.length === 0 &&
                                    <Etiqueta
                                        empty={true}
                                        translate={translate}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <DelegationsRestrictionModal
                        translate={translate}
                        council={council}
                        open={modal}
                        addCouncilDelegate={addCouncilDelegate}
                        requestClose={closeModal}
                        participantsTable={participants}
                    />
                    <AlertConfirm
                        requestClose={closeDeleteWarning}
                        open={!!warningModal}
                        title={translate.warning}
                        acceptAction={() => removeCouncilDelegate(warningModal)}
                        buttonAccept={translate.accept}
                        buttonCancel={translate.cancel}
                        bodyText={renderWarningText()}
                    />
                </div >
            )
        } else {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <SectionTitle
                        text={'Pueden recibir delegaciones: ' /*TRADUCCION*/}
                        color={primary}
                        style={{
                            marginTop: '1.6em'
                        }}
                    />
                    <div style={{ paddingBottom: "1em" }}>
                        <BasicButton
                            color={"white"}
                            textStyle={{
                                color: primary,
                                fontWeight: "700",
                                fontSize: "0.9em",
                                textTransform: "none"
                            }}
                            textPosition="after"
                            buttonStyle={{
                                marginRight: "1em",
                                border: `2px solid ${primary}`
                            }}
                            onClick={openSelectModal}
                            text={'Añadir'}
                        >
                        </BasicButton>
                    </div>
                    {participants.map(participant => (
                        <div key={`participant_${participant.id}`}>
                            <Card style={{ padding: "1em", display: "flex", justifyContent: "space-between", marginBottom: "1em" }}>
                                <div>
                                    <div><b> {translate.name} </b>: {participant.name}</div>
                                    <div><b> {translate.surname} </b>: {participant.surname}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }} >
                                    <i
                                        className={"fa fa-times"}
                                        style={{ color: "#000000de" }}
                                        onClick={() => {
                                            if (council.state < 5) {
                                                removeCouncilDelegate(participant.id)
                                            } else {
                                                openDeleteWarning(participant.id);
                                            }
                                        }}
                                    >
                                    </i>

                                </div>

                            </Card>
                        </div>
                    ))}
                    <DelegationsRestrictionModal
                        translate={translate}
                        council={council}
                        open={modal}
                        addCouncilDelegate={addCouncilDelegate}
                        requestClose={closeModal}
                        participantsTable={participants}
                    />
                    <AlertConfirm
                        requestClose={closeDeleteWarning}
                        open={!!warningModal}
                        title={translate.warning}
                        acceptAction={() => removeCouncilDelegate(warningModal)}
                        buttonAccept={translate.accept}
                        buttonCancel={translate.cancel}
                        bodyText={renderWarningText()}
                    />
                </div>
            )
        }
    }

    return (
        fullScreen ?
            <div>
                {_renderBody()}
            </div>
            :
            <div style={{ padding: "1em", marginTop: "1em", maxWidth: isMobile ? "100%" : "70%" }}>
                {_renderBody()}
            </div>
    );

}

const Etiqueta = ({ participant, removeCouncilDelegate, openDeleteWarning, council, empty, translate }) => {

    if (empty) {
        return (
            <div
                color={"white"}
                style={{
                    background: "white",
                    color: "black",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "none",
                    fontWeight: "500",
                    cursor: 'initial',
                    marginRight: "1em",
                    borderRadius: "1px",
                    boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                    border: 'solid 1px #f0f3f6',
                    display: "inline-block",
                    marginBottom: "0.5em",
                    minWidth: "100px"
                }}
            >
                <div style={{ padding: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ marginLeft: "15px", marginRight: "15px" }}>
                        {translate.all_plural}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                color={"white"}
                style={{
                    background: "white",
                    color: "black",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "none",
                    fontWeight: "500",
                    cursor: 'initial',
                    marginRight: "1em",
                    borderRadius: "1px",
                    boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                    border: 'solid 1px #f0f3f6',
                    display: "inline-block",
                    marginBottom: "0.5em",
                    minWidth: "100px"
                }}
            >
                {/* //TRADUCCION */}
                <div style={{ padding: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ marginLeft: "15px" }}>
                        {participant.name + " " + participant.surname}
                    </div>
                    <div style={{ marginLeft: "5px", marginRight: "3px", display: "flex" }}>
                        <ButtonIcon
                            type="cancel"
                            style={{ cursor: "pointer" }}
                            color={getPrimary()}
                            onClick={() => {
                                if (council.state < 5) {
                                    removeCouncilDelegate(participant.id)
                                } else {
                                    openDeleteWarning(participant.id);
                                }
                            }} />
                    </div>
                </div>
            </div>
        );
    }
}


export default withApollo(DelegationRestriction);