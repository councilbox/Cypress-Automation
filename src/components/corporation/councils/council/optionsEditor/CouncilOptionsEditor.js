import React from 'react';
import MenuSuperiorTabs from '../../../../dashboard/MenuSuperiorTabs';
import AgendaDefaultVoteEditor from './AgendaDefaultVoteEditor';
import CompanyFeaturesEditor from './CompanyFeaturesEditor';
import CouncilStatuteEditor from './CouncilStatuteEditor';


const CouncilOptionsEditor = ({ translate, council, refetch }) => {
	const [tab, setTab] = React.useState('Opciones');

	return (
		<>
			<div style={{ fontSize: '13px', display: 'inline-block', marginBottom: '2em' }}>
				<MenuSuperiorTabs
					items={[
						'Opciones',
						'Votos por defecto',
						'Features entidad',
					]}
					selected={tab}
					setSelect={setTab}
				/>
			</div>
			{tab === 'Opciones' &&
				<CouncilStatuteEditor
					translate={translate}
					statute={council.statute}
					council={council}
					refetch={refetch}
				/>
			}
			{tab === 'Votos por defecto' &&
				<AgendaDefaultVoteEditor
					translate={translate}
					council={council}
					refetch={refetch}
				/>
			}
			{tab === 'Features entidad' &&
				<CompanyFeaturesEditor
					companyId={council.companyId}
					translate={translate}
				/>
			}
		</>
	);
};

export default CouncilOptionsEditor;
