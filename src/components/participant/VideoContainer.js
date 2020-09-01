import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { roomUpdateSubscription } from '../council/live/video/CMPVideoIFrame';
import { useRoomUpdated } from '../../hooks';

const rand = Math.random();

const VideoContainer = ({ setVideoURL, videoURL, announcement, client, ...props }) => {
    const [url, setUrl] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: videoURLQuery,
            variables: {
                participantId: +props.participant.id
            }
        })

        return response.data.participantVideoURL;
    }, [props.participant.id])

    const updateUrl = async () => {
        const newUrl = await getData();
        if(newUrl !== url){
            setUrl(newUrl);
        }
        if(loading){
            setLoading(false);
        }
    }

    React.useEffect(() => {
        updateUrl();
    }, [getData]);

    useRoomUpdated({
        refetch: updateUrl,
        props,
        participant: props.participant
    });

    const requestWord = props.participant.requestWord;

    React.useEffect(() => {
        updateUrl();
    }, [requestWord]);


    if(!loading){
        if(!videoURL){
            setVideoURL(url? url : 'Error reaching CMP');
        }
        return(
            <iframe
                title="meetingScreen"
                allow="geolocation; microphone; camera"
                scrolling="no"
                className="temp_video"
                src={`https://${url}?rand=${rand}`}
                allowFullScreen={true}
                style={{
                    border: "none !important",
                }}
            >
                Something wrong...
            </iframe>
        )
    }

    return <div/>;
}

const videoURLQuery = gql`
    query participantVideoURL($participantId: Int!){
        participantVideoURL(participantId: $participantId)
    }
`;

export default compose(
    graphql(roomUpdateSubscription, {
        name: 'subs',
        options: props => ({
			variables: {
				councilId: props.council.id
			}
		})
    }),
    withApollo
)(VideoContainer);