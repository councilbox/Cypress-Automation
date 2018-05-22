import { store } from '../containers/App';
import { AGENDA_TYPES } from '../constants';

class LiveUtil {
    static qualityVoteRequirements(agenda, council){
        return (agenda.subject_type === AGENDA_TYPES.PUBLIC_ACT || agenda.subject_type === AGENDA_TYPES.PUBLIC_VOTING) && (agenda.majority_type === 1) && (agenda.positive_votings + agenda.positive_manual) === (agenda.negative_votings + agenda.negative_manual) && council.statutes[0].exists_quality_vote;
    }

    static parsePercentaje(number, divisor) {
        let zero = 0;
        if (!divisor) {
            return zero.toFixed(3);
        } else {
            return (number * 100 / divisor).toFixed(3);
        }
    }

    static calculateMayorityAgenda(agenda, council, recount) {
        const company = store.getState().company;
        let specialSL = false;
        if (company.type === 1 && council.quorum_prototype === 1) {
            specialSL = true;
        }
        return this.calculateMajority(specialSL, recount.part_total, agenda.present_census + agenda.current_remote_census, agenda.majority_type, agenda.majority, agenda.majority_divider, agenda.negative_votings + agenda.negative_manual, council.quorum_prototype);
    };


    static calculateMajority(specialSL, total_votes, votes, majority_type, majority, majority_divider, against_votes, quorum_prototype) {
        if (specialSL) {
            return this.calculateMajoritySL(total_votes, majority_type, majority, majority_divider, against_votes, quorum_prototype);
        } else {
            return this.calculateMajorityOther(total_votes, votes, majority_type, majority, majority_divider, against_votes);
        }
    }

    static calculateMajorityOther(total_votes, votes, majority_type, majority, majority_divider, against_votes) {
        switch (majority_type) {
            case 0:
                return Math.ceil(votes * majority / 100);
            case 1:
                return against_votes + 1;
            case 2:
                return Math.ceil(votes * 50 / 100) + 1;
            case 3:
                if (votes / total_votes * 100 >= 50) {
                    return Math.ceil(votes * 50 / 100) + 1;
                } else {
                    return Math.ceil(votes * 2 / 3)
                }
            case 4:
                return Math.ceil(votes * 2 / 3);
            case 5:
                return Math.ceil(votes * majority / majority_divider);
            case 6:
                return majority;
            default:
                return 0;
        }
    }

    static calculateMajoritySL(total_votes, majority_type, majority, majority_divider, against_votes, quorum_prototype) {
        switch (majority_type) {
            case 0:
                return Math.ceil(total_votes * majority / 100);
            case 1:
                let positiveNeeded = against_votes + 1;
                if (quorum_prototype === 1) { //ACCIONES
                    let minimumNeeded = Math.ceil(total_votes * 1 / 3);
                    return positiveNeeded > minimumNeeded ? positiveNeeded : minimumNeeded;
                } else {
                    return positiveNeeded;
                }
            case 2:
                return Math.ceil(total_votes * 50 / 100) + 1;
            case 4:
                return Math.ceil(total_votes * 2 / 3);
            case 5:
                return Math.ceil(total_votes * majority / majority_divider);
            case 6:
                return majority;
            default:
                return 0;
        }
    }
}


export default LiveUtil;