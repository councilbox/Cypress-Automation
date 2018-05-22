import React, { Component } from 'react';
import { Checkbox, AlertConfirm, Icon, TextInput } from "../../../../displayComponents";
import { Typography } from 'material-ui';
import { graphql } from 'react-apollo';
import { sendVideoEmailTest } from '../../../../queries';
import { checkValidEmail } from '../../../../utils/validation';
import * as CBX from '../../../../utils/CBX';


class SendCredentialsTestModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            success: '',
            emailError: '',
            email: ''
        };
    }

    close = () => {
        this.props.requestClose();
        this.setState({
            success: false,
            sending: false,
            emailError: '',
            error: false,
            sendAgenda: false
        });
    };

    sendVideoEmailTest = async () => {
        this.setState({
            sending: true
        });
        const response = await this.props.sendVideoEmailTest({
            variables: {
                councilId: this.props.council.id,
                email: this.state.email
            }
        });
        if(response.data.sendVideoEmailTest.success){
            this.setState({
                sending: false,
                success: true
            });
        }else{
            this.setState({
                sending: false,
                error: true
            });
        }
    };

    onKeyUp = (event) => {
        if(!checkValidEmail(this.state.email)){
            this.setState({
                emailError: this.props.translate.tooltip_invalid_email_address
            });
        }else {
            this.setState({
                emailError: ''
            })
        }
        if (event.nativeEvent.keyCode === 13) {
            this.sendVideoEmailTest();
        }
    };

    _renderBody() {
        const { translate } = this.props;
        const { data, errors } = this.state;
        const texts = CBX.removeHTMLTags(translate.send_convene_test_email_modal_text).split('.');
    
    
        if (this.state.success) {
            return (<SuccessMessage message={translate.sent}/>);
        }
    
        return (
            <div style={{ width: '500px' }}>
                <TextInput
                    required
                    floatingText={translate.email}
                    onKeyUp={this.onKeyUp}
                    type="text"
                    errorText={this.state.emailError}
                    value={this.state.email}
                    onChange={(event) => this.setState({
                        email: event.nativeEvent.target.value
                    })}
                />
            </div>
        );
    }

    render() {
        const { translate } = this.props;

        return(
            <AlertConfirm
                requestClose={this.close}
                open={this.props.show}
                acceptAction={this.state.success? () => this.close() : this.sendVideoEmailTest}
                buttonAccept={this.state.success? translate.accept : translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderBody()}
                title={translate.send_video_test}
            />
        );
    }
}

export default graphql(
    sendVideoEmailTest, {
        name: 'sendVideoEmailTest' 
    }
)(SendCredentialsTestModal);

const SuccessMessage = ({ message }) => (
    <div style={{width: '500px', display: 'flex', alignItems: 'center', alignContent: 'center', flexDirection: 'column'}}>
        <Icon className="material-icons" style={{fontSize: '6em', color: 'green'}}>
            check_circle
        </Icon>
        <Typography variant="subheading">
            {message}
        </Typography>
    </div>
);