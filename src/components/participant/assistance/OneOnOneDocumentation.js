import gql from 'graphql-tag';
import { Icon, Card, Table, TableCell, TableBody, TableRow } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, FileUploadButton, NotLoggedLayout, Scrollbar, TextInput, Checkbox, AlertConfirm } from '../../../displayComponents';
import { addCouncilAttachment } from '../../../queries';
import { moment } from '../../../containers/App';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';
import upload from '../../../../src/assets/img/upload.svg';
import fileSize from 'filesize';
import Dropzone from 'react-dropzone';


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

const OneOnOneDocumentation = ({ translate, participant, client, council, refetch }) => {
    const [data, setData] = React.useState(null);
    const [check, setCheck] = React.useState(false);
    const [checkError, setCheckError] = React.useState('');
    const [uploadFile, setUploadFile] = React.useState(false);
    const primary = getPrimary();

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ParticipantCouncilAttachments{
                    participantCouncilAttachments{
                        id
                        filename
                        creationDate
                        filesize
                        filetype
                    }
                }
            `
        });
        setData(response.data.participantCouncilAttachments);
    });
    
    React.useEffect(() => {
        getData();
    }, [participant.id])

    const onDrop = (accepted, rejected) => {
        console.log(accepted);
		if (accepted.length === 0) {
			return;
		}
		handleFile(accepted[0]);
	}

    const handleFile = async file => {
		if (!file) {
			return;
		}

		let reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = async event => {
			let fileInfo = {
                filename: file.name,
				filetype: file.type,
				filesize: event.loaded,
				base64: btoa(event.target.result),
				councilId: council.id
            };

            await client.mutate({
                mutation: addCouncilAttachment,
				variables: {
					attachment: fileInfo
				}
            });
            getData();
            setUploadFile(false);
		};
    };
    
    return (
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
                                    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center', }}>
                                        <div style={{
                                            width: "100%",
                                            paddingLeft: "4px",
                                        }}>
                                            <div style={{ padding: "1em", paddingTop: "2em", display: "flex" }} >
                                                <div style={{ color: '#154481', fontSize: '1.9em', marginRight: "1em" }}>{`${participant.name} ${participant.surname || ''}`}</div>
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
                                                        color={primary}
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
                                                {/* <div>
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
                                                </div> */}

                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center", width: '100%' }}>
                                                <div style={{ marginTop: "2em", height: '100%', marginBottom: "2em", width: '100%' }}>
                                                    <Table style={{ width: '100%', maxWidth: '100%' }}>
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
                                                            {data && data.map(attachment => {
                                                                return (
                                                                    <TableRow style={{ cursor: 'pointer' }} key={`attachment_${attachment.id}`}>
                                                                        <TableCell>
                                                                            {attachment.filename}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {attachment.filetype}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {moment(attachment.creationDate).format('LLL')}
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            {fileSize(attachment.filesize)}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <i className="fa fa-trash-o" style={{ color: "red", fontSize: '18px' }}></i>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                        <AlertConfirm
                                            open={uploadFile}
                                            requestClose={() => setUploadFile(false)}
                                            bodyText={
                                                <Dropzone
                                                    disabledClick={true}
                                                    disabled={!check}
                                                    onDrop={onDrop}
                                                >
                                                    {({ getRootProps, getInputProps, isDragActive }) => {
                                                        return (
                                                            <div
                                                                style={{ maxWidth: "700px", margin: "1em", marginTop: "2em" }}
                                                                {...getRootProps()}
                                                            >
                                                                <input {...getInputProps()} />
                                                                <div style={{ color: "black", fontSize: "20px", marginBottom: "1em", textAlign: "center" }}>Seleccione los archivos de su ordenador</div>
                                                                <div
                                                                    style={{ marginBottom: "1em", display: "flex", justifyContent: "center" }}
                                                                >    
                                                                    <BasicButton
                                                                        onClick={event => {
                                                                            if(!check){
                                                                                event.stopPropagation();
                                                                                setCheckError(true);
                                                                            }
                                                                        }}
                                                                        text={'Seleccionar archivos'}
                                                                        color={primary}
                                                                        textStyle={{
                                                                            color: "white",
                                                                            fontWeight: "700",
                                                                            fontSize: "0.9em",
                                                                            textTransform: "none"
                                                                        }}
                                                                        loadingColor={'primary'}
                                                                        buttonStyle={{
                                                                            border: `1px solid ${primary}`,
                                                                            height: "100%",
                                                                            marginTop: "5px",
                                                                            borderRadius: '4px',
                                                                            boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                                                                            maxWidth: "300px"
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div style={{ color: '#154481', textAlign: "center", marginBottom: "2em" }}>O arrastrelos y suéltelos en esta pantalla</div>
                                                                {(!check && checkError) &&
                                                                        <div style={{ color: 'red', fontWeight: '700'}}>
                                                                            Es necesaria la confirmación para poder enviar
                                                                        </div>
                                                                    }
                                                                <div style={{ color: 'black', marginBottom: "1em", }}>
                                                                    <Checkbox
                                                                        value={check}
                                                                        onChange={(event, isInputChecked) => {
                                                                            setCheck(isInputChecked);
                                                                        }}
                                                                        styleLabel={{ alignItems: "unset", fontSize: "14px", color: "black" }}
                                                                        styleInLabel={{ fontSize: "14px", color: "black" }}
                                                                        label={"Confirmo y acepto la normativa de tratatimento de datos del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos) (Texto pertinente a efectos del EEE)"}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    }}
                                                </Dropzone>
                                            }
                                        />
                                    </div>
                                </div>
                        {/* <div>

                                <FileUploadButton
                                    color={"white"}
                                    text={translate.add_attachment}
                                    textStyle={{
                                        color: secondary,
                                        fontWeight: "700",
                                        fontSize: "0.9em",
                                        textTransform: "none"
                                    }}
                                    //loading={this.state.uploading}
                                    loadingColor={'primary'}
                                    buttonStyle={{
                                        border: `1px solid ${secondary}`,
                                        height: "100%",
                                        marginTop: "5px"
                                    }}
                                    icon={
                                        <Icon
                                            className="material-icons"
                                            style={{
                                                fontSize: "1.5em",
                                                color: secondary
                                            }}
                                        >
                                            control_point
                                        </Icon>
                                    }
                                    onChange={handleFile}
                                />
                                </div> */}
                        </div>
                    </Card>
                </div>
            </Scrollbar>
        </NotLoggedLayout>
                    
    )
}

export default withApollo(OneOnOneDocumentation)