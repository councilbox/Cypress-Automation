import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm, SelectInput, TextInput, RichTextInput, Grid, GridItem, MajorityInput, BasicButton } from '../../../../displayComponents/index';
import { MenuItem } from 'material-ui';
import { updateAgenda } from '../../../../queries/agenda';
import * as CBX from '../../../../utils/CBX';
import LoadDraft from '../../../company/drafts/LoadDraft';
import { getSecondary } from "../../../../styles/colors";

class PointEditor extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                agendaSubject: '',
                subjectType: '',
                description: ''
            },
            loadDraft: false,
            errors: {
                agendaSubject: '',
                subjectType: '',
                description: ''
            }
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data: {
                ...nextProps.agenda
            }
        })
    }

    loadDraft = (draft) => {
        const correctedText = CBX.changeVariablesToValues(draft.text, {
            company: this.props.company,
            council: this.props.council
        });
        this.updateState({
            description: correctedText,
            majority: draft.majority,
            majorityType: draft.majorityType,
            majorityDivider: draft.majorityDivider,
            subjectType: draft.type,
            agendaSubject: draft.title,
        });
        this.editor.setValue(correctedText);
    };

    saveChanges = async () => {
        if(this.checkRequiredFields()){
            const { __typename, ...data } = this.state.data;
            const response = await this.props.updateAgenda({
                variables: {
                    agenda: {
                        ...data
                    }
                }
            });
            if(response){
                this.props.refetch();
                this.props.requestClose();
            }
        }
    };

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            },
            loadDraft: false
        });
    };

    checkRequiredFields() {
        return true;
    }

    _renderModalBody = () => {
        const secondary = getSecondary();
        const { translate, votingTypes, statute, draftTypes, council, company, companyStatutes } = this.props;
        const errors = this.state.errors;
        const agenda = this.state.data;

        const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute);
        
        return(
            <div style={{
                width: '90vw',
                maxWidth: '1000px'
            }}>
                {this.state.loadDraft &&

                <LoadDraft
                    translate={translate}
                    companyId={company.id}
                    loadDraft={this.loadDraft}
                    statute={statute}
                    statutes={companyStatutes}
                    draftTypes={draftTypes}
                    draftType={1}
                />}

                <div style={{ display: this.state.loadDraft && 'none' }}>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-xs-12">
                            <TextInput
                                floatingText={translate.convene_header}
                                type="text"
                                errorText={errors.agendaSubject}
                                value={agenda.agendaSubject}
                                onChange={(event) => this.updateState({
                                    agendaSubject: event.target.value
                                })}
                            />
                        </div>
                        <div className="col-lg-6 col-md-6 col-xs-12">
                            <SelectInput
                                floatingText={translate.type}
                                value={agenda.subjectType}
                                onChange={(event) => this.updateState({
                                    subjectType: event.target.value
                                })}
                            >
                                {filteredTypes.map((voting) => {
                                    return <MenuItem value={voting.value} key={`voting${voting.value}`}>{translate[voting.label]}</MenuItem>
                                })
                                }
                            </SelectInput>
                        </div>
                    </div>
                    {CBX.hasVotation(agenda.subjectType) &&
                    <Grid>
                        <GridItem xs={6} lg={3} md={3}>
                            <SelectInput
                                floatingText={translate.majority_label}
                                value={''+agenda.majorityType}
                                errorText={errors.majorityType}
                                onChange={(event) => this.updateState({
                                    majorityType: +event.target.value
                                })}
                            >
                                {this.props.majorityTypes.map((majority) => {
                                    return <MenuItem value={''+majority.value} key={`majorityType_${majority.value}`}>{translate[majority.label]}</MenuItem>
                                })
                                }
                            </SelectInput>
                        </GridItem>
                        <GridItem xs={6} lg={3} md={3}>
                            {CBX.majorityNeedsInput(agenda.majorityType) && (
                                <MajorityInput
                                    type={agenda.majorityType}
                                    style={{marginLeft: '1em'}}
                                    value={agenda.majority}
                                    divider={agenda.majorityDivider}
                                    majorityError={errors.majority}
                                    dividerError={errors.majorityDivider}
                                    onChange={(value) => this.updateState({
                                        majority: +value
                                    })}
                                    onChangeDivider={(value) => this.updateState({
                                        majorityDivider: +value
                                    })}
                                />
                            )}
                        </GridItem>
                    </Grid>
                    }

                    <RichTextInput
                        ref={(editor) => this.editor = editor}
                        floatingText={translate.description}
                        type="text"
                        loadDraft={<BasicButton
                            text={translate.load_draft}
                            color={secondary}
                            textStyle={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.8em',
                                textTransform: 'none',
                                marginLeft: '0.4em',
                                minHeight: 0,
                                lineHeight: '1em'
                            }}
                            textPosition="after"
                            onClick={() => this.setState({ loadDraft: true })}
                        />}
                        tags={[
                            {
                                value: `${council.street}, ${council.country}`,
                                label: translate.new_location_of_celebrate
                            }, {
                                value: company.countryState,
                                label: translate.company_new_country_state
                            },{
                                value: company.city,
                                label: translate.company_new_locality
                            },
                        ]}
                        errorText={errors.description}
                        value={agenda.description}
                        onChange={(value) => this.updateState({
                            description: value
                        })}
                    />
                </div>
            </div>

        );
    };

    render(){
        const { open, translate, requestClose } = this.props;
 
        return(
            <AlertConfirm
                requestClose={requestClose}
                open={open}
                acceptAction={this.saveChanges}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderModalBody()}
                title={translate.edit}
            />
        );
    }
}

export default graphql(updateAgenda, {name: 'updateAgenda'})(PointEditor);