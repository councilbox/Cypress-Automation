import React from 'react';
import Block from './Block';

const GroupedBlock = ({
	translate, item, expand, hoverFijo, hoverAndSave, setText, ...props
}) => {
	const updateBlock = (index, text) => props.editBlock(item.items[index].id, text);

	const removeBlock = index => {
		props.toggleBlock(item.items[index].id, !item.items[index].hide);
	};

	return (
		<React.Fragment>
			{item.items.map((block, index) => (
				<Block
					key={index}
					value={block}
					hoverFijo={hoverFijo}
					hoverAndSave={hoverAndSave}
					setText={setText}
					removeBlock={removeBlock}
					column={props.column}
					translate={translate}
					id={index}
					editBlock={updateBlock}
				/>
			))}
		</React.Fragment>
	);
};

export default GroupedBlock;
