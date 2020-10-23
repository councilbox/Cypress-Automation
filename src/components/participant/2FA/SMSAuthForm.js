import React from 'react';
import { Card, Tooltip } from 'material-ui';
import { BasicButton, TextInput, NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';
import { getPrimary } from '../../../styles/colors';

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


const SMSAuthForm = ({ value, updateValue, send, translate, error }) => {
    return (
        <NotLoggedLayout
            translate={translate}
            helpIcon={true}
            languageSelector={false}
        >
            <Scrollbar>
                <div style={{
                    ...styles.mainContainer,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card style={{
                        ...styles.cardContainer,
                        maxWidth: isMobile ? '100%' : '650px',
                        minWidth: window.innerWidth > 450 ? '550px' : '100%'
                    }} elevation={6}>
                        <div style={{
                            ...styles.loginContainerMax,
                            height: "",
                        }}>
                            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center', padding: '1em 3em 1em 3em', }}>
                                <div style={{
                                    width: "100%",
                                    paddingLeft: "4px",
                                }}>
                                    <div style={{ textAlign: "center", padding: "1em", paddingTop: "2em", }} >
                                        <h3 style={{ color: 'black', fontSize: '1.9em', }}>Bienvenido, para acceder introduzca el código que se ha enviado a su teléfono</h3>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", }}>
                                        <div style={{ width: '280px', }}>
                                            <div style={{ textAlign: "center", padding: "1em", }}>
                                                <TextInput
                                                    styleFloatText={{ fontSize: "20px", color: '#154481' }}
                                                    floatingText={'Código recibido por SMS'}
                                                    type="email"
                                                    fullWidth
                                                    onKeyUp={event => {
                                                        if(event.keyCode === 13){
                                                            send();
                                                        }
                                                    }}
                                                    errorText={error === 'Invalid key' ? 'Clave no válida' : ''}
                                                    value={value}
                                                    onChange={event => updateValue(event.target.value)}
                                                />
                                            </div>
                                            <div style={{ textAlign: "center", padding: "1em", paddingBottom: "1em" }}>
                                                <BasicButton
                                                    text={'Validar'}
                                                    onClick={send}
                                                    color={getPrimary()}
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
                    </Card>
                </div>
            </Scrollbar>
        </NotLoggedLayout>
    );
}

export default SMSAuthForm;