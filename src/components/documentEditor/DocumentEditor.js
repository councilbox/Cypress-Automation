import React from 'react';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Card, Tooltip } from 'material-ui';
import { shouldCancelStart } from './utils';
import { Grid, Scrollbar, BasicButton } from '../../displayComponents';
import { getPrimary, getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import Lupa from '../../displayComponents/Lupa';
import GroupedBlock from './GroupedBlock';
import Block, { BorderBox } from './Block';
import AgreementsPreview from './AgreementsPreview';
import OptionsMenu from './OptionsMenu';
import Timbrado from './Timbrado';
import DocumentPreview from './DocumentPreview';


const DocumentEditor = ({
	translate, company, data, documentId, editBlock, blocks, column, updateDocument, doc, client, setDoc, documentMenu, options, setOptions, withDrawer, ...props
}) => {
	function filterBlocks() {
		if (doc && blocks) {
			return blocks.filter(block => block.type === 'text' || !doc.find(item => item.type === block.type));
		}
		return [];
	}
	const edit = true;
	const [filteredBlocks, setBlocks] = React.useState(filterBlocks());
	const [state, setState] = React.useState({
		loadDraft: false,
		load: 'intro',
		draftType: null,
		hide: true,
		collapse: false,
		preview: false,
		updating: false,
		disableButtons: false,
		text: '',
		errors: {},
		sendActDraft: false,
		FinishActModal: false
	});
	const scroll = React.useRef(null);
	const [newId, setNewId] = React.useState(null);
	const [mostrarBloques, setMostrarBloques] = React.useState(!withDrawer);

	const { hide, collapse, preview } = state;
	const primary = getPrimary();
	const secondary = getSecondary();

	React.useEffect(() => {
		setBlocks(filterBlocks(blocks, doc));
	}, [doc.length]);

	React.useEffect(() => {
		if (newId) {
			const element = document.getElementById(newId);
			if (element) {
				scroll.current.scrollbar.scrollTop(element.offsetTop - 10);
			}
			setNewId(null);
		}
	}, [newId]);


	const changeToColumn = index => {
		props.setColumn(index);
	};

	const moveUp = (id, index) => {
		if (index > 0) {
			setDoc(arrayMove(doc, index, (index - 1)));
			setNewId(id);
		}
	};

	const moveDown = (id, index) => {
		if ((index + 1) < doc.length) {
			setDoc(arrayMove(doc, index, (index + 1)));
			setNewId(id);
		}
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setDoc(arrayMove(doc, oldIndex, newIndex));
	};

	const remove = id => {
		const arrayDoc = doc.filter(item => item.id !== id);
		setDoc(arrayDoc);
	};

	const addItem = id => {
		const resultado = filteredBlocks.find(arrastrable => arrastrable.id === id);

		const newRamdomId = Math.random().toString(36).substr(2, 9);

		const newDoc = [...doc];
		newDoc.push({
			...resultado,
			id: newRamdomId,
		});
		setDoc(newDoc);
		setNewId(newRamdomId);
	};

	const opcionesMenu = () => (
		<React.Fragment>
			<div style={{ width: '98%', display: 'flex', padding: '1em 1em ' }}>
				<i
					className="material-icons"
					style={{
						color: primary, fontSize: '14px', cursor: 'pointer', paddingRight: '0.3em', marginTop: '4px'
					}}
					onClick={() => setState({
						...state,
						hide: !hide
					})}
					id="document-editor-toggle-drawer"
				>
					help
				</i>
				{hide
					&& <div style={{
						fontSize: '13px',
						color: '#a09aa0'
					}}>
						{translate.document_editor_help}
					</div>
				}
			</div>

			<div style={{ height: withDrawer ? 'calc( 100% - 6em )' : 'calc( 100% - 3em )', borderRadius: '8px' }}>
				<Scrollbar>
					<Grid style={{
						justifyContent: 'space-between', width: '98%', padding: '1em', paddingTop: '1em', paddingBottom: '3em'
					}}>
						<React.Fragment>
							<OptionsMenu
								translate={translate}
								options={options}
								setOptions={setOptions}
							/>
							{filteredBlocks.filter(item => !item.logic).map(item => (
								<BorderBox
									key={item.id}
									addItem={addItem}
									id={item.id}
									type={item.type}
								>
									<div >
										<div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{translate[item.label] || item.label}</div>
									</div>
								</BorderBox>
							))}
							<LogicBlocks
								addItem={addItem}
								automaticos={filteredBlocks}
								translate={translate}
							>
							</LogicBlocks>
						</React.Fragment>
					</Grid>
				</Scrollbar>
			</div>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<div style={{ width: '100%', height: '100%' }}>
				<div style={{ display: 'flex', height: '100%', position: 'relative' }}>
					{withDrawer ?
						<DrawerOptions
							mostrarBloques={mostrarBloques}
							setMostrarBloques={() => setMostrarBloques(false)}
						>
							{opcionesMenu()}
						</DrawerOptions>
						: <div style={{
							width: '700px', maxWidth: '700px', transition: 'max-width 0.5s linear', overflow: 'hidden', height: 'calc( 100% - 3em )', display: collapse ? 'none' : ''
						}}>
							{opcionesMenu()}
						</div>
					}
					<div style={{
						width: '100%', position: collapse && 'relative', height: 'calc( 100% - 3.5em )', justifyContent: collapse ? 'center' : '', display: collapse ? 'flex' : ''
					}}>
						{!collapse
							&& <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em 0em ' }}>
								<div style={{ display: 'flex' }}>
									{documentMenu}
								</div>
								<div style={{ display: 'flex' }}>
									{options.doubleColumn
										&& <React.Fragment>
											<BasicButton
												text={'Columna 1'}
												color={column === 1 ? secondary : 'white'}
												textStyle={{
													color: column === 1 ? 'white' : 'black',
													fontWeight: '700',
													fontSize: '0.9em',
													textTransform: 'none'
												}}
												textPosition="after"
												id="document-editor-edit-first-column"
												onClick={() => changeToColumn(1)}
												buttonStyle={{
													boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
													borderRadius: '3px',
													borderTopRightRadius: '0px',
													borderBottomRightRadius: '0px',
													borderRight: '1px solid #e8eaeb'
												}}
											/>
											<BasicButton
												text={'Columna 2'}
												id="document-editor-edit-second-column"
												color={column === 2 ? secondary : 'white'}
												textStyle={{
													color: column === 2 ? 'white' : 'black',
													fontWeight: '700',
													fontSize: '0.9em',
													textTransform: 'none'
												}}
												textPosition="after"
												onClick={() => changeToColumn(2)}
												buttonStyle={{
													boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
													borderRadius: '3px',
													borderTopRightRadius: '0px',
													borderBottomRightRadius: '0px',
													borderRight: '1px solid #e8eaeb'
												}}
											/>
										</React.Fragment>
									}
									{withDrawer
										&& <Tooltip title="Ocultar">
											<div
												style={{
													boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
													borderRadius: '3px',
													borderTopRightRadius: '0px',
													borderBottomRightRadius: '0px',
													borderRight: '1px solid #e8eaeb',
													padding: '0.6em 2em',
													color: 'black',
													border: '1px solid gainsboro',
													cursor: 'pointer',
													marginRight: '1em',
													fontWeight: '700',
													fontSize: '0.9em',
													height: '3em',
													textTransform: 'none'
												}}
												onClick={() => setMostrarBloques(!mostrarBloques)}
											>
												<i style={{ cursor: 'pointer' }} className={mostrarBloques ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
											</div>
										</Tooltip>
									}
									<Tooltip title="Ver preview">
										<div
											style={{
												boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
												borderRadius: '3px',
												borderTopRightRadius: '0px',
												borderBottomRightRadius: '0px',
												borderRight: '1px solid #e8eaeb',
												padding: '0.6em 2em',
												color: 'black',
												border: '1px solid gainsboro',
												cursor: 'pointer',
												marginRight: '1em',
												fontWeight: '700',
												fontSize: '0.9em',
												height: '3em',
												textTransform: 'none'
											}}
											id="document-editor-open-preview-button"
											className="withShadow"
											onClick={() => {
												setState({
													...state,
													collapse: !collapse,
													preview: true
												});
												scroll.current.scrollbar.scrollToTop();
											}}
										>
											<Lupa color={'black'} width={'20px'} height={'20px'} />
										</div>
									</Tooltip>
								</div>
							</div>
						}
						<div style={{ position: 'absolute', top: '7px', right: '15px' }}>
							{collapse
								&& <Tooltip title="Volver al editor">
									<div
										style={{
											boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
											borderRadius: '3px',
											borderTopRightRadius: '0px',
											borderBottomRightRadius: '0px',
											borderRight: '1px solid #e8eaeb',
											padding: '0.6em 2em',
											color: 'black',
											border: '1px solid gainsboro',
											cursor: 'pointer',
											marginRight: '1em',
											fontWeight: '700',
											fontSize: '0.9em',
											textTransform: 'none',
											height: '3em',
										}}
										className="withShadow"
										id="document-editor-close-preview-button"
										onClick={() => setState({
											...state,
											collapse: !collapse,
											preview: false
										})}
									>
										<i className="fa fa-arrow-circle-right" aria-hidden="true" style={{ fontSize: '20px', color: secondary }}></i>
									</div>
								</Tooltip>
							}
						</div>
						<div style={{
							height: 'calc( 100% - 3em )', border: '1px solid gainsboro', marginTop: collapse && '4em', borderRadius: '8px', background: 'white', maxWidth: collapse ? '210mm' : '', width: collapse ? '100%' : ''
						}}>
							<Scrollbar ref={scroll}>
								{preview ?
									<DocumentPreview
										translate={translate}
										options={options}
										doc={doc}
										generatePreview={props.generatePreview}
										documentId={documentId}
										collapse={collapse}
										company={company}
										finishInModal={false}
									/>
									: <div style={{ display: 'flex', height: '100%' }} >
										<div style={{ width: '20%', maxWidth: '95px' }}>
											{options.stamp
												&& <Timbrado
													collapse={collapse}
													edit={edit}
												/>
											}
										</div>
										<div style={{ width: '100%' }}>
											<div style={{ width: '100%' }}>
												<div style={{
													marginTop: '1em', marginRight: '4em', maxWidth: '125px', float: 'right'
												}}>
													<img style={{ width: 'auto', maxHeight: '3em', float: 'right' }} src={company.logo}></img>
												</div>
											</div>
											<div style={{
												padding: '1em', clear: 'both', paddingLeft: '0.5em', marginRight: '3em', marginBottom: '3em'
											}} className={'actaLienzo'}>
												<SortableList
													axis={'y'}
													lockAxis={'y'}
													items={doc}
													editBlock={editBlock}
													// updateBlock={updateBlock}
													state={state}
													// setState={setState}
													edit={true}
													translate={translate}
													offset={0}
													column={column}
													onSortEnd={onSortEnd}
													helperClass="draggable"
													shouldCancelStart={shouldCancelStart}
													moveUp={moveUp}
													moveDown={moveDown}
													remove={remove}
													{...props}
												/>
											</div>
										</div>
									</div>
								}
							</Scrollbar>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const SortableList = SortableContainer(({
	items, column, editBlock, state, edit, translate, offset = 0, moveUp, moveDown, remove, ...props
}) => {
	if (edit) {
		return (
			<div>
				{items
					&& items.map((item, index) => (
						<DraggableBlock
							key={`item-${item.id}`}
							editBlock={editBlock}
							state={state}
							column={column}
							edit={edit}
							translate={translate}
							index={offset + index}
							value={item}
							id={item.id}
							indexItem={index}
							moveUp={moveUp}
							moveDown={moveDown}
							remove={remove}
							expand={item.expand}
							{...props}
						/>
					))
				}
			</div>
		);
	}
	return (
		<div>
			{items
				&& items.map((item, index) => (
					<NoDraggableBlock
						key={`item-${item.id}`}
						editBlock={editBlock}
						edit={edit}
						translate={translate}
						index={offset + index}
						value={item}
						column={column}
						id={item.id}
						indexItem={index}
						moveUp={moveUp}
						moveDown={moveDown}
						remove={remove}
						logic={item.logic}
						{...props}
					/>
				))
			}
		</div>
	);
});


const DraggableBlock = SortableElement(props => {
	const [expand, setExpand] = React.useState(false);

	const blockFijoTomadeAcuerdos = {
		value: {
			id: Math.random().toString(36).substr(2, 9),
			label: 'Toma de acuerdos',
			type: 'Toma de acuerdos',
			noBorrar: true,
			editButton: false,
			text: '',
			expand: true
		}
	};

	return (
		props.value !== undefined && props.value.text !== undefined
		&& <div
			key={props.id}
			id={props.id}
			style={{
				opacity: 1,
				width: '100%',
				display: 'flex',
				listStyleType: 'none',
				borderRadius: '4px',
				cursor: 'grab',
				marginBottom: '0.8em',
				position: 'relative',
				boxShadow: '0 2px 4px 5px rgba(0, 0, 0, 0.11)',
				background: 'white'
			}}
			className="draggable"
		>
			<div style={{ paddingRight: '4px', background: props.value.colorBorder ? props.value.colorBorder : getPrimary(), borderRadius: '15px' }}></div>
			<div style={{ marginLeft: '4px', width: '95%', minHeight: '90px' }}>
				<div style={{
					width: '25px', cursor: 'pointer', position: 'absolute', top: '5px', right: '35px'
				}}>
					{props.expand
						&& <IconsDragActions
							turn={'expand'}
							clase={`fa fa-times ${props.id}`}
							aria-hidden="true"
							click={() => setExpand(!expand)}
							id={props.id}
							indexItem={props.indexItem}
							expand={expand}
						/>
					}
				</div>
				<div style={{
					width: '25px', cursor: 'pointer', position: 'absolute', top: '5px', right: '0',
				}}>
					{!props.value.hideDelete
						&& <IconsDragActions
							turn={'cross'}
							clase={`fa fa-times ${props.id}`}
							aria-hidden="true"
							click={props.remove}
							id={props.id}
							indexItem={props.indexItem}
						/>
					}
				</div>
				<div style={{
					width: '25px', cursor: 'pointer', position: 'absolute', top: !props.noBorrar ? '35px' : '10px', right: '1px',
				}}>
					<div>
						<IconsDragActions
							turn={'up'}
							aria-hidden="true"
							click={props.moveUp}
							id={props.id}
							indexItem={props.indexItem}
						/>
					</div>
					<div>
						<IconsDragActions
							turn={'down'}
							aria-hidden="true"
							click={props.moveDown}
							id={props.id}
							indexItem={props.indexItem}
						/>
					</div>
				</div>
				{(props.value.items && props.value.items.length > 0) ?
					!expand ?
						<GroupedBlock
							item={props.value}
							{...props}
						/>
						: <Block
							{...blockFijoTomadeAcuerdos}
						/>
					: <Block
						{...props}
					/>

				}
			</div>
		</div>
	);
});

const DrawerOptions = ({ mostrarBloques, children, setMostrarBloques }) => (
	<div style={{
		height: '100%',
		width: mostrarBloques ? '520px' : '0',
		position: 'absolute',
		top: '0',
		left: '-5px',
		backgroundColor: 'white',
		overflowX: 'hidden',
		transition: '0.5s',
		zIndex: '20000',
		overflow: 'hidden',
		borderRight: mostrarBloques && '1px solid gainsboro'
	}}>
		<div style={{ position: 'relative' }}>
			<i
				className={'fa fa-close'}
				style={{
					cursor: 'pointer',
					fontSize: '1.5em',
					color: getSecondary(),
					position: 'absolute',
					right: '12px',
					top: '7px'
				}}
				onClick={setMostrarBloques}
			/>
		</div>
		<div style={{ paddingTop: '1em', height: '100%' }}>
			{children}
		</div>
	</div>
);

const NoDraggableBlock = props => {
	if (props.logic) {
		return (
			props.value !== undefined && props.value.text !== undefined
			&& <BorderBox
				itemInfo={288}
				icon={props.value.icon}
				id={props.id}
				colorBorder={props.value.colorBorder}
				stylesBody={{ width: '98%' }}
				noIcon={true}
			>
				<div id={props.id}>
					<div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{props.value.label}</div>
				</div>
			</BorderBox>
		);
	}
	return (
		props.value !== undefined && props.value.text !== undefined
		&& <React.Fragment>
			{props.value.type === 'agreements' ?
				<Card
					key={props.id}
					id={props.id}
					style={{
						boxShadow: 'none',
						margin: '3px',
						paddingLeft: '15px',
						paddingTop: '5px',
					}}
				>
					<AgreementsPreview
						column={props.column}
						item={props.value}
						translate={props.translate}
					/>
				</Card>
				: <Card
					key={props.id}
					style={{
						boxShadow: 'none',
						margin: '3px',
						paddingLeft: '15px',
						paddingTop: '5px',
					}}
				>
					<div style={{}}>
						<div style={{}}
							dangerouslySetInnerHTML={{
								__html: props.column === 2 ? props.value.secondaryText : props.value.text
							}}>
						</div>

					</div>
				</Card>
			}
		</React.Fragment>

	);
};

const LogicBlocks = ({ automaticos, addItem, translate }) => {
	const [open, setOpen] = React.useState(true);
	return (
		<div style={{
			width: '100%', background: 'white', boxShadow: ' 0 2px 4px 5px rgba(0, 0, 0, 0.11)', borderRadius: '4px', marginBottom: '0.8em',
		}}>
			<div style={{ width: '100%', display: 'flex' }}>
				<div style={{ paddingRight: '4px' }}></div>
				<div style={{
					marginLeft: '0.5em', paddingTop: '0.8em', paddingBottom: '0.8em', width: '100%'
				}}>
					<div style={{
						width: '100%', fontSize: '16px', color: '#a09aa0', display: 'flex', fontWeight: 'bold'
					}}>
						<div style={{ marginRight: '1em', width: '15em' }}>{translate.auto_blocks}</div>
						<div style={{ display: 'flex', width: '100%' }}>
							<div>
								<i className="material-icons" style={{
									color: getPrimary(), fontSize: '14px', cursor: 'pointer', paddingRight: '0.3em', marginTop: '4px'
								}} onClick={() => setOpen(!open)}>
									help
								</i>
							</div>
							{open
								&& <div style={{ fontSize: '10px', color: '#a09aa0', fontWeight: '100' }}>{translate.auto_blocks_help}</div>
							}
						</div>
					</div>
					<div style={{ width: '100%', marginTop: '0.5em' }}>
						{automaticos.filter(item => item.logic === true).map((item, index) => (
							<CajaLogicBlocks
								key={`${item.id + index}automaticos`}
								item={item}
								addItem={addItem}
								translate={translate}
								itemInfo={item.id}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const CajaLogicBlocks = ({
	item, addItem, itemInfo, translate
}) => (
	<div style={{ display: 'flex', width: '100%', marginBottom: '0.8em' }}>
		<div style={{
			color: getPrimary(), fontWeight: 'bold', fontSize: '16px', display: 'flex'
		}}>
			<div>
				<img src={item.icon} />
			</div>
		</div>
		<div style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
			<div style={{
				marginLeft: '0.3em', width: '100%', whiteSpace: 'nowrap', fontSize: ' 16px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000000'
			}}>
				{translate[item.label] || item.label}
			</div>
			<div style={{ marginLeft: '0.3em', marginRight: '0.3em' }}>
				<i
					className="material-icons"
					style={{ cursor: 'pointer', color: '#979797' }}
					onClick={() => addItem(itemInfo)}
					id={`logic-block-${item.type}`}
				>
					arrow_right_alt
				</i>
			</div>
		</div>
	</div>
);


export const IconsDragActions = ({
	click, id, indexItem, turn, expand
}) => {
	const [hover, setHover] = React.useState(false);

	const onMouseEnter = () => {
		setHover(true);
	};
	const onMouseLeave = () => {
		setHover(false);
	};

	if (turn === 'up') {
		return (
			<i
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				className={'material-icons'}
				style={{
					background: hover && 'gainsboro', borderRadius: '20px', color: '#a09aa0', transform: 'rotate(-90deg)'
				}}
				aria-hidden="true"
				onClick={() => click(id, indexItem)}
			>
				arrow_right_alt
			</i>
		);
	}
	if (turn === 'expand') {
		return (
			<i
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				className={'fa fa-compress'}
				style={{
					background: hover && 'gainsboro', borderRadius: '20px', color: expand ? 'black' : '#a09aa0', padding: '5px', fontSize: '16px',
				}}
				aria-hidden="true"
				onClick={() => click(id, indexItem)}
			>
			</i>
		);
	}
	if (turn === 'cross') {
		return (
			<i
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				className={'material-icons'}
				style={{ background: hover && 'gainsboro', borderRadius: '20px', color: '#a09aa0' }}
				aria-hidden="true"
				onClick={() => click(id, indexItem)}
			>
				clear
			</i>
		);
	}

	return (
		<i
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={'material-icons'}
			style={{
				background: hover && 'gainsboro', borderRadius: '20px', color: '#a09aa0', transform: 'rotate(90deg)'
			}}
			aria-hidden="true"
			onClick={() => click(id, indexItem)}
		>
			arrow_right_alt
		</i>
	);
};


export default withSharedProps()(DocumentEditor);
