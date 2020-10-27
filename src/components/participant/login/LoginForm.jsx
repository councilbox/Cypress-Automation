import React from "react";
import { Tooltip, Card, Table, TableBody, TableRow } from "material-ui";
import * as mainActions from "../../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bHistory } from "../../../containers/App";
import withTranslations from "../../../HOCs/withTranslations";
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { ButtonIcon, TextInput, BasicButton, AlertConfirm, HelpPopover, LoadingSection, Checkbox, Scrollbar } from "../../../displayComponents";
import { councilStarted, participantNeverConnected, hasAccessKey } from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { useOldState, useCountdown, useSendRoomKey, useInterval } from "../../../hooks";
import { withApollo } from 'react-apollo';
import LoginWithCert from "./LoginWithCert";
import ContactAdminButton from "./ContactAdminButton";
import SMSStepper from "./SMSAccess/SMSStepper";
import { isMobile } from "react-device-detect";
import videoCamera from '../../../../src/assets/img/video-camera.svg';
import folder from '../../../../src/assets/img/folder-1.svg';
import upload from '../../../../src/assets/img/upload.svg';
import { Icon } from "material-ui";
import { TableCell } from "material-ui";

const styles = {
    loginContainerMax: {
        width: "100%",
        height: "100%",
        padding: '1em',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    loginContainer: {
        width: "100%",
        height: "100%",
        padding: '1em',
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

const LoginForm = ({ participant, translate, company, council, client, ...props }) => {
    const [loading, setLoading] = React.useState(true);
    const [state, setState] = useOldState({
        password: "",
        sendPassModal: council.securityType !== 0 ? true : false,
        showPassword: false,
        errors: {
            email: "",
            password: ""
        },
        hover: false,
        helpPopover: true,
        modal: false
    });
    const [sends, setSends] = React.useState(null);
    const [responseSMS, setResponseSMS] = React.useState('');
    const { secondsLeft, setCountdown } = useCountdown(0);
    const [loadingKey, sendKey] = useSendRoomKey(client, participant);
    const [inputSearch, setInputSearch] = React.useState(false);
    const [uploadFile, setUploadFile] = React.useState(false);
    const primary = getPrimary();
    const secondary = getSecondary();

    const getData = React.useCallback(async value => {
        const response = await client.query({
            query: participantSend,
            variables: {
                councilId: council.id,
                participantId: participant.id,
                options: {
                    offset: 0,
                    limit: 20
                }
            }
        });

        if (response.data.participantSend.list) {
            setSends(response.data.participantSend.list);
        }
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        if (council.securityType === 2) {
            getData();
        }
    }, [getData, council.id]);

    useInterval(getData, responseSMS === 20 ? 5000 : null);

    React.useEffect(() => {
        if (sends && sends.length > 0) {
            const lastSend = sends[sends.length - 1];
            const end = moment(new Date());
            const start = moment(lastSend.sendDate);
            const duration = moment.duration(start.diff(end));
            const seconds = duration.asSeconds();
            if (seconds > -60) {
                setCountdown(Math.round(60 + seconds));
            }
            setResponseSMS(lastSend.reqCode);
        }
    }, [sends]);

    const checkFieldsValidationState = () => {
        let errors = {
            password: ""
        };

        if (council.securityType === 0 || council.securityType == 3) {
            errors.password = "";
        } else {
            errors.password =
                !(state.password.length > 0) ? translate.field_required : "";
        }

        setState({
            ...state,
            errors
        });

        return errors.password === "";
    };

    const handleChange = (field, event) => {
        const newState = {};
        newState[field] = event.target.value;
        setState(newState, checkFieldsValidationState);
    }

    const showSendPassModal = () => {
        setState({
            sendPassModal: true
        });
    }

    const closeSendPassModal = () => {
        setState({
            sendPassModal: false,
            phoneError: ''
        })
    }

    const login = async () => {
        const isValidForm = checkFieldsValidationState();
        if (hasAccessKey(council)) {
            try {
                const response = await props.checkParticipantKey({
                    variables: {
                        participantId: participant.id,
                        key: +state.password
                    }
                });

                if (!response.data.checkParticipantKey.success) {
                    setState({
                        errors: {
                            password: translate.incorrect_access__key
                        }
                    });
                    return;
                }
            } catch (error) {
                setState({
                    errors: {
                        password: translate.incorrect_access__key
                    }
                });
                return;
            }
        }
        if (isValidForm) {
            handleSuccess();
        }

    };

    const handleSuccess = () => {
        props.actions.participantLoginSuccess();
        bHistory.push(`/participant/${participant.id}/council/${council.id}/${participant.roomType === 'MEETING' ? 'meet' : 'council'}`);
    }

    const handleKeyUp = event => {
        if (event.nativeEvent.keyCode === 13) {
            login();
        }
    };

    const _tooltipContent = () => {
        const securityTypes = {
            1: translate.key_should_receive_email,
            2: translate.key_must_receive_sms
        }

        return securityTypes[council.securityType];
    }

    const sendParticipantRoomKey = async () => {
        setState({
            loading: true,
            modal: true
        });
        const response = await sendKey();
        if (!response.data.sendMyRoomKey.success) {
            setResponseSMS(-2);
        } else {
            setResponseSMS(20);
        }
        setCountdown(60);
    }

    const showHiddenPhone = num => {
        if (!num) {
            return '';
        }

        return num.toString().substr(num.length - 4);
    }

    const success = !!responseSMS && (responseSMS === 20 || responseSMS === 22 || responseSMS === 25);
    const error = !!responseSMS && !success;

    const renderAccessButton = () => {
        if (council.securityType === 3) {
            return (
                <LoginWithCert
                    translate={translate}
                    participant={participant}
                    handleSuccess={handleSuccess}
                    status={props.status}
                    message={props.message}
                    dispatch={props.updateState}
                />
            )
        }

        if (council.securityType === 0 || council.securityType === 1) {
            return (
                <div style={styles.enterButtonContainer}>
                    <BasicButton
                        text={translate.enter_room}
                        color={primary}
                        textStyle={{
                            color: "white",
                            fontWeight: "700"
                        }}
                        textPosition="before"
                        fullWidth={true}
                        icon={
                            <ButtonIcon
                                color="white"
                                type="directions_walk"
                            />
                        }
                        onClick={login}
                    />
                </div>
            )
        }

        const disabled = secondsLeft > 0 && error;

        const buttons = <div style={{ margin: "0 auto", marginTop: "1em", display: isMobile ? "" : "flex", justifyContent: "space-between", width: "90%", }}>
            <ContactAdminButton
                participant={participant}
                council={council}
                translate={translate}
                open={state.sendPassModal}
                fullWidth={isMobile}
                requestclose={closeSendPassModal}
                council={council}
            />
            <BasicButton
                text={disabled ? translate.sms_sent_seconds_left.replace('secondsLeft', secondsLeft) :
                    success ? translate.enter_room : translate.request_access_code}
                color={primary}
                textStyle={{
                    color: "white",
                    fontWeight: "700",
                    marginTop: isMobile ? "1em" : ""
                }}
                disabled={disabled}
                buttonStyle={{
                    minWidth: '200px'
                }}
                textPosition="before"
                fullWidth={isMobile}
                onClick={
                    success ?
                        login
                        :
                        sendParticipantRoomKey
                }
            />
        </div>

        return (
            <>
                {buttons}
                {/* no recibi el sms, un state para abrir y modal */}
                <AlertConfirm
                    open={!!responseSMS && state.modal}
                    requestClose={() => setState({ modal: false })}
                    bodyText={
                        <div style={{ margin: isMobile ? "4em 0em 2em" : "4em 4em 2em" }}>
                            {loading ?
                                <LoadingSection />
                                :
                                <React.Fragment>
                                    <div style={{ textAlign: "center", color: "black", fontWeight: "bold" }}>
                                        {responseSMS &&
                                            <>
                                                {success &&
                                                    `${translate.sms_sent_to_phone} ...${showHiddenPhone(participant.phone)}`
                                                }
                                                {error &&
                                                    <div style={{ fontWeight: "bold", color: "#f11a1a", marginTop: "2em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <div style={{ width: "90%", }}>
                                                            {translate.sms_error_description}
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                    <div style={{ margin: "0 auto", marginTop: "1em", display: isMobile ? "" : "flex", justifyContent: "space-between", width: "90%", }}>
                                        <ContactAdminButton
                                            participant={participant}
                                            council={council}
                                            translate={translate}
                                            open={state.sendPassModal}
                                            fullWidth={isMobile}
                                            requestclose={closeSendPassModal}
                                            council={council}
                                        />
                                        {!success ?
                                            <BasicButton
                                                text={disabled ? translate.sms_sent_seconds_left.replace('secondsLeft', secondsLeft) :
                                                    success ? translate.enter_room : translate.request_access_code}
                                                color={primary}
                                                textStyle={{
                                                    color: "white",
                                                    fontWeight: "700",
                                                    marginTop: isMobile ? "1em" : ""
                                                }}
                                                disabled={disabled}
                                                buttonStyle={{
                                                    minWidth: '200px'
                                                }}
                                                textPosition="before"
                                                fullWidth={isMobile}
                                                onClick={
                                                    success ?
                                                        login
                                                        :
                                                        sendParticipantRoomKey
                                                }
                                            />
                                            :
                                            <BasicButton
                                                text={translate.close}
                                                color={primary}
                                                textStyle={{
                                                    color: "white",
                                                    fontWeight: "700",
                                                    marginTop: isMobile ? "1em" : ""
                                                }}
                                                buttonStyle={{
                                                    minWidth: '200px'
                                                }}
                                                textPosition="before"
                                                fullWidth={isMobile}
                                                onClick={() => setState({ modal: false })}
                                            />
                                        }
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    }
                />
            </>
        )
    }

    const { password, errors, showPassword } = state;
    /********MJUDOCUMENTACION*************/
    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center', }}>
                <div style={{
                    width: "100%",
                    paddingLeft: "4px",
                }}>
                    <div style={{ padding: "1em", paddingTop: "2em", display: "flex" }} >
                        <div style={{ color: '#154481', fontSize: '1.9em', marginRight: "1em" }}>Aaron Fuentes</div>
                        <div style={{ color: 'black', fontSize: '1.9em', }}>Su documentación</div>
                    </div>
                    <div style={{ padding: "1em", paddingBottom: "1em", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #154481" }}>
                        <div>
                            <BasicButton
                                text={
                                    <div style={{ display: "flex" }}>
                                        <div>
                                            <img
                                                src={upload}
                                                style={{
                                                    paddingRight: "5px"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            Subir nuevo
                                    </div>
                                    </div>
                                }
                                color={' #154481'}
                                textStyle={{
                                    color: "white",
                                    fontWeight: "700",
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                                    padding: "5px 16px",
                                    minHeight: "0"
                                }}
                                textPosition="before"
                                fullWidth={true}
                                onClick={() => setUploadFile(true)}
                            />
                        </div>
                        <div>
                            <TextInput
                                className={isMobile && !inputSearch ? "openInput" : ""}
                                disableUnderline={true}
                                styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px" }}
                                stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
                                adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
                                floatingText={" "}
                                type="text"
                                value={''}
                                placeholder={isMobile ? "" : translate.search}
                                // onChange={event => {
                                //     setSearch(event.target.value);
                                // }}
                                styles={{ marginTop: "-16px" }}
                                stylesTextField={{ marginBottom: "0px" }}
                            />
                        </div>

                    </div>
                    <div style={{ display: "flex", justifyContent: "center", }}>
                        <div style={{ marginTop: "2em", height: '100%', marginBottom: "2em" }}>
                            <Table style={{ width: '100%', minWidth: "900px" }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797",
                                            width: '40%'
                                        }}>
                                            {translate.name}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            {translate.type}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            {translate.last_edit}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            {translate.size}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }} />
                                    </TableRow>
                                    <TableRow style={{ cursor: 'pointer' }} >
                                        <TableCell>
                                            name
                                                    </TableCell>
                                        <TableCell>
                                            tippo
                                            </TableCell>
                                        <TableCell>
                                            modifi
                                            </TableCell>
                                        <TableCell >
                                            77mb
                                            </TableCell>
                                        <TableCell>
                                            <i class="fa fa-trash-o" style={{ color: "red", fontSize: '18px' }}></i>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow style={{ cursor: 'pointer' }} >
                                        <TableCell>
                                            name
                                                    </TableCell>
                                        <TableCell>
                                            tippo
                                            </TableCell>
                                        <TableCell>
                                            modifi
                                            </TableCell>
                                        <TableCell >
                                            77mb
                                            </TableCell>
                                        <TableCell>
                                            <i class="fa fa-trash-o" style={{ color: "red", fontSize: '18px' }}></i>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow style={{ cursor: 'pointer' }} >
                                        <TableCell>
                                            name
                                                    </TableCell>
                                        <TableCell>
                                            tippo
                                            </TableCell>
                                        <TableCell>
                                            modifi
                                            </TableCell>
                                        <TableCell >
                                            77mb
                                            </TableCell>
                                        <TableCell>
                                            <i class="fa fa-trash-o" style={{ color: "red", fontSize: '18px' }}></i>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow style={{ cursor: 'pointer' }} >
                                        <TableCell>
                                            name
                                                    </TableCell>
                                        <TableCell>
                                            tippo
                                            </TableCell>
                                        <TableCell>
                                            modifi
                                            </TableCell>
                                        <TableCell >
                                            77mb
                                            </TableCell>
                                        <TableCell>
                                            <i class="fa fa-trash-o" style={{ color: "red", fontSize: '18px' }}></i>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <AlertConfirm
                    open={uploadFile}
                    requestClose={() => setUploadFile(false)}
                    bodyText={
                        <div style={{ maxWidth: "700px", margin: "1em", marginTop: "2em" }}>
                            <div style={{ color: "black", fontSize: "20px", marginBottom: "1em", textAlign: "center" }}>Seleccione los archivos de su ordenador</div>
                            <div style={{ marginBottom: "1em", display: "flex", justifyContent: "center" }}>
                                <BasicButton
                                    text={'Seleccionar archivos'}
                                    color={' #154481'}
                                    textStyle={{
                                        color: "white",
                                        fontWeight: "700",
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                                        maxWidth: "300px"
                                    }}
                                    textPosition="before"
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ color: '#154481', textAlign: "center", marginBottom: "2em" }}>O arrastrelos y suéltelos en esta pantalla</div>
                            <div style={{ color: 'black', marginBottom: "1em", }}>
                                <Checkbox
                                    // value={isChecked(item.id)}
                                    // onChange={(event, isInputChecked) => {
                                    //     checkUser(item, isInputChecked)
                                    // }}
                                    styleLabel={{ alignItems: "unset", fontSize: "14px", color: "black" }}
                                    styleInLabel={{ fontSize: "14px", color: "black" }}
                                    label={"Confirmo y acepto la normativa de tratatimento de datos del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos) (Texto pertinente a efectos del EEE)"}
                                />
                            </div>
                        </div>
                    }
                />
            </div>
        </div>

    );
    /********MJUSMS*************/
    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center', padding: '1em 3em 1em 3em', }}>
                <div style={{
                    width: "100%",
                    paddingLeft: "4px",
                }}>
                    <div style={{ textAlign: "center", padding: "1em", paddingTop: "1.5em" }} >
                        <Tooltip
                            title={council.businessName}
                            placement={"top"}
                            enterDelay={300}
                            leaveDelay={300}
                        >
                            {!!company.logo ?
                                <img
                                    src={company.logo}
                                    alt="company_logo"
                                    style={{
                                        maxWidth: '130px',
                                        maxHeight: '80px',
                                        marginBottom: "1em",
                                    }}
                                />
                                :
                                <i className="fa fa-building-o" style={{ fontSize: '75px', color: 'grey', marginBottom: '10px' }} />
                            }
                        </Tooltip>
                    </div>
                    <div style={{ textAlign: "center", padding: "1em", paddingTop: "2em", }} >
                        <h3 style={{ color: 'black', fontSize: '1.9em', }}>Bienvenido al portal de citas del Ministerio de Justicia </h3>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", }}>
                        <div style={{ width: '280px', }}>
                            <div style={{ textAlign: "center", padding: "1em", }}>
                                <TextInput
                                    styleFloatText={{ fontSize: "20px", color: '#154481' }}
                                    floatingText={'Código recibido por SMS'}
                                    type="email"
                                    fullWidth
                                    errorText={errors.email}
                                    value={participant.email}
                                // disabled={true}
                                />
                            </div>
                            <div style={{ textAlign: "center", padding: "1em", paddingBottom: "1em" }}>
                                <BasicButton
                                    text={'Validar'}
                                    color={' #154481'}
                                    textStyle={{
                                        color: "white",
                                        fontWeight: "700",
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)'
                                    }}
                                    textPosition="before"
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ textAlign: "center", padding: "1em", paddingBottom: "2em" }}>
                                <BasicButton
                                    text={' No he recbidio ningún SMS'}
                                    color={'white'}
                                    textStyle={{
                                        color: "#154481",
                                        boxShadow: "none"
                                    }}
                                    textPosition="before"
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
    /********login0*************/
    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: "100%",
                    paddingLeft: "4px",
                    color: '#154481',
                }}>
                    <div style={{ textAlign: "center", padding: "1em", paddingTop: "2em", }} >
                        <h3 style={{ color: '#154481', fontSize: '14px', }}>Para acceder debe confirmar la aceptacion del tratamiento de sus datos </h3>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", }}>
                        <div style={{ textAlign: "center", padding: "1em", paddingRight: '3em' }}>
                            <img src={videoCamera} style={{ marginRight: '0.6em', marginBottom: "0.5em" }} />
                            <div>Grabación de voz y video</div>
                        </div>
                        <div style={{ textAlign: "center", padding: "1em", paddingBottom: "2em" }}>
                            <img src={folder} style={{ marginRight: '0.6em', marginBottom: "0.5em" }} />
                            <div>Almacenamiento de datos</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", color: "black", maxWidth: "600px", marginBottom: "1em" }}>
                        <div>
                            <Checkbox
                                // value={isChecked(item.id)}
                                // onChange={(event, isInputChecked) => {
                                //     checkUser(item, isInputChecked)
                                // }}
                                styleLabel={{ alignItems: "unset" }}
                                label={"Confirmo y acepto la normativa de tratatimento de datos del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos) (Texto pertinente a efectos del EEE)"}
                            />
                        </div>
                    </div>
                    <div style={{ textAlign: "center", padding: "1em", paddingBottom: "2em", display: "flex", justifyContent: "center" }}>
                        <BasicButton
                            text={'Acceso seguro'}
                            color={' #154481'}
                            textStyle={{
                                color: "white",
                                fontWeight: "700",
                                borderRadius: '4px',
                                boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                                width: "300px"
                            }}
                            textPosition="before"
                            fullWidth={true}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
    /********login*************/
    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: "100%",
                    paddingLeft: "4px",
                }}>
                    <div style={{ textAlign: "center", padding: "1em", paddingTop: "2em", }} >
                        <h3 style={{ color: '#154481', fontSize: '1.9em', }}>Cita nombre - 13/04/2020</h3>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", }}>
                        <div style={{ width: '280px', }}>
                            <div style={{ textAlign: "center", padding: "1em", }}>
                                <TextInput
                                    styleFloatText={{ fontSize: "20px", color: '#154481' }}
                                    floatingText={translate.email}
                                    type="email"
                                    fullWidth
                                    errorText={errors.email}
                                    value={participant.email}
                                // disabled={true}
                                />
                            </div>
                            <div style={{ textAlign: "center", padding: "1em", paddingBottom: "2em" }}>
                                <BasicButton
                                    text={'Login'}
                                    color={' #154481'}
                                    textStyle={{
                                        color: "white",
                                        fontWeight: "700",
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)'
                                    }}
                                    textPosition="before"
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: "100%",
                    paddingLeft: "4px"
                }}>
                    <div style={{ textAlign: "center", padding: "1em" }} >
                        <Tooltip
                            title={council.businessName}
                            placement={"top"}
                            enterDelay={300}
                            leaveDelay={300}
                        >
                            {!!company.logo ?
                                <img
                                    src={company.logo}
                                    alt="company_logo"
                                    style={{
                                        maxWidth: '130px',
                                        maxHeight: '80px',
                                        marginBottom: "1em"
                                    }}
                                />
                                :
                                <i className="fa fa-building-o" style={{ fontSize: '75px', color: 'grey', marginBottom: '10px' }} />
                            }
                        </Tooltip>
                        <h3 style={{ color: secondary, fontSize: '1.8em' }}>{council.name}</h3>
                        <span>
                            {moment(new Date(council.dateStart)).format("LLL")}
                        </span>

                        {(councilStarted(council) && (council.statute.existsLimitedAccessRoom === 1) && participantNeverConnected(participant)) &&
                            <p>
                                {translate.room_access_close_at}
                                <span style={{ fontWeight: 'bold', marginLeft: '2px' }}>
                                    {
                                        moment(new Date(council.dateRealStart))
                                            .add(council.statute.limitedAccessRoomMinutes, 'm')
                                            .format("HH:mm")
                                    }
                                </span>
                            </p>
                        }
                        {council.securityType === 2 &&
                            <div style={{ color: '#61abb7', fontWeight: 'bold', margin: "1em" }}>
                                {translate.sms_login_description}
                            </div>
                        }
                    </div>

                    <Card elevation={1} style={{ padding: "1.5em", border: "1px solid gainsboro" }}>
                        <form style={{ width: '100%' }}>
                            <TextInput
                                styleFloatText={{ fontSize: "20px" }}
                                floatingText={translate.email}
                                type="email"
                                fullWidth
                                errorText={errors.email}
                                value={participant.email}
                                disabled={true}
                            />

                            {hasAccessKey(council) && (
                                <React.Fragment>
                                    <TextInput
                                        onKeyUp={handleKeyUp}
                                        helpPopoverInLabel={true}
                                        floatingText={council.securityType === 2 ?
                                            (
                                                <div style={{ display: "flex", fontSize: "20px" }}>
                                                    {translate.key_by_sms}
                                                    <div>
                                                        <HelpPopover
                                                            errorText={!!errors.password}
                                                            title={translate.key_by_sms}
                                                            content={_tooltipContent()}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                            :
                                            (
                                                <div style={{ display: "flex" }}>
                                                    {translate.key_by_email}
                                                    <div>
                                                        <HelpPopover
                                                            errorText={!!errors.password}
                                                            title={translate.key_by_email}
                                                            content={_tooltipContent()}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        type={showPassword ? "text" : "password"}
                                        errorText={errors.password}
                                        value={password}
                                        onChange={event =>
                                            handleChange("password", event)
                                        }
                                        required={true}
                                        showPassword={showPassword}
                                        passwordToggler={() =>
                                            setState({
                                                showPassword: !showPassword
                                            })
                                        }
                                    />


                                </React.Fragment>
                            )}
                            {renderAccessButton()}
                        </form>
                    </Card>
                    {error &&
                        <div style={{ fontWeight: "bold", color: "#f11a1a", marginTop: "2em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "90%", }}>
                                {translate.sms_error_description}
                            </div>
                        </div>
                    }
                    {council.securityType === 2 &&
                        <div style={{ marginTop: "1em", marginBottom: "1em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "100%" }}>
                                <SMSStepper
                                    council={council}
                                    translate={translate}
                                    responseSMS={responseSMS}
                                    resendKey={sendParticipantRoomKey}
                                    error={error}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}


const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

const checkParticipantKey = gql`
    mutation CheckParticipantKey($participantId: Int!, $key: Int!){
                    checkParticipantKey(participantId: $participantId, key: $key){
                    success
                message
            }
        }
    `;

const sendParticipantRoomKey = gql`
    mutation SendMyRoomKey{
                    sendMyRoomKey{
                    success
                }
    }
`;


const participantSend = gql`
    query participantSend($councilId: Int!, $filter: String,  $options: OptionsInput, $participantId: Int!,){
                    participantSend(councilId: $councilId, filter: $filter, options: $options, participantId: $participantId){
                    list{
                    liveParticipantId
                sendType
                id
                reqCode
                sendDate
                councilId
                recipient{
                    name
                    id
                    surname
                    phone
                    email
                }
            }
        total
    }
}
`;


export default compose(
    graphql(checkParticipantKey, {
        name: 'checkParticipantKey'
    }),
    graphql(sendParticipantRoomKey, {
        name: 'sendParticipantRoomKey'
    })
)(connect(
    null,
    mapDispatchToProps
)(withTranslations()(withWindowOrientation(withWindowSize(withApollo(LoginForm))))));