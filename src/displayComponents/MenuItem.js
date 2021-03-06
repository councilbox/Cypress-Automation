import React from 'react';
import { MenuItem } from 'material-ui';

const Item = ({
	value, onClick, style, children
}) => (
	<MenuItem value={value} onClick={onClick} style={style}>
		{children}
	</MenuItem>
);

export default Item;
