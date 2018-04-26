import React from 'react';
import { Select } from 'material-ui';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

const SelectInput = ({ floatingText, id, value = 0, onChange, errorText, children, required, disabled }) => (
    <FormControl style={{width: '100%', marginTop: '0', marginBottom: '8px'}} >
        <InputLabel htmlFor={id}>{`${!!floatingText? floatingText : ''}${required? '*' : ''}`}</InputLabel>
        <Select
            inputProps={{
                name: floatingText,
                id: id,
            }}
            disabled={!!disabled}
            value={value}
            onChange={onChange}
            error={!!errorText}
        >
            {children}
        </Select>
    </FormControl>
);

export default SelectInput;