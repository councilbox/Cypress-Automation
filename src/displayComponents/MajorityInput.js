import React from 'react';
import { TextInput, Grid, GridItem } from './index';
import * as CBX from '../utils/CBX';

const MajorityInput = ({ type, value, divider, onChange, onChangeDivider, style, majorityError, dividerError }) => {
    if (CBX.isMajorityPercentage(type)) {
        return (

            <div style={{ width: '100%', ...style }}>
                <TextInput
                    type={"number"}
                    value={value}
                    errorText={majorityError}
                    min="1"
                    max="100"
                    adornment={'%'}
                    onChange={(event) => onChange(event.nativeEvent.target.value)}
                />
            </div>

        )
    }

    if (CBX.isMajorityFraction(type)) {
        return (

            <div style={{ width: '100%', ...style }}>
                <Grid>
                    <GridItem xs={6} lg={6} md={6}>
                        <TextInput
                            type={"number"}
                            value={value}
                            min="1"
                            errorText={majorityError}
                            onChange={(event) => onChange(event.nativeEvent.target.value)}
                        />
                    </GridItem>
                    <GridItem xs={6} lg={6} md={6}>
                        <TextInput
                            type={"number"}
                            value={divider}
                            min="1"
                            errorText={dividerError}
                            adornment={'/'}
                            onChange={(event) => onChangeDivider(event.nativeEvent.target.value)}
                        />
                    </GridItem>
                </Grid>
            </div>

        )
    }

    if (CBX.isMajorityNumber(type)) {
        return (

            <div style={{ width: '100%', ...style }}>
                <TextInput
                    type={"number"}
                    min="1"
                    value={value}
                    errorText={majorityError}
                    onChange={(event) => onChange(event.nativeEvent.target.value)}
                />
            </div>

        )
    }

    return (<div> </div>);
};

export default MajorityInput;