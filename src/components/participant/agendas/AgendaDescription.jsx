import React from 'react';
import { CollapsibleSection } from '../../../displayComponents';

class AgendaDescription extends React.Component {

    state = {
        open: false
    }

    toggle = () => {
        const newValue = !this.state.open;
        this.setState({
            open: newValue
        });
    }

    render() {
        // if (!this.props.agenda.description) {
        //     return this.props.translate.no_description;
        // }

        return (
            //TODO CREAR BIEN LA ANIMACI
            <div dangerouslySetInnerHTML={{ __html: this.props.agenda.description}} style={{ width: '100%'}} className={this.state.open? 'overflowNoEllipsisDangerousHtml' : "overflowEllipsisDangerousHtml"} onClick={this.toggle} ></div>

            // <CollapsibleSection
            //     trigger={() =>
            //         <span onClick={this.toggle} style={{fontSize: '14px'}}>{this.props.translate.show_description}</span>
            //     }
            //     open={this.state.open}
            //     onTriggerClick={() => {}}
            //     collapse={() =>
            //         <div dangerouslySetInnerHTML={{__html: this.props.agenda.description}}></div>
            //     }
            // />
        )
    }
}

export default AgendaDescription;
