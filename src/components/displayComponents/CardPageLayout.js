import React from 'react';
import { lightGrey } from '../../styles/colors';
import { Card } from 'material-ui';
import { Typography } from 'material-ui';
import RegularCard from '../displayComponents/RegularCard';
import Scrollbar from 'react-perfect-scrollbar';


const CardPageLayout = ({ children, title }) => (
    <div style = {{paddingBottom: '4em', overflow: 'hidden', position: 'relative', paddingTop: '0.6em', backgroundColor: lightGrey, height: '100vh', width: '100%'}} >
        <Scrollbar>
            <div style={{width: '95%', margin: 'auto'}}>
                <RegularCard
                    cardTitle={title}
                    cardSubtitle={''}
                    content={
                        children
                    }
                />
            </div>
        </Scrollbar>        
    </div>
)

export default CardPageLayout;
/*        <Typography variant="headline" gutterBottom>
            {title}
        </Typography>

<Card style={{width: '95%', height: '80vh', padding: 0, borderRadius: '0.3em', overflow: 'auto'}}>
            {children}
        </Card>   */