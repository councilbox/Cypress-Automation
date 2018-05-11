import React from 'react';
import { BasicButton } from "../../../displayComponents/index";
import { getSecondary } from '../../../styles/colors';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import LoadDraft from './LoadDraft';

class LoadDraftModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loadDraft: false
        }
    }

    render(){
        const { company, councilType, draftType, translate, statutes } = this.props;
        const secondary = getSecondary();

        return(
            <React.Fragment>
                <BasicButton
                    text={translate.load_draft}
                    color={secondary}
                    textStyle={{color: 'white', fontWeight: '600', fontSize: '0.8em', textTransform: 'none', marginLeft: '0.4em', minHeight: 0, lineHeight: '1em'}}
                    textPosition="after"
                    onClick={() => this.setState({loadDraft: true})}
                />
                <Dialog
                    open={this.state.loadDraft}
                    maxWidth={false}
                    onClose={() => this.setState({loadDraft: false})}
                >
                    <DialogTitle>
                        {translate.new_location_of_celebrate}
                    </DialogTitle>
                    <DialogContent style={{width: '800px'}}>
                        <LoadDraft company={company}
                                   councilType={councilType}
                                   draftType={draftType}
                                   translate={translate}
                                   statutes={statutes}
                        />
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default LoadDraftModal;