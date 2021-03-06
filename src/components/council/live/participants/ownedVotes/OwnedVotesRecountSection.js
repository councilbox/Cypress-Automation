import React from 'react';
import { PARTICIPANT_TYPE } from '../../../../../constants';
import { Grid, GridItem } from '../../../../../displayComponents';
import { hasParticipations, showNumParticipations } from '../../../../../utils/CBX';

const Label = ({ children }) => (
	<span style={{ fontWeight: '700' }}>{children}</span>
);

const OwnedVotesRecountSection = ({ ownedVotesMeta, translate, participant, council }) => {
	const showSocialCapital = hasParticipations(council);
	return (
		<Grid
			style={{
				marginBottom: '1em',
				display: 'flex',
				alignItems: 'center',
				boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.5)',
				border: 'solid 1px #61abb7',
				borderRadius: '4px',
				padding: '1em',
				contentVisibility: 'auto',
				marginTop: '1em',
			}}
		>
			{participant.type !== PARTICIPANT_TYPE.REPRESENTATIVE &&
				<GridItem xs={12} md={6} lg={4}>
					<div>
						<Label>{translate.own_votes}:</Label>
						<span id="owned-votes-total"> {parseInt(ownedVotesMeta.totalOwnVotes, 10) / (10 ** council.statute.decimalDigits) || 0}</span>
					</div>
					{showSocialCapital &&
						<div>
							<Label>{translate.own_social_capital}:</Label>
							<span id="owned-social-capital-total"> {parseInt(ownedVotesMeta.totalOwnSocialCapital, 10) / (10 ** council.statute.decimalDigits) || 0}</span>
						</div>
					}

				</GridItem>
			}
			{ownedVotesMeta.numDelegated > 0 &&
				<GridItem xs={12} md={6} lg={4}>
					<div>
						<Label>{translate.num_delegations}:</Label>
						<span id="owned-votes-num-delegated"> {showNumParticipations(ownedVotesMeta.numDelegated, council.company, council.statute.decimalDigits)}</span>
					</div>
					<div>
						<Label>{translate.delegated_votes}:</Label>
						<span id="owned-delegated-votes"> {parseInt(ownedVotesMeta.totalDelegatedVote, 10) / (10 ** council.statute.decimalDigits) || 0}</span>
					</div>
					{showSocialCapital &&
						<div>
							<Label>{translate.delegated_social_capital}:</Label>
							<span id="owned-delegated-social-capital"> {parseInt(ownedVotesMeta.totalDelegatedSocialCapital, 10) / (10 ** council.statute.decimalDigits)}</span>
						</div>
					}

				</GridItem>
			}
			{ownedVotesMeta.numRepresented > 0 &&
				<GridItem xs={12} md={6} lg={4}>
					<div>
						<Label>{translate.num_representations}:</Label>
						<span id="owned-num-represented"> {parseInt(ownedVotesMeta.numRepresented, 10) / (10 ** council.statute.decimalDigits)}</span>
					</div>
					<div>
						<Label>{translate.representated_votes}:</Label>
						<span id="owned-represented-votes"> {parseInt(ownedVotesMeta.totalRepresentedVotes, 10) / (10 ** council.statute.decimalDigits)}</span>
					</div>
					{showSocialCapital &&
						<div>
							<Label>{translate.representated_social_capital}:</Label>
							<span id="owned-represented-social-capital"> {parseInt(ownedVotesMeta.totalRepresentedSocialCapital, 10) / (10 ** council.statute.decimalDigits)}</span>
						</div>
					}
				</GridItem>
			}

		</Grid>
	);
};

export default OwnedVotesRecountSection;

