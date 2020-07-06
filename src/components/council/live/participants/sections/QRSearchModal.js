import React from 'react';
import QrReader from 'react-qr-reader';
import { AlertConfirm, BasicButton, ReactSignature, ParticipantDisplay, Checkbox } from '../../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { PARTICIPANT_STATES } from '../../../../../constants';
import { canBePresentWithRemoteVote } from '../../../../../utils/CBX';
import { changeParticipantState, setLiveParticipantSignature } from '../../../../../queries/liveParticipant';
import { getPrimary } from '../../../../../styles/colors';
import jsQR from "jsqr";


const QRSearchModal = ({ updateSearch, open, requestClose, client, council, translate }) => {
    const [search, setSearch] = React.useState('');
    const [participant, setParticipant] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [participantState, setParticipantState] = React.useState(5);
    const [withSignature, setWithSignature] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const signature = React.useRef();
    const primary = getPrimary();
    const videoRef = React.useRef();
    const canvasRef = React.useRef();

    const initMedia = async () => {
        try {
            if (navigator.mediaDevices) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
            } else {
                //setErrorMedia("Intentando acceder a la camara")
            }
        } catch(error){ 
            if(error.message === "Requested device not found" ){
                //setErrorMedia("No hay camara")
            }
        }
    }

    React.useLayoutEffect(() => {
        let interval;
        if(open && videoRef.current){
            initMedia();
            interval = setInterval(check, 500);
        }
        return () => clearInterval(interval);
    }, [council.id, open, videoRef.current])


    const check = () => {
        const canvasElement = document.getElementById('qr');

        if(canvasElement){
            const canvasCTX = canvasRef.current.getContext('2d');
            canvasCTX.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const result = jsQR(canvasCTX.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data, canvasRef.current.width, canvasRef.current.height);
            if(result){
                setSearch(result.data);
            }
        }
    }

    const _canBePresentWithRemoteVote = canBePresentWithRemoteVote(
		council.statute
    );
    
    const checkImage = async image => {
        console.log(image);

    }

    const searchParticipant = React.useCallback(async() => {
        if(search){
            setLoading(true);
            const response = await client.query({
                query: gql`
                    query liveParticipantQRSearch($accessId: String!, $councilId: Int!){
                        liveParticipantQRSearch(accessId: $accessId, councilId: $councilId){
                            name
                            surname
                            id
                            dni
                            email
                            numParticipations
                            position
                            state
                            signed
                            signature{
                                data
                            }
                        }
                    }
                `,
                variables: {
                    accessId: search,
                    councilId: council.id
                }
            });

            if(!response.data.liveParticipantQRSearch){
                setError('404')
            } else {
                setParticipant(response.data.liveParticipantQRSearch);
            }
            setLoading(false);

        }
    }, [search]);

    React.useEffect(() => {
        if(participant){
            if(participant.signature && participant.signature.data){
                signature.current.fromDataURL(participant.signature.data);
                setWithSignature(true);
            }
            if(participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE){
                setParticipantState(PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE);
            }
        }
    }, [participant]);


    React.useEffect(() => {
        searchParticipant();
    }, [searchParticipant])

    const handleError = error => {
        //console.log('failed to read');
    }

    const handleScan = data => {
        if (data) {
            setSearch(data);
        }
    }

    const isPresent = state => {
        return state === PARTICIPANT_STATES.PHYSICALLY_PRESENT || state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
    }

    const setParticipantAsPresent = async () => {
        let response;
        if (!withSignature) {
            response = await client.mutate({
                mutation: changeParticipantState,
                variables: {
                    participantId: participant.id,
                    state: participantState
                }
            })
        } else {
            let signatureData = signature.current.toDataURL();
            response = await client.mutate({
                mutation: setLiveParticipantSignature,
                variables: {
                    signature: {
                        //...(data.liveParticipantSignature ? { id: data.liveParticipantSignature.id } : {}),
                        data: signatureData,
                        participantId: participant.id
                    },
                    state: participantState
                }
            });
        }

        if (!response.errors) {
            reset();
        }
    }

    const signatureSection = () => {
        const maxWidth = 600;
        const minWidth = window.innerWidth * 0.7;
        let width = minWidth;
    
        if (minWidth > maxWidth) {
            width = maxWidth;
        }
        const height = width * 0.41;

        return (
            <div>
                <div
                    style={{
                        height: "400px",
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        position: "relative"
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            textAlign: "left"
                        }}
                    >
                        <ParticipantDisplay
                            participant={participant}
                            translate={translate}
                            delegate={true}
                            council={council}
                        />
                    </div>
                    {_canBePresentWithRemoteVote ? (
                        <div>
                            <Checkbox
                                label={translate.has_remote_vote}
                                value={participantState === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
                                onChange={(event, isInputChecked) =>
                                    setParticipantState(isInputChecked ? PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
                                        : PARTICIPANT_STATES.PHYSICALLY_PRESENT
                                    )
                                }
                            />
                        </div>
                    ) : (
                            <br />
                        )}
                    <div tyle={{ width: 'calc(100% - 2em)', display: 'flex', justifyContent: 'center' }}>
                        <ReactSignature
                            height={height}
                            width={width}
                            dotSize={1}
                            onEnd={() => setWithSignature(true)}
                            style={{ border: "solid 1px" }}
                            ref={signature}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const reset = () => {
        setSearch(null);
        setParticipant(null);
        setWithSignature(false);
        setParticipantState(5);
    }

    const renderBody = () => {
        if(participant){
            return (
                <div>
                    <React.Fragment>
                        {isPresent(participant.state) &&
                            <div style={{width: '100%', padding: '1em', color: primary, fontWeight: '700', border: `1px solid ${primary}`, borderRadius: '5px'}}>
                                {translate.participant_already_present}
                            </div>
                        }
                        <div>
                            {signatureSection()}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%',
                                borderTop: '1px solid gainsboro',
                                paddingTop: '1em'
                            }}
                        >
                            <BasicButton
                                text={translate.back}
                                type="flat"
                                buttonStyle={{
                                    color: 'black',
                                    fontWeight: '700',
                                    marginLeft: '1em'
                                }}
                                onClick={reset}
                            />
                            {!isPresent(participant.state) &&
                                <BasicButton
                                    color={primary}
                                    textStyle={{ color: 'white' }}
                                    text={translate.change_to_present}
                                    onClick={setParticipantAsPresent}
                                />
                            }
                        </div>
                    </React.Fragment>
                </div>
            )
        }

        return (
            <div
                style={{
                    borderRadius: '27px',
                    background: "white",
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: "hidden",
                    flexDirection: 'column',
                    minHeight: '300px',
                    minWidth: '300px',
                    zIndex: "1", 
                }}
            >
                {error &&
                    <div style={{color: 'red'}}>
                        {translate.no_participant_found_code}
                    </div>
                }
                <video autoPlay style={{ width: '100%', height: 'auto', position: 'absolute', top: 0, left: 0 }} ref={videoRef} />
                <canvas
                    ref={canvasRef}
                    id='qr'
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: -1,
                        // width: '100%', 
                        // height: '100%', 
                        height: videoRef.current ? videoRef.current.offsetHeight : '',
                        width: videoRef.current ? videoRef.current.offsetWidth : '',
                    }}
                />
            </div>
        )
    }

    return (
        <AlertConfirm
            open={open}
            bodyStyle={{padding: '1em 2em', margin: '0'}}
            requestClose={() => {
                requestClose();
                reset();
            }}
            title={translate.search}
            bodyText={renderBody()}
        />
    )
}

export default withApollo(QRSearchModal);