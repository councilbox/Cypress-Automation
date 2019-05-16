import React from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSMSStatusByCode } from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { moment } from '../../../../containers/App';
import { Table, TableRow, TableCell } from 'material-ui';
import LiveSMS from '../../../council/live/councilMenu/LiveSMS';


const FailedSMSList = ({ council, translate }) => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();

    const closeModal = () => {
        setModal(false);
    }

    const showModal = () => {
        setModal(true);
    }

    return (
        <React.Fragment>
            <BasicButton
                text="Ver envios SMS"
                color={secondary}
				textStyle={{ fontWeight: '700', color: 'white' }}
                onClick={showModal}
            />
            <AlertConfirm
                requestClose={closeModal}
                open={modal}
                buttonCancel={'Cancelar'}
                bodyStyle={{overflowY: "hidden",height: "50vh", width: "100%"}}
                bodyText={
                    <LiveSMS
                        translate={translate}
                        council={council}
                    />
                }
                title={'Lista de SMS'}
            />
        </React.Fragment>
    )
}

export const sendParticipantRoomKey = gql`
    mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!, $newPhone: String){
        sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone, newPhone: $newPhone){
            success
            message
        }
    }
`;

export const getSMS = gql`
    query sendsSMS($councilId: Int!, $filter: String,  $options: OptionsInput){
        sendsSMS(councilId: $councilId, filter: $filter, options: $options){
            list{
                liveParticipantId
                sendType
                id
                reqCode
                councilId
                recipient{
                    name
                    id
                    surname
                    phone
                    email
                }
            }
            total
        }
    }
`;

export default FailedSMSList;