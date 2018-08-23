import React from 'react';
import { TextInput, AlertConfirm } from '../../../displayComponents';
import { graphql } from 'react-apollo';
import { updateStatute } from "../../../queries";

class StatuteNameEditor extends React.Component {

    state = {
        title: this.props.translate[this.props.statute.title] || this.props.statute.title,
        titleError: ''
    };

    updateStatute = async () => {
        if(!this.checkRequiredFields()){
            const response = await this.props.updateStatute({
                variables: {
                    statute: {
                        title: this.state.title,
                        id: this.props.statute.id
                    }
                }
            });

            if(response.data){
                if(response.data.updateCompanyStatute.id){
                    this.props.requestClose();
                    this.props.refetch();
                }
            }
        }
    }

    checkRequiredFields = () => {
        if(!this.state.title){
            this.setState({
                titleError: this.props.translate.required_field
            });
            return true;
        }

        return false;
    }


    render(){
        const { translate } = this.props;

        return (
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={true}
                acceptAction={this.updateStatute}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={
                    <TextInput
                        floatingText={translate.council_type}
                        required
                        type="text"
                        errorText={this.state.titleError}
                        value={this.state.title}
                        onChange={event =>
                            this.setState({
                                title: event.target.value
                            })
                        }
                    />
                }
                title={'Editar nombre de reunión'}//TRADUCCION
            />
        )
    }
}

export default graphql(updateStatute, {
    name: 'updateStatute'
})(StatuteNameEditor);