import React from 'react';
import whiteIcon from "../assets/img/imago-councilbox-inverse-xl.png";

class LiveToast extends React.Component {

    render(){

        return(
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <img src={whiteIcon} style={{height: '2.2em', width: 'auto', marginRight: '0.8em'}} />
                <div>{this.props.message}</div>
            </div>
        )
    }
}

export default LiveToast;