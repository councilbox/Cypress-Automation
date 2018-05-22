import React from 'react';
import Button from 'material-ui/Button';
import { Icon } from './';


const FabButton = ({ onClick, color, icon }) => (
    <Button variant="fab" color="primary" onClick={onClick} style={{outline: 0}}>
        {icon}
    </Button>
)

export default FabButton;