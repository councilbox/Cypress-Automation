import gql from 'graphql-tag';
import { Icon, Card, Table, TableCell, TableBody, TableRow } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, FileUploadButton, NotLoggedLayout, Scrollbar, TextInput, Checkbox, AlertConfirm } from '../../../displayComponents';
import { addCouncilAttachment } from '../../../queries';
import { moment } from '../../../containers/App';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';
import ParticipantCouncilAttachments from '../agendas/ParticipantCouncilAttachments';


const styles = {
    loginContainerMax: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    loginContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    splittedLoginContainer: {
        width: "100%",
        height: "100%",
        padding: '1em',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    councilInfoContainer: {
        display: "flex",
        width: '100%',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        textAlign: "center"
    },
    loginFormContainer: {
        display: "flex",
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        padding: "15px"
    },
    enterButtonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "35px"
    }
};

const OneOnOneDocumentation = ({ translate, participant, council }) => (
        <NotLoggedLayout
            translate={translate}
            helpIcon={true}
            languageSelector={false}
        >
            <Scrollbar>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card style={{
                        ...styles.cardContainer,
                        maxWidth: isMobile ? '100%' : '80%',
                        minWidth: window.innerWidth > 450 ? '80%' : '100%'
                    }} elevation={6}>
                        <div style={{
                            ...styles.loginContainerMax,
                            height: "",
                        }}>
                            <div style={{
                                ...styles.loginContainerMax,
                                ...(council.securityType !== 0 ? {
                                    height: ""
                                } : {}),
                            }}>
                                <ParticipantCouncilAttachments
                                    translate={translate}
                                    council={council}
                                    participant={participant}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </Scrollbar>
        </NotLoggedLayout>

    )

export default OneOnOneDocumentation;
