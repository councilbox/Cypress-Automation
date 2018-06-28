import React from 'react';
import { TextInput, DropDownMenu } from '../../displayComponents';
import { COMMANDS } from '../../commands'; 
import Autosuggest from 'react-autosuggest';
import { MenuItem } from 'material-ui';
import autoSuggest from '../../styles/autoSuggest.css';
import { bHistory } from '../../containers/App';
import withSharedProps from '../../HOCs/withSharedProps';



const renderSuggestion = suggestion => (
    <div>
        {`${suggestion.section} - ${suggestion.command}`}
    </div>
);

const getSuggestionValue = suggestion => {
    console.log(suggestion)
    return suggestion.link;
}

class CommandLine extends React.Component {

    state = {
        command: '',
        suggestions: COMMANDS
    }

    updateCommand = (event) => {
        this.setState({
            command: event.target.value
        });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        const filteredCommands = COMMANDS.filter(command => (
            command.section.toLowerCase().includes(value.toLowerCase()) || command.command.toLowerCase().includes(value.toLowerCase())
        ));

        this.setState({
            suggestions: filteredCommands
        });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: COMMANDS
        })
    }

    onSuggestionSelected = (event, suggestion) => {
        console.log(suggestion);
        bHistory.push(`/company/${this.props.company.id}${suggestion.suggestionValue}`);
        this.setState({
            command: ``
        });
    }

    render(){
        const inputProps = {
            placeholder: 'Introduce un comando o acción', //TRADUCCION
            value: this.state.command,
            onChange: this.updateCommand
        };

        return(
            <div style={{maxWidth: '180px'}}>
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        )
    }
}


export default withSharedProps()(CommandLine);