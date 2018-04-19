import React, { Component } from 'react';
import { AlertConfirm } from '../displayComponents';
import CompanyDraftForm from './CompanyDraftForm';
import withTranslations from '../../HOCs/withTranslations';
import { graphql } from 'react-apollo';
import { createCompanyDraft } from '../../queries';


class SaveDraftModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return {
            data: nextProps.data
        }
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        })
    }

    createCompanyDraft = async () => {
        if(!this.checkRequiredFields()){
            const { data } = this.state;
            this.setState({loading: true})
            const response = await this.props.createCompanyDraft({
                variables: {
                    draft: {
                        title: data.title,
                        statuteId: data.statuteId,
                        type: data.type,
                        description: data.description,
                        text: data.text,
                        votationType: data.votationType,
                        majorityType: data.majorityType,
                        majority: data.majority,
                        majorityDivider: data.majorityDivider,
                        companyId: this.props.company.id
                    }
                }
            });
    
            if(!response.errors){
                this.setState({success: true});
                this.props.requestClose();
            }
        }
    }

    checkRequiredFields(){
        return false;
    }

    saveDraft = async () => {
        console.log(this.state.data);
    }

    _renderNewPointBody = () => {
        console.log(this.props);
        const { translate } = this.props;
        const { data = {} } = this.state;       

        return(
            <div style={{width: '800px'}}>
                <CompanyDraftForm
                    translate={translate}
                    errors={{}}
                    updateState={this.updateState}
                    draft={data}
                    companyStatutes={this.props.companyStatutes}
                    draftTypes={this.props.draftTypes}
                    votingTypes={this.props.votingTypes}
                    majorityTypes={this.props.majorityTypes}        
                />
            </div>
        )
    }

    render(){
        const { translate } = this.props;                

        return(
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={this.props.open}
                acceptAction={this.createCompanyDraft}
                cancelAction={this.props.requestClose}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderNewPointBody()}
                title={translate.new_point}
            />
        );
    }
}

export default graphql(createCompanyDraft, {name: 'createCompanyDraft'})(withTranslations()(SaveDraftModal));