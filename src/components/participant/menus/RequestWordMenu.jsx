import React from 'react';
import { Button, Grid } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import DetectRTC from 'detectrtc';
import { AlertConfirm } from '../../../displayComponents';
import { isSafari, isMobile } from 'react-device-detect';
import FontAwesome from "react-fontawesome";
import { useOldState } from '../../../hooks';

const RequestWordMenu = ({ translate, participant, council, ...props }) => {
    const [state, setState] = useOldState({
        alertCantRequestWord: false,
        safariModal: false,
        confirmWordModal: false,
    });

    React.useEffect(() => {
        let interval;
        if(CBX.isAskingForWord(participant)){
            interval = setInterval(() => {
                props.refetchParticipant();
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [participant.requestWord]);

    const secondary = getSecondary();
    const primary = getPrimary();

    const askForWord = async () => {
        if (await checkWordRequisites()) {
            setState({
                loading: true
            });
            await props.changeRequestWord({
                variables: {
                    participantId: participant.id,
                    requestWord: 1,
                }
            });
            await props.refetchParticipant();
            setState({
                loading: false,
                confirmWordModal: false
            });
        } else {
            setState({
                alertCantRequestWord: true,
                confirmWordModal: false
            });
        }
    }

    const updateRTC = () => {
        return new Promise((resolve) => {
            DetectRTC.load(() => resolve());
        })
    }

    const checkWordRequisites = async () => {
        await updateRTC();
        return DetectRTC.audioInputDevices.length > 0;
    }

    const cancelAskForWord = async () => {
        await props.changeRequestWord({
            variables: {
                participantId: participant.id,
                requestWord: 0
            }
        });
        await props.refetchParticipant();

    }

    const closeAlertCantRequest = () => {
        setState({
            alertCantRequestWord: false
        });
    }

    const showSafariAskingModal = () => {
        setState({
            safariModal: true
        });
    }

    const closeSafariModal = () => {
        setState({
            safariModal: false
        });
    }

    const closeWordModal = () => {
        setState({
            confirmWordModal: false
        });
    }

    const showConfirmWord = () => {
        setState({
            confirmWordModal: true
        });
    }

    const _renderAlertBody = () => {
        return (
            <div
                style={{
                    maxWidth: '500px'
                }}
            >
                {translate.sorry_cant_ask_word}
            </div>
        )
    }

    const _renderSafariAlertBody = () => {
        return (
            <div>
                {translate.safari_word_ask_info}
            </div>
        )
    }

    const _renderWordButtonIconMobil = () => {
        const grantedWord = CBX.haveGrantedWord(participant);
        if (grantedWord || CBX.isAskingForWord(participant)) {
            return (
                <div style={{
                    width: props.isPc ? "50%" : "20%",
                    textAlign: "center",
                    paddingTop: '0.35rem',
                    color: grantedWord ? 'grey' : secondary,
                    borderLeft: props.isPc ? "1px solid dimgrey" : "",
                    borderTop: props.isPc ? "1px solid dimgrey" : "",
                }}>
                    <Button
                        className={"NoOutline"}
                        style={{
                            width: '100%', height: "100%", minWidth: "0", padding: '0', margin: "0", fontSize: '10px',
                            color: grantedWord ? 'grey' : secondary,
                        }}
                        onClick={cancelAskForWord}
                    >
                        <div style={{ display: "unset" }}>
                            <div style={{ position: "relative" }}>
                                {grantedWord ? (
                                    <i className="material-icons" style={{
                                        fontSize: '24px', padding: '0', margin: "0",
                                        width: '1em',
                                        height: '1em',
                                        overflow: 'hidden',
                                        userSelect: 'none',
                                        color: primary,
                                    }}>
                                        pan_tool
                                    </i>
                                ) :
                                    <React.Fragment>
                                        <FontAwesome
                                            name={"hourglass-start "}
                                            style={{
                                                top: "-6px",
                                                fontWeight: "bold",
                                                right: "-10px",
                                                position: "absolute",
                                                fontSize: "1rem",
                                                marginRight: '0.3em',
                                                color: primary
                                            }}
                                        />
                                        <i className="material-icons" style={{
                                            fontSize: '24px', padding: '0', margin: "0",
                                            width: '1em',
                                            height: '1em',
                                            overflow: 'hidden',
                                            userSelect: 'none',
                                            color: primary,
                                        }}>
                                            pan_tool
                                        </i>
                                    </React.Fragment>
                                }
                            </div>
                            <div style={{
                                color: 'white',
                                fontSize: '0.55rem',
                                textTransform: "none"
                            }}>
                                {translate.ask_word_short}
                            </div>
                        </div>
                    </Button>
                </div>
            )
        }

        return (
            <div
                style={{
                    width: props.isPc ? "50%" : "20%",
                    textAlign: "center",
                    paddingTop: '0.35rem',
                    color: isSafari ? 'grey' : secondary,
                    borderTop: props.isPc ? "1px solid dimgrey" : "",
                    borderLeft: props.isPc ? "1px solid dimgrey" : ""
                }}
            >
                <Button
                    className={"NoOutline"}
                    style={{ width: '100%', height: "100%", minWidth: "0", padding: '0', margin: "0", fontSize: '10px', }}
                    onClick={isSafari ? showSafariAskingModal : showConfirmWord}
                >
                    <div style={{ display: "unset" }}>
                        <div style={{ position: "relative" }}>
                            {state.loading &&
                                <FontAwesome
                                    name={"circle-o-notch fa-spin"}
                                    style={{
                                        top: "-8px",
                                        fontWeight: "bold",
                                        right: "-10px",
                                        position: "absolute",
                                        fontSize: "1rem",
                                        marginRight: '0.3em',
                                        color: secondary
                                    }}
                                />
                            }
                            <FontAwesome
                                name={"hand-paper-o"}
                                style={{
                                    color: isSafari ? 'grey' : "#ffffffcc",
                                    fontSize: '24px',
                                    width: '1em',
                                    height: '1em',
                                    overflow: 'hidden',
                                    userSelect: 'none'
                                }}
                            />
                        </div>
                        <div style={{
                            fontSize: '0.55rem',
                            textTransform: "none",
                            color: isSafari ? 'grey' : "#ffffffcc",
                        }}>
                            {translate.ask_word_short}
                        </div>
                    </div>
                </Button>
            </div>
        )
    }

    const grantedWord = CBX.haveGrantedWord(participant);
    const fixedURLMode = (props.videoURL && !props.videoURL.includes('councilbox') || props.videoURL.includes('rivulet') );

    return (
        <React.Fragment>
            {!fixedURLMode ?
                _renderWordButtonIconMobil()
                :
                <div style={{
                    width: props.isPc ? "50%" : "20%",
                    borderLeft: props.isPc ? "1px solid dimgrey" : "",
                    borderTop: props.isPc ? "1px solid dimgrey" : "",
                }}>
                </div>
            }


            <AlertConfirm
                requestClose={() => setState({ alertCantRequestWord: false })}
                open={state.alertCantRequestWord}
                fullWidth={false}
                acceptAction={closeAlertCantRequest}
                buttonAccept={translate.accept}
                bodyText={_renderAlertBody()}
                title={translate.error}
            />
            <AlertConfirm
                requestClose={closeSafariModal}
                open={state.safariModal}
                fullWidth={false}
                acceptAction={closeSafariModal}
                buttonAccept={translate.accept}
                bodyText={_renderSafariAlertBody()}
                title={translate.warning}
            />
            <AlertConfirm
                requestClose={closeWordModal}
                open={state.confirmWordModal}
                acceptAction={askForWord}
                cancelAction={closeWordModal}
                title={translate.warning}
                bodyText={translate.will_ask_for_word}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
            />

            {grantedWord && props.avisoVideoState &&
                <Grid item xs={isMobile?12:12} md={8} style={{
                    transition: "all .3s ease-in-out",
                    display: "flex",
                    position: "fixed",
                    minHeight: '50px',
                    top: "6.7rem",
                    left: "0",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: '1010',
                }}
                >
                    <div style={{
                        width: '100vw',
                        marginLeft: "10px",
                        paddingRight: "6px",
                        height: '50px',
                    }}
                    >
                        <div style={{
                            borderTop: "1px solid gainsboro",
                            borderRadiusTopLeft: "5px",
                            position: "relative",
                            width: "100%", height: "100%",
                            background: "white",
                        }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: "15px",
                                    color: secondary,
                                    paddingLeft: '10px'
                                    }}
                                >
                                <div style={{ marginRight: "10px", marginTop: "4px" }}>
                                    <FontAwesome
                                        name={"info-circle"}
                                        style={{
                                            fontSize: "1.4em",
                                        }}
                                    />
                                </div>
                                <div>
                                    {translate.word_gived}
                                </div>
                                <div>
                                    <FontAwesome
                                        name={"close"}
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "1.5em",
                                            color: secondary,
                                            position: "absolute",
                                            right: "12px",
                                            top: "8px"
                                        }}
                                        onClick={props.avisoVideoStateCerrar}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
            }
        </React.Fragment>
    )

}

const changeRequestWord = gql`
    mutation ChangeRequestWord($participantId: Int!, $requestWord: Int!){
            changeRequestWord(participantId: $participantId, requestWord: $requestWord){
            success
            message
        }
    }
`;

export default graphql(changeRequestWord, {
    name: 'changeRequestWord'
})(withTranslations()(RequestWordMenu));