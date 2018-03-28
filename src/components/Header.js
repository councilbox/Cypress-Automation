import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import { Link } from 'react-router-dom';
import LanguageSelector from './menus/LanguageSelector';
import UserMenu from './menus/UserMenu';

class Header extends Component{

    logout = () => {
        this.props.actions.logout();
    }

    render(){
        const language = this.props.translate.selectedLanguage;

        return(
            <header className="App-header" style={{height: '3em', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white'}}>
                <Link to="/"><img src={logo} className="App-logo" style={{height: '1.5em', marginLeft: '2em'}} alt="logo" /></Link>
                {/*this.props.helpIcon &&
                    <Icon className="material-icons" style={{marginRight: '2em', fontSize: '1.5em', color: 'grey'}}>live_help</Icon>
                */}
                
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <LanguageSelector
                        selectedLanguage={language}
                    />
                    {this.props.user &&
                        <UserMenu 
                            user={this.props.user} 
                            translate={this.props.translate}
                        />
                    }
                </div>
            </header>
        );
    }
}

export default Header;