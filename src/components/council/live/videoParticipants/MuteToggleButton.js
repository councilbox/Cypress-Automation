import React from "react";
import { Card, MenuItem, Tooltip } from "material-ui";
import { getSecondary } from "../../../../styles/colors";
import { graphql, compose } from "react-apollo";
import { haveGrantedWord } from "../../../../utils/CBX";
import gql from 'graphql-tag';
import { LoadingSection } from "../../../../displayComponents";

class MuteToggleButton extends React.Component {

	state = {
		muted: this.props.participant.videoParticipant? this.props.participant.videoParticipant.mutedMic : false
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.participant.videoParticipant){
			if(nextProps.participant.videoParticipant.mutedMic !== prevState.muted){
				return {
					muted: nextProps.participant.videoParticipant.mutedMic
				}
			}
		}
		return null
	}

    toggleMuteParticipant = async () => {
		this.setState({
			loading: true
		});
		if(this.state.muted){
			const response = await this.props.unmuteParticipant({
				variables: {
					councilId: this.props.participant.councilId,
					videoParticipantId: this.props.participant.videoParticipant.id
				}
			});

			if(response.data){
				if(response.data.unmuteVideoParticipant.success){
					this.setState({
						muted: false,
						loading: false
					});
				}
			}
		}else {
			const response = await this.props.muteParticipant({
				variables: {
					councilId: this.props.participant.councilId,
					videoParticipantId: this.props.participant.videoParticipant.id
				}
			});

			if(response.data){
				if(response.data.muteVideoParticipant.success){
					this.setState({
						muted: true,
						loading: false
					});
				}
			}
		}
    }

	render() {
		const { participant } = this.props;

		return (
			<div style={{marginRight: '0.3em'}}>
				{haveGrantedWord(participant) && (
					<Tooltip
						title={
							participant.requestWord === 2
								? 'Mutar participante'
								: ""
						}
					>
						<Card
							onClick={() =>
								this.toggleMuteParticipant(participant.id)
							}
							style={{
								width: "1.6em",
								height: "1.6em",
								borderRadius: "0.1em",
								backgroundColor: getSecondary()
							}}
						>
							<MenuItem
								style={{
									height: "1.6em",
									width: "1.6em",
									padding: 0,
									margin: 0,
                                    color: 'white',
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								{this.state.muted?
									<i className="fa fa-microphone-slash" aria-hidden="true" style={{transform: 'scaleX(-1)'}}></i>
								:
									<i className="fa fa-microphone" aria-hidden="true"></i>
								}
							</MenuItem>
						</Card>
					</Tooltip>
				)}
			</div>
		);
	}
}

const muteParticipant = gql`
	mutation muteParticipant($videoParticipantId: String!, $councilId: Int!){
		muteVideoParticipant(videoParticipantId: $videoParticipantId, councilId: $councilId){
			success
		}
	}
`;

const unmuteParticipant = gql`
	mutation UnmuteParticipant($videoParticipantId: String!, $councilId: Int!){
		unmuteVideoParticipant(videoParticipantId: $videoParticipantId, councilId: $councilId){
			success
		}
	}
`;

export default compose(
	graphql(muteParticipant, {
		name: 'muteParticipant'
	}),

	graphql(unmuteParticipant, {
		name: 'unmuteParticipant'
	})
)(MuteToggleButton);