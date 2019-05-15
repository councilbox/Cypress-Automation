import React from "react";
import VotingsTableFiltersContainer from "./voting/VotingsTableFiltersContainer";
import { canEditPresentVotings, agendaVotingsOpened } from '../../../utils/CBX';
import ManualVotingsMenu from './voting/ManualVotingsMenu';

const Votings = ({ translate, agenda, council, ...props }) => {
	const _section = () => {
		return(
			<div style={{backgroundColor: 'white', paddingTop: '1em'}}>
				{((canEditPresentVotings(agenda) && agendaVotingsOpened(agenda) && council.councilType !== 3) || (council.councilType === 3 && agenda.votingState === 4)) &&
					<ManualVotingsMenu
						refetch={props.refetch}
						changeEditedVotings={props.changeEditedVotings}
						editedVotings={props.editedVotings}
						translate={translate}
						agenda={agenda}
					/>
				}
				<VotingsTableFiltersContainer
					recount={props.recount}
					translate={translate}
					agenda={agenda}
				/>
			</div>
		)
	}

	return (
		<div
			style={{
				width: "100%",
				position: "relative"
			}}
		>
			{_section()}
		</div>
	)
}

export default Votings;
