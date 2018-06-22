import React from 'react';
import FontAwesome from 'react-fontawesome';
import { MenuItem } from 'material-ui';
import { Checkbox } from '../../../displayComponents';

const CompanyItem = ({ company, onCheck, checkable, checked }) => (
    <div style={{display: 'flex', flexDirection: 'row'}}>
        {checkable &&
            <div style={{width: '5em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Checkbox
                    value={checked}
                    onChange={(event, isInputChecked) => {
                        onCheck(company, isInputChecked)
                    }}  
                />
            </div>
        }
        <MenuItem
            style={{
                border: '1px solid gainsboro',
                height: '3em',
                width: '100%',
                height: '3em',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <div 
                style={{
                    width: '5em',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {!!company.logo?
                    <img src={company.logo} alt={"logo"} style={{height: '2em', width: 'auto', maxWidth: '3em'}} />
                :
                    <FontAwesome
                        name={'building-o'}
                        style={{fontSize: '1.7em', color: 'lightgrey'}}
                    />

                }
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: '1.4em'
                }}   
            >
                <span style={{fontSize: '0.9rem', fontWeight: '700'}}>{company.businessName}</span>
                <span style={{fontSize: '0.7rem'}}>{`ID: ${company.id}`}</span>
            </div>
        </MenuItem>
    </div>
)

export default CompanyItem;