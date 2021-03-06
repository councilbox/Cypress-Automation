import React from 'react';
import Steps from 'antd/lib/steps';
import 'antd/lib/steps/style/index.css';
import Icon from 'antd/lib/icon';
import { Tooltip } from 'material-ui';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import withWindowSize from '../../../../HOCs/withWindowSize';


const SignatureStepper = ({
	translate, active, goToPage, windowSize
}) => {
	const secondary = getSecondary();
	const primary = getPrimary();

	const XsIcon = ({ icon, page }) => (
		<Icon
			type={icon}
			style={{
				color: active === page - 1 ? primary : secondary,
				cursor: active > page - 1 ? 'pointer' : 'inherit',
				userSelect: 'none'
			}}

			{...(active > page - 1 ? {
				onClick: () => goToPage(page),
			} : {})}

		/>
	);

	if (windowSize === 'xs') {
		return (
			<div
				style={{
					width: '100%',
					height: '2.5em',
					display: 'flex',
					flexDirection: 'row',
					paddingLeft: '15%',
					paddingRight: '15%',
					justifyContent: 'space-between'
				}}
			>
				<Tooltip title={translate.wizard_convene}>
					<XsIcon icon='schedule' page={1} />
				</Tooltip>
				<Tooltip title={translate.census}>
					<XsIcon icon='team' page={2} />
				</Tooltip>
			</div>
		);
	}

	return (
		<Steps
			current={active}
			size="small"
			direction="horizontal"
		>
			<Steps.Step
				title={
					<span
						style={{ userSelect: 'none', cursor: active > 0 ? 'pointer' : 'inherit' }}
						{...(active > 0 ?
							{
								onClick: () => goToPage(1),
							}
							: {})}
					>
						{translate.wizard_convene}
					</span>
				}
				icon={<Icon type="schedule" style={{ color: active === 0 ? primary : secondary }} />}
			/>
			<Steps.Step
				title={
					<span
						style={{ userSelect: 'none', cursor: active > 1 ? 'pointer' : 'inherit' }}
						{...(active > 1 ?
							{
								onClick: () => goToPage(2),
							}
							: {})}
					>
						{translate.census}
					</span>
				}
				icon={<Icon type="team" style={{ color: active === 1 ? primary : secondary }} />}
			/>
		</Steps>
	);
};

export default withWindowSize(SignatureStepper);
