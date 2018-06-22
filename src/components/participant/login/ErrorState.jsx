import React from "react";
import {
	Card,
	CardHeader,
	Avatar,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent
} from "material-ui";
import moment from "moment";
import FontAwesome from "react-fontawesome";
import Header from "../Header";
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import {
	councilIsInTrash,
	councilIsNotLiveYet,
	councilIsNotCelebrated,
	councilIsFinished
} from "../../../utils/CBX";
import {
	getPrimary,
	getSecondary,
	lightGrey,
	lightTurquoise,
	secondary,
	primary
} from "../../../styles/colors";
import { PARTICIPANT_ERRORS } from "../../../constants";
import background from "../../../assets/img/signup3.jpg";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";

const styles = {
	cardContainer: {
		margin: "20px",
		padding: "20px",
		maxWidth: "100%"
	},
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	splittedContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	textContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px",
		textAlign: "center"
	},
	councilInfoContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px",
		width: '100%'
	}
};

class ErrorState extends React.Component {
	handleError = code => {
		const { translate } = this.props;
		switch (code) {
			case PARTICIPANT_ERRORS.PARTICIPANT_BLOCKED:
				return <ParticipantBlocked translate={translate} />;

			case PARTICIPANT_ERRORS.PARTICIPANT_IS_NOT_REMOTE:
				return <ParticipantNotInRemoteState translate={translate} />;

			case PARTICIPANT_ERRORS.DEADLINE_FOR_LOGIN_EXCEEDED:
				return <TimeLimitExceeded translate={translate} />;
		}
	};

	render() {
		const {
			translate,
			code,
			data,
			windowSize,
			windowOrientation
		} = this.props;

		return (
			<div
				style={{
					height: "100vh",
					width: "100vw"
				}}
			>
				<Header />
				<div
					style={{
						display: "flex",
						height: "calc(100% - 48px)",
						width: "100%",
						alignItems: "center",
						justifyContent: "center",
						background: `url(${background})`
					}}
				>
					<Card style={styles.cardContainer}>
						<div
							style={
								windowSize === "xs" &&
								windowOrientation === "portrait"
									? styles.container
									: styles.splittedContainer
							}
						>
							<div
								style={{
									...styles.textContainer,
									...(windowSize === "xs" &&
									windowOrientation === "portrait"
										? { maxWidth: "100%" }
										: { maxWidth: "50%", minWidth: "50%" })
								}}
							>
								{this.handleError(code)}
							</div>

							<div style={styles.councilInfoContainer}>
								<div
									style={{
										backgroundColor: lightTurquoise,
										padding: "5px",
										borderRadius: "4px",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center"
									}}
								>
									<Avatar
										src={data.council.company.logo}
										aria-label="CouncilLogo"
									/>
									<h3>{data.council.name}</h3>
									<span>
										{moment(
											new Date(data.council.dateStart)
										).format("LLL")}
									</span>

									{(data.council.statute.existsLimitedAccessRoom === 1) &&
										<p>
											{translate.room_access_closed_at}
											<span style={{fontWeight: 'bold', marginLeft: '2px'}}>
												{
													moment(
														new Date(data.council.dateRealStart)
													)
													.add(data.council.statute.limitedAccessRoomMinutes, 'm')
													.format("HH:mm")
												}
											</span>
										</p>
									}
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		);
	}
}

const ParticipantBlocked = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"user"}
				stack={"1x"}
				style={{ color: primary }}
			/>
			<FontAwesome
				name={"ban"}
				stack={"2x"}
				style={{ color: secondary }}
			/>
		</div>

		{translate.cant_access_video_room_expelled}
	</React.Fragment>
);

const ParticipantNotInRemoteState = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"globe"}
				stack={"2x"}
				style={{ color: secondary }}
			/>
			<FontAwesome
				name={"times"}
				stack={"1x"}
				style={{ color: primary }}
			/>
		</div>

		{translate.cant_access_video_room_no_remote_assistance}
	</React.Fragment>
);

const TimeLimitExceeded = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"clock-o"}
				stack={"2x"}
				style={{ color: primary }}
			/>
		</div>

		{translate.cant_access_time_exceeded}
	</React.Fragment>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(ErrorState))
);