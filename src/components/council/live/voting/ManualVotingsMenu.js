import React from 'react';
import { TextInput, Grid, GridItem, BasicButton } from '../../../../displayComponents';
import { graphql } from 'react-apollo';
import { getSecondary } from '../../../../styles/colors';
import { updateAgenda } from "../../../../queries/agenda";
import { useOldState } from '../../../../hooks';
import { cleanAgendaObject } from '../../../../utils/CBX';


const ManualVotingsMenu = ({ agenda, translate, ...props }) => {
    const [state, setState] = useOldState({
        positiveManual: agenda.positiveManual,
        negativeManual: agenda.negativeManual,
        abstentionManual: agenda.abstentionManual,
        noVoteManual: agenda.noVoteManual
    });

    const updateVoting = voting => {
        if(voting.positiveManual || voting.negativeManual || voting.abstentionManual || voting.noVoteManual ){
            props.changeEditedVotings(true);
        } else {
            props.changeEditedVotings(false);
        }
        setState(voting);
    }

    const saveManualVotings = async () => {
        const toSend = cleanAgendaObject(agenda);
        setState({
            loading: true
        });
        const response = await props.updateAgenda({
            variables: {
                agenda: {
                    ...toSend,
                    positiveManual: state.positiveManual || 0,
                    negativeManual: state.negativeManual  || 0,
                    abstentionManual: state.abstentionManual || 0,
                    noVoteManual: state.noVoteManual || 0,
                }
            }
        });

        if(!response.errors){
            setState({
                loading: false,
                success: true
            });
            props.changeEditedVotings(false);
            props.refetch();
        }
    }

    const resetButtonStates = () => {
        setState({
            loading: false,
            success: false
        });
    }

    const votesLeft = (agenda.presentCensus - state.noVoteManual - state.abstentionManual - state.negativeManual - state.positiveManual);
    const maxVoteManual = votesLeft <= 0? 0 : votesLeft;

    return(
        <div style={{width: '100%', backgroundColor: 'white', padding: '0 1em'}}>
            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    marginBottom: '1em',
                    padding: '0.6em',
                    border: '1px solid gainsboro',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Grid>
                    <GridItem xs={12} md={2} lg={2} style={{display: 'flex', alignItems: 'center'}}>
                        {translate.manual_votes} <br />
                        {`(${translate.avaliable} ${maxVoteManual})`}
                    </GridItem>
                    <GridItem xs={12} md={2} lg={2}>
                        <TextInput
                            value={state.positiveManual || 0}
                            type="number"
                            min={0}
                            max={maxVoteManual + state.positiveManual}
                            floatingText={translate.in_favor_lowercase}
                            onChange={event => {
                                updateVoting({
                                    positiveManual: calculateValidNumber(parseInt(maxVoteManual, 10), parseInt(state.positiveManual, 10), parseInt(event.target.value, 10))
                                })
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} md={2} lg={2}>
                        <TextInput
                            value={state.negativeManual || 0}
                            type="number"
                            min={0}
                            max={maxVoteManual + state.negativeManual}
                            floatingText={translate.against_lowercase}
                            onChange={event => {
                                updateVoting({
                                    negativeManual: calculateValidNumber(parseInt(maxVoteManual, 10), parseInt(state.negativeManual, 10), parseInt(event.target.value, 10))
                                })
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} md={2} lg={2}>
                        <TextInput
                            value={state.abstentionManual || 0}
                            type="number"
                            min={0}
                            max={maxVoteManual + state.abstentionManual}
                            floatingText={translate.abstention_lowercase}
                            onChange={event => {
                                updateVoting({
                                    abstentionManual: calculateValidNumber(parseInt(maxVoteManual, 10), parseInt(state.abstentionManual, 10), parseInt(event.target.value, 10))
                                })}
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={2} lg={2}>
                        <TextInput
                            value={state.noVoteManual || 0}
                            type="number"
                            min={0}
                            max={maxVoteManual + state.noVoteManual}
                            floatingText={translate.no_vote_lowercase}
                            onChange={event => updateVoting({
                                noVoteManual: ((maxVoteManual + state.noVoteManual) >= +event.target.value)? event.target.value : (+maxVoteManual + +state.noVoteManual)
                            })}
                        />
                    </GridItem>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <BasicButton
                            loading={state.loading}
                            success={state.success}
                            reset={resetButtonStates}
                            text={translate.save}
                            textStyle={{color: 'white', fontWeight: '700'}}
                            color={getSecondary()}
                            onClick={saveManualVotings}
                        />
                    </div>
                </Grid>
            </div>
        </div>
    )

}

const calculateValidNumber = (max, actual, newValue) => {
    if(isNaN(newValue)){
        return 0;
    }
    if((max + actual) >= newValue){
        return newValue;
    } else {
        return max + actual;
    }
}

export default graphql(updateAgenda, {
    name: 'updateAgenda'
})(ManualVotingsMenu);