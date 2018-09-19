import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Tooltip } from 'material-ui';
import { CircularProgress } from "material-ui/Progress";
import gql from 'graphql-tag';
import { checkIsWebRTCCompatibleBrowser } from '../../../../utils/webRTC';
import DetectRTC from 'detectrtc';

class RecordingButton extends React.Component {

    state = {
        loading: false,
        disabled: false
    }

    timeout = null;

    componentDidMount() {
        DetectRTC.load();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data.loading && !this.props.data.loading) {
            if (this.props.council.fullVideoRecord === 1) {
                this.startFullRecording();
            }
        }
    }

    startFullRecording = async () => {
        const { sessionStatus } = this.props.data;
        if (!sessionStatus || !checkIsWebRTCCompatibleBrowser(DetectRTC)) {
            return;
        }

        if (!sessionStatus.record) {
            setTimeout(async () => {
                await this.toggleRecordings();
                this.setState({
                    disabled: true
                });
            }, 5000);
        }
    }

    toggleRecordings = async () => {
        if (!this.state.disabled) {
            this.setState({
                loading: true
            });

            const variables = {
                councilId: this.props.council.id
            }

            const response = this.props.data.sessionStatus.record ?
                await this.props.stopRecording({ variables })
                :
                await this.props.startRecording({ variables });

            console.log(response);

            if (response) {
                await this.props.data.refetch();
                this.setState({
                    loading: false
                });
            }
        }
    }

    render() {
        const { sessionStatus } = this.props.data;
        console.log(sessionStatus);
        if (!sessionStatus || !checkIsWebRTCCompatibleBrowser(DetectRTC)) {
            return <span />
        }

        if (!this.props.config.recording) {
            return <span />;
        }

        const { record } = sessionStatus;

        return (
            <Tooltip title={this.props.council.fullVideoRecord === 1 ? 'Grabación íntegra' : record ? 'Parar grabación' : 'Iniciar grabación'} /*TRADUCCION*/>
                <div
                    style={{
                        position: 'absolute',
                        top: '1.5em',
                        left: '2em',
                        fontSize: '1.4em',
                        cursor: this.props.council.fullVideoRecord === 1 ? 'auto' : 'pointer'
                    }}
                    {...(this.props.council.fullVideoRecord !== 1 ? { onClick: this.toggleRecordings } : {})}
                >
                    {this.state.loading ?
                        <CircularProgress size={20} thickness={7} color={'secondary'} />
                        :
                        record ?
                            <i className="fa fa-dot-circle-o fadeToggle" style={{ color: 'red' }} />
                            :
                            <i className="fa fa-circle" style={{ color: 'red' }} />
                    }


                </div>
            </Tooltip>
        )
    }
}

const startRecording = gql`
    mutation StartRecording($councilId: Int!){
        startRecording(councilId: $councilId){
            success
            message
        }
    }
`;

const stopRecording = gql`
    mutation StopRecording($councilId: Int!){
        stopRecording(councilId: $councilId){
            success
            message
        }
    }
`;


const sessionStatus = gql`
    query SessionStatus($councilId: Int!){
        sessionStatus(councilId: $councilId){
            record
        }
    }
`;

export default compose(
    graphql(sessionStatus, {
        options: props => ({
            variables: {
                councilId: props.council.id,
            }
        })
    }),
    graphql(startRecording, {
        name: 'startRecording'
    }),
    graphql(stopRecording, {
        name: 'stopRecording'
    })
)(RecordingButton);
