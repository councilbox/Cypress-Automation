import React, { Component, Fragment } from 'react';
import { BasicButton, ButtonIcon, AlertConfirm, TextInput, SelectInput } from '../../../displayComponents';
import { MenuItem } from 'material-ui';
import { graphql } from 'react-apollo';
import { getPrimary } from '../../../styles/colors';
import { createCensus } from '../../../queries';

class AddCensusButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            modal: false,
            data: {
                censusName: '',
                censusDescription: '',
                quorumPrototype: 0
            },
            errors: {}
        }
    }

    createCensus = async () => {
        if(!this.checkRequiredFields()){
            const response = await this.props.createCensus({
                variables: {
                    census: {
                        ...this.state.data,
                        companyId: this.props.company.id,
                        defaultCensus: 0
                    }
                }
            });
            if(response){
                console.log(response);
                this.props.refetch();
                this.setState({
                    modal: false,
                    data: {
                        censusName: '',
                        censusDescription: '',
                        quorumPrototype: 0
                    },
                    errors: {}
                });
            }
        }
    };

    checkRequiredFields(){
        return false;
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        })
    };

    _renderNewPointBody = () => {
        const { translate } = this.props;
        const errors = this.state.errors;
        const census = this.state.data;
        
        return(
            <Fragment>
                <div className="row"> 
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.name}
                            required
                            type="text"
                            errorText={errors.censusName}
                            value={census.censusName}
                            onChange={(event) => {
                                this.updateState({
                                    censusName: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.census_type}
                            value={census.quorumPrototype}
                            onChange={(event) => {
                                this.updateState({
                                    quorumPrototype: event.target.value
                                }) 
                            }}
                        >
                            <MenuItem value={0}>{translate.census_type_assistants}</MenuItem>
                            <MenuItem value={1}>{translate.social_capital}</MenuItem>    
                        </SelectInput>
                    </div>
                </div>

                <TextInput
                    floatingText={translate.description}
                    required
                    type="text"
                    errorText={errors.censusDescription}
                    value={census.censusDescription}
                    onChange={(event) => {
                        this.updateState({
                            censusDescription: event.target.value
                        })
                    }}
                />
            </Fragment>
        );
    };

    render(){
        const { translate } = this.props;
        const primary = getPrimary();

        return(
            <Fragment>
                <BasicButton
                    text={translate.add_census}
                    color={'white'}
                    textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    icon={<ButtonIcon type="add" color={primary} />}
                    onClick={() => this.setState({modal: true})}
                    buttonStyle={{marginRight: '1em', border: `2px solid ${primary}`}}
                />
                <AlertConfirm
                    requestClose={() => this.setState({modal: false})}
                    open={this.state.modal}
                    acceptAction={this.createCensus}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderNewPointBody()}
                    title={translate.census}
                />
            </Fragment>
        )
    }

}

export default graphql(createCensus, {
    name: 'createCensus'
})(AddCensusButton);