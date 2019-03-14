import React from 'react';
import FontAwesome from "react-fontawesome";
import FloatGroup from 'react-float-button';
import { Grid, Button, Badge } from "material-ui";
import TimelineSection from '../timeline/TimelineSection';
import { darkGrey, secondary, primary } from '../../../styles/colors';
import { AlertConfirm, BasicButton } from '../../../displayComponents';



class CouncilSidebar extends React.Component {

    state = {
        showModalComentario: false,
        modalContent: false,
    };

    toggle(type) {
        this.setState({
            modalContent: this.state.modalContent === type ? false : type
        });
    }

    cerrarTodo() {
        this.setState({
            modalContent: false,
        });
    }

    render() {
        return (
            <div style={{
                float: 'left',
                zIndex: '0'
            }}>
                <div style={{
                    backgroundColor: darkGrey,
                    height: '3.5rem',
                    zIndex: '1000',
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    left: '0px',
                    width: '100vw',
                    alignItems: 'center',
                    bottom: '0px',
                    // overflow: 'hidden',
                    fontSize: "0.55em"
                }}>
                    <div style={{ height: '3.5rem', width: "100vw", display: 'flex', color: '#ffffffcc', }}>

                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem',  }}>
                            <Button className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', overflow: "hidden" }} onClick={() => this.cerrarTodo()}>
                                <div style={{ display: "unset" }}>
                                    <div>
                                        <FontAwesome
                                            name={"video-camera"}
                                            style={{
                                                color: !this.state.modalContent ? secondary : "",
                                                padding: '0', margin: "0",
                                                fontSize: '24px',
                                                width: '1em',
                                                height: '1em',
                                                overflow: 'hidden',
                                                userSelect: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        color: 'white',
                                        fontSize: '0.55rem',
                                        textTransform: "none"
                                    }}>
                                        Video {/*TRADUCCION*/}
                                    </div>
                                </div>
                            </Button>
                        </div>
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem',  }}>
                            <Button
                                className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', }}
                                onClick={() => this.toggle('agenda')}
                            >
                                <div style={{ display: "unset" }}>
                                    <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                        <div>
                                            {/* <FontAwesome
                                                name={"calendar"}
                                                style={{
                                                    padding: '0', margin: "0",
                                                    fontSize: '24px',
                                                    width: '1em',
                                                    height: '1em',
                                                    overflow: 'hidden',
                                                    userSelect: 'none'
                                                }}
                                            /> */}
                                            <i className="material-icons" style={{
                                                color: this.state.modalContent === "agenda" ? secondary : "",
                                                fontSize: '24px', padding: '0', margin: "0",
                                                width: '1em',
                                                height: '1em',
                                                overflow: 'hidden',
                                                userSelect: 'none',
                                            }}>
                                                calendar_today
                                                </i>
                                        </div>
                                    </Badge>
                                    <div style={{
                                        color: 'white',
                                        fontSize: '0.55rem',
                                        textTransform: "none"
                                    }}>
                                        Agenda {/*TRADUCCION*/}
                                    </div>
                                </div>
                            </Button>
                        </div>
                        {this.props.pedirPalabra}

                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            <Button className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', fontSize: '10px', }} onClick={() => this.setState({ showModalComentario: true })}  >
                                <div style={{ display: "unset" }}>
                                    <div>
                                        <i className="material-icons" style={{
                                            fontSize: '24px', padding: '0', margin: "0",
                                            width: '1em',
                                            height: '1em',
                                            overflow: 'hidden',
                                            userSelect: 'none',
                                            color: this.state.showModalComentario ? primary : "#ffffffcc",
                                        }}>
                                            chat_bubble_outline
                                                </i>
                                        {/* <FontAwesome
                                            name={"comment-o"}
                                            style={{
                                                color: this.state.showModalComentario ? primary : "#ffffffcc",
                                                fontSize: '24px',
                                                width: '1em',
                                                height: '1em',
                                                overflow: 'hidden',
                                                userSelect: 'none'
                                            }}
                                        /> */}
                                    </div>
                                    <div style={{
                                        color: "white",
                                        fontSize: '0.55rem',
                                        textTransform: "none"
                                    }}>
                                        Comentario {/*TRADUCCION*/}
                                    </div>
                                </div>
                            </Button>
                        </div>
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem',  }}>
                            <Button
                                className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', fontSize: '10px', }}
                                onClick={() => this.toggle('timeline')}
                            >
                                <div style={{ display: "unset" }}>
                                    <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                        <div>
                                            <FontAwesome
                                                // name={"list-ul"}
                                                name={"file-text-o"}
                                                style={{
                                                    color: this.state.modalContent === "timeline" ? secondary : "",
                                                    fontSize: '24px',
                                                    width: '1em',
                                                    height: '1em',
                                                    overflow: 'hidden',
                                                    userSelect: 'none'
                                                }}
                                            />
                                        </div>
                                    </Badge>
                                    <div style={{
                                        color: 'white',
                                        fontSize: '0.55rem',
                                        textTransform: "none"
                                    }}>
                                        Resumen {/*TRADUCCION*/}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div >
                <AlertConfirm
                    open={!!this.state.modalContent}
                    classNameDialog={'modal100'}
                    PaperProps={{
                        style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%', boxShadow: 'none' }
                    }}
                    bodyStyle={{ maxWidth: '100vw', width: "100%", padding: '0', }}
                    bodyText={
                        <div style={{ height: '100%' }}>
                            {this.state.modalContent === 'agenda' &&
                                this.props.agenda
                            }
                            {this.state.modalContent === 'timeline' &&
                                <TimelineSection
                                    council={this.props.council}
                                />
                            }
                        </div>
                    }
                />
                <AlertConfirm
                    open={this.state.showModalComentario}
                    requestClose={() => this.setState({ showModalComentario: false })}
                    title={this.props.translate.private_comment_for_room_admin}
                    bodyText={
                        <div >
                            {this.props.comentario}
                        </div>
                    }
                />

            </div >
        );
    }
}

export default CouncilSidebar

// <Button className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', }} >
//                                 <div style={{ display: "unset" }}>
//                                     <div>
//                                         <i className="material-icons" style={{
//                                             fontSize: '24px', padding: '0', margin: "0",
//                                             width: '1em',
//                                             height: '1em',
//                                             overflow: 'hidden',
//                                             userSelect: 'none'
//                                         }}>
//                                             pan_tool
//                                                 </i>
//                                     </div>
//                                     <div style={{
//                                         color: 'white',
//                                         fontSize: '0.55rem',
//                                         textTransform: "none"
//                                     }}>
//                                         Palabra {/*TRADUCCION*/}
//                                     </div>
//                                 </div>
//                             </Button>