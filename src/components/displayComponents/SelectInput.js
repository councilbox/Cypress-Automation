import React from 'react';
import { Select } from 'material-ui';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

const SelectInput = ({ floatingText, id, value = 0, onChange, errorText, children }) => (
    <FormControl style={{width: '100%', marginTop: '15px', marginBottom: '8px'}}>
        <InputLabel htmlFor={id}>{floatingText}</InputLabel>
        <Select
            inputProps={{
                name: floatingText,
                id: id,
            }}
            value={value}
            onChange={onChange}
            error={!!errorText}
        >
            {children}
        </Select>
    </FormControl>
);

export default SelectInput;