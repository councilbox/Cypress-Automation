import React from 'react';
import { graphql } from 'react-apollo';
import { CardPageLayout, LoadingSection } from '../../../../displayComponents';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { withRouter } from 'react-router-dom';
import SignatureStepper from './SignatureStepper';
import { signature } from '../../../../queries/signature';
import SignatureStepOne from './SignatureStepOne';
import SignatureStepTwo from './SignatureStepTwo';

class SignatureEditorPage extends React.Component {
    state = {
        step: 2
    };

    render(){
        const { translate } = this.props;
        let title = translate.dashboard_new_signature;
        if(!this.props.data.loading){
            if(this.props.data.signature.title){
                title = this.props.data.signature.title;
            }
        }

        return (
            <CardPageLayout title={title} disableScroll>
                <div style={{marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '1.5em'}}>
                    <div style={{maxWidth: '600px', width: '100%'}}>
                        <SignatureStepper
                            translate={translate}
                            active={this.state.step - 1}
                            goToPage={this.goToPage}
                        />
                    </div>
				</div>
                <div
                    style={{
                        height: 'calc(100% - 3em)'
                    }}
                >
                    {this.props.data.loading?
                        <div
                            style={{
                                height: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <LoadingSection />
                        </div>
                    :
                        <React.Fragment>
                            {this.state.step === 1 &&
                                <SignatureStepOne
                                    translate={translate}
                                    key={this.props.data.signature.id}
                                    signature={this.props.data.signature}
                                    nextStep={() => this.setState({ step: 2 })}
                                />
                            }
                            {this.state.step === 2 &&
                                <SignatureStepTwo
                                    translate={translate}
                                    key={this.props.data.signature.id}
                                    signature={this.props.data.signature}
                                    prevStep={() => this.setState({ step: 1 })}
                                />
                            }
                        </React.Fragment>
                    }
                </div>
            </CardPageLayout>
        )
    }
}

export default graphql(signature, {
    options: props => ({
        variables: {
            id: props.match.params.id
        }
    })
})(withSharedProps()(withRouter(SignatureEditorPage)));