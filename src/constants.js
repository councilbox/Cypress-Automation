export const MAX_FILE_SIZE = 10240;
export const MAX_COUNCIL_FILE_SIZE = 10240;
export const MAX_COUNCIL_ATTACHMENTS = 5;

export const agendaTypes = [ 'text', 'public_voting', 'public_act', 'fake_public_votation', 'private_act', 'private_voting' ];

export const AGENDA_TYPE = {
    'INFORMATIVE': 0,
    'PUBLIC_VOTING': 1,
    'PUBLIC_ACT': 2,
    'PRIVATE_VOTING': 3,
    'PRIVATE_ACT': 4,
    'REAL_PRIVATE_VOTING': 5
};

export const DRAFTS_LIMITS = [ 25, 50, 100, 250 ];
export const CENSUS_LIMITS = [ 25, 50, 100, 250 ];
export const PARTICIPANTS_LIMITS = [ 25, 50, 100, 250 ];
export const DELEGATION_USERS_LOAD = 25;


export const EMAIL_TRACK_STATES = {
    FAILED: -1,
    NOT_SENT: 0,
    PENDING_SHIPPING: 20,
    DELIVERED: 22,
    OPENED: 25,
    CLICKED: 32,
    SPAM: 35,
    INVALID_EMAIL_ADDRESS: 36,
    DROPPED: 37
};

export const EMAIL_STATES_FILTERS = {
    FAILED: -1,
    DROPPED: 37,
    INVALID_EMAIL_ADDRESS: 36,
    SPAM: 35,
    PENDING_SHIPPING: 20,
    DELIVERED: 22,
    OPENED: 25
};

export const PARTICIPANT_STATES = {
    REMOTE: 0,
    PRESENT: 1,
    REPRESENTATED: 2,
    DELEGATED: 4,
    PHYSICALLY_PRESENT: 5,
    NO_PARTICIPATE: 6,
    PRESENT_WITH_REMOTE_VOTE: 7
};

export const DRAFT_TYPES = {
    CONVENE_HEADER: 0,
    AGENDA: 1,
    INTRO: 2,
    CONSTITUTION: 3,
    CONCLUSION: 4,
    COMMENTS_AND_AGREEMENTS: 5
};

export const SEND_TYPES = [ 'convene', 'reminder', 'rescheduled', 'cancellation', 'room_access', 'security', 'act' ];

export const COUNCIL_STATES = {
    CANCELED: -1,
    DRAFT: 0,
    PRECONVENE: 3,
    SAVED: 5,
    PREPARING: 10,
    ROOM_OPENED: 20,
    APPROVING_ACT_DRAFT: 30,
    FINISHED: 40,
    APPROVED: 60,
    FINAL_ACT_SENT: 70,
    NOT_CELEBRATED: 80,
    FINISHED_WITHOUT_ACT: 90,
    MEETING_FINISHED: 100
};