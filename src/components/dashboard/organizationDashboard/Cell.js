import React from 'react';

const Cell = ({ text, width }) => (
	<div style={{
		overflow: 'hidden',
		width: width ? `calc( 100% / ${width})` : 'calc( 100% / 5 )',
		textAlign: 'left',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		paddingRight: '10px'
	}}>
		{text}
	</div>
);

export default Cell;
