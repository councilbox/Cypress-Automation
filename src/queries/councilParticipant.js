import gql from "graphql-tag";

export const deleteParticipant = gql `
    mutation DeleteParticipant($participantId: Int!, $councilId: Int!) {
        deleteParticipant(participantId: $participantId, councilId: $councilId)
    }
`;

export const councilParticipants = gql`
  query participants($councilId: Int!, $filters: [FilterInput], $options: OptionsInput){
    councilParticipants(councilId: $councilId, filters: $filters, options: $options){
      list{
        id
        councilId
        name
        surname
        position
        email
        phone
        dni
        type
        numParticipations
        socialCapital
        uuid
        delegateUuid
        delegateId
        representative {
          id
          name
          surname
          dni
          email
          phone
          position
          language
        }
        position
        language
        city
        personOrEntity
      }
      total
    }
  }
`;

export const updateCouncilParticipant = gql `
  mutation updateParticipant($participant: ParticipantInput, $representative: RepresentativeInput) {
    updateCouncilParticipant(participant: $participant, representative: $representative){
      success
    }
  }
`;

export const updateConvenedParticipant = gql `
  mutation updateConvenedParticipant($participant: ParticipantInput, $representative: RepresentativeInput) {
    updateConvenedParticipant(participant: $participant, representative: $representative){
      success
    }
  }
`;

export const convenedcouncilParticipants = gql`
  query participants($councilId: Int!, $filters: [FilterInput], $notificationStatus: Int, $options: OptionsInput){
    councilParticipantsWithNotifications(councilId: $councilId, filters: $filters, notificationStatus: $notificationStatus, options: $options){
      list{
        id
        councilId
        name
        surname
        position
        email
        phone
        dni
        type
        numParticipations
        socialCapital
        uuid
        delegateUuid
        delegateId
        position
        language
        representative {
          id
          name
          surname
          dni
          email
          phone
          position
          language
          notifications{
            reqCode
            refreshDate
          }
          live {
            assistanceComment
            assistanceIntention
          }
        }
        live {
          assistanceComment
          assistanceIntention
        }
        city
        personOrEntity
        notifications{
          reqCode
          refreshDate
        }
      }
      total
    }
  }
`;