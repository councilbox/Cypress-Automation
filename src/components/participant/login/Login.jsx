import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive, councilIsFinished, checkHybridConditions } from "../../../utils/CBX";
import { checkIsCompatible } from '../../../utils/webRTC';
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import { NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { isMobile } from "../../../utils/screen";
import RequestDataInfo from "./RequestDataInfo";

// '850px'
const width = window.innerWidth > 450 ? '850px' : '100%'

const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
		position: "relative"
	},
	mainContainer: {
		width: "100%",
		height: "calc(100% - 48px)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		padding: isMobile ? "" : "10px"
	},
	cardContainer: {
		margin: isMobile ? "20%" : "20px",
		marginBottom: '5px',
		minWidth: width,
		maxWidth: "100%",
		//height: '50vh',
		minHeight: isMobile? '70vh' : '50vh',
		...(isMobile? {
			height: '60vh'
		} : {})
	}
};

const reducer = (state, action) => {
    const actions = {
        'SUCCESS': () => {
            return ({
                ...state,
                status: 'SUCCESS',
                message: action.payload.message
            })
        },
        'ERROR': () => ({
            ...state,
            status: 'ERROR',
            message: action.payload.message
        })
	}

    return actions[action.type]? actions[action.type]() : state;
}




const ParticipantLogin = ({ participant, council, company, ...props }) => {
	const [selectHeadFinished, setSelectHeadFinished] = React.useState("participacion");
	const [{ status, message }, updateState] = React.useReducer(reducer, { status: 'WAITING' });

	const loginForm = () => (
		<LoginForm
			participant={participant}
			council={council}
			company={company}
			status={status}
			message={message}
			updateState={updateState}
		/>
	)


	if ((councilIsFinished(council) || !councilIsLive(council) || participant.hasVoted) && isMobile) {
		return (
			<NotLoggedLayout
				translate={props.translate}
				helpIcon={true}
				languageSelector={false}
				councilIsFinished={councilIsFinished(council)}
				setSelectHeadFinished={setSelectHeadFinished}
				selectHeadFinished={selectHeadFinished}
			>
				<div style={{ width: "100%", background: "transparent", height: "100%" }} >
					<div style={{ width: "100%", background: "transparent", height: "100%" }}>
						<CouncilState council={council} company={company} participant={participant} selectHeadFinished={selectHeadFinished} />
					</div>
				</div>
			</NotLoggedLayout>
		);
	} else {
		return (
			<NotLoggedLayout
				translate={props.translate}
				helpIcon={true}
				languageSelector={false}
			>
				<Scrollbar>
					<div style={styles.mainContainer}>
						<Card style={{
							...styles.cardContainer,
							background: councilIsFinished(council) && 'transparent',
							boxShadow: councilIsFinished(council) && "none",
							minHeight: councilIsFinished(council) && "100%",
							...((councilIsLive(council) && !participant.hasVoted) ? {
								minWidth: window.innerWidth > 450 ? '550px' : '100%'
							} : {
									minWidth: width
								})
						}} elevation={6}>
							{councilIsFinished(council) ?
								<div style={{ height: "100%" }}>
									{((councilIsLive(council) && !participant.hasVoted) && !checkHybridConditions(council)) ? (
										loginForm()
									) : (
											<CouncilState council={council} company={company} participant={participant} />
										)}
								</div>
								:
								<div style={{ height: "100%" }}>
									{((councilIsLive(council) && !participant.hasVoted) && !checkHybridConditions(council)) ? (
										loginForm()
									) : (
											<CouncilState council={council} company={company} participant={participant} />
										)}
								</div>
							}
						</Card>
						<Card style={{
							...((councilIsLive(council) && !participant.hasVoted) ? {
								minWidth: window.innerWidth > 450 ? '550px' : '100%'
							} : {
									minWidth: width
								})
							
						}}>
							<RequestDataInfo
								data={{}}
								translate={props.translate}
								message={message}
								status={status}
							/>
						</Card>
					</div>
				</Scrollbar>

			</NotLoggedLayout>
		);
	}
}



export default withTranslations()(withDetectRTC()(ParticipantLogin));
