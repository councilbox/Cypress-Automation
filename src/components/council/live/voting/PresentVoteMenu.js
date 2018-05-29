import React from 'react';
import { VOTE_VALUES } from '../../../../constants';
import VotingValueIcon from './VotingValueIcon';
import { graphql } from 'react-apollo';
import { updateAgendaVoting } from '../../../../queries/agenda';
import { MenuItem } from 'material-ui';

class PresentVoteMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    updateAgendaVoting = async (value) => {
        const { author, authorRepresentative, __typename, ...agendaVoting } = this.props.agendaVoting;
        const response = await this.props.updateAgendaVoting({
            variables: {
                agendaVoting: {
                    ...agendaVoting,
                    vote: value
                }
            }
        });

        console.log(response);
        this.props.refetch();
    }

    _block = (value, active) => {
        return (
            <div
                style={{
                    height: '1.75em',
                    width: '1.75em',
                    marginRight: '0.2em',
                    border: `2px solid ${'grey'}`,
                    borderRadius: '3px',
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={() => this.updateAgendaVoting(value)}
            >
                <MenuItem selected={active} style={{display: 'flex', fontSize: '0.9em', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0}}>
                    <VotingValueIcon vote={value} color={active? undefined : 'grey'}/>
                </MenuItem>
            </div>
        )
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: '0.7em'
            }}>
                {this._block(VOTE_VALUES.POSITIVE, this.props.active === VOTE_VALUES.POSITIVE)}
                {this._block(VOTE_VALUES.NEGATIVE, this.props.active === VOTE_VALUES.NEGATIVE)}
                {this._block(VOTE_VALUES.ABSTENTION, this.props.active === VOTE_VALUES.ABSTENTION)}
            </div>
        );
    }
}

export default graphql(updateAgendaVoting, {
	name: "updateAgendaVoting"
})(PresentVoteMenu);