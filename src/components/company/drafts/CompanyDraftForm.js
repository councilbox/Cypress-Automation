import React, { Fragment } from 'react';
import { Grid, GridItem, TextInput, SelectInput, MajorityInput, RichTextInput } from '../../../displayComponents';
import { MenuItem } from 'material-ui';
import * as CBX from '../../../utils/CBX';

const CompanyDraftForm = ({ translate, draft, errors, updateState, companyStatutes, draftTypes, votingTypes, majorityTypes }) => (
    <Grid spacing={16}>
        <GridItem xs={12} lg={3} md={3}>
            <TextInput
                floatingText={translate.title}
                type="text"
                required
                errorText={errors.title}
                value={draft.title}
                onChange={(event) => updateState({
                    title: event.nativeEvent.target.value
                })}
            />
        </GridItem>
        <GridItem xs={12} lg={3} md={3}>
            <SelectInput
                floatingText={translate.council_type}
                value={draft.statuteId}
                errorText={errors.statuteId}
                onChange={(event) => updateState({
                    statuteId: event.target.value
                })}
            >
                {companyStatutes.map((council) => {
                        return <MenuItem value={council.id} key={`counciltype_${council.id}`}>{translate[council.title] || council.title}</MenuItem>
                    })
                }
            </SelectInput>
        </GridItem>
        <GridItem xs={12} lg={3} md={3}>
            <SelectInput
                floatingText={translate.draft_type}
                value={''+draft.type}
                errorText={errors.type}
                onChange={(event) => updateState({
                    type: +event.target.value
                })}
            >
                {draftTypes.map((draft) => {
                        return <MenuItem value={''+draft.value} key={`draftType_${draft.value}`}>{translate[draft.label]}</MenuItem>
                    })
                }
            </SelectInput>
        </GridItem>
        <GridItem xs={12} lg={3} md={3}>
            {draft.type === 1 &&
                <SelectInput
                    floatingText={translate.point_type}
                    value={''+draft.votationType}
                    errorText={errors.votationType}
                    onChange={(event) => updateState({
                        votationType: +event.target.value
                    })}
                >
                    {votingTypes.map((votingType) => {
                            return <MenuItem value={''+votingType.value} key={`votingTypeType_${votingType.value}`}>{translate[votingType.label]}</MenuItem>
                        })
                    }
                </SelectInput>
            }
        </GridItem>
        <GridItem xs={11} lg={12} md={12}>
            <TextInput
                floatingText={translate.description}
                type="text"
                errorText={errors.description}
                required
                value={draft.description}
                onChange={(event) => updateState({
                    description: event.nativeEvent.target.value
                })}
            />
        </GridItem>
        {CBX.hasVotation(draft.votationType) &&
            <Fragment>
                <GridItem xs={6} lg={3} md={3}>
                        <SelectInput
                            floatingText={translate.majority_label}
                            value={''+draft.majorityType || 1}
                            errorText={errors.majorityType}
                            onChange={(event) => updateState({
                                majorityType: +event.target.value
                            })}
                        >
                            {majorityTypes.map((majority) => {
                                    return <MenuItem value={''+majority.value} key={`majorityType_${majority.value}`}>{translate[majority.label]}</MenuItem>
                                })
                            }
                        </SelectInput>
                </GridItem>
                <GridItem xs={6} lg={3} md={3}>
                    {CBX.majorityNeedsInput(draft.majorityType) &&
                        <MajorityInput
                            type={draft.majorityType}
                            style={{paddingTop: '16px'}}
                            value={draft.majority}
                            divider={draft.majorityDivider}
                            majorityError={errors.majority}
                            dividerError={errors.majorityDivider}
                            onChange={(value) => updateState({
                                majority: +value
                            })}
                            onChangeDivider={(value) => updateState({
                                majorityDivider: +value
                            })}
                        />
                    }
                </GridItem>
            </Fragment>
        }
        <GridItem xs={11} lg={12} md={12}>
            <RichTextInput
                value={draft.text || ''}
                errorText={errors.text}
                onChange={(value) => updateState({
                    text: value
                })}
            />
        </GridItem>
    </Grid>
);

export default CompanyDraftForm;


{/*<button className="btn btn-cbx-white-small"*/}
        {/*ng-click="addToText(' {{positiveVotings}} ')">*/}
    {/*{{ 'positive_votings' | translate}}*/}
{/*</button> < button*/}
{/*className = "btn btn-cbx-white-small"*/}
{/*ng - click = "addToText(' {{negativeVotings}} ')" > {*/}
{/*{*/}
    {/*'negative_votings' | translate*/}
{/*}*/}
{/*}*/}
{/*</button>*/}