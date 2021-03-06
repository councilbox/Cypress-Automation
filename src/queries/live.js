import gql from 'graphql-tag';

export const liveRecount = gql`
    query LiveRecount($councilId: Int!){
        councilRecount(councilId: $councilId){
            socialCapitalTotal
			partTotal
			weighedPartTotal
            numTotal
            socialCapitalRightVoting
            numRightVoting
        }
    }
`;

export const openCouncilRoom = gql`
	mutation openCouncilRoom(
		$councilId: Int!
		$sendCredentials: Boolean!
		$timezone: String!
		$group: String
	) {
		openCouncilRoom(
			councilId: $councilId
			sendCredentials: $sendCredentials
			timezone: $timezone
			group: $group
		) {
			success
			message
		}
	}
`;
