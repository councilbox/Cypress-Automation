import React from "react";
import { Grid, GridItem } from "./index";
import { Typography, MenuItem } from "material-ui";
import { getSecondary, getPrimary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { removeHTMLTags } from '../utils/CBX';
// import RichTextEditor from 'react-rte';
import { isChrome } from 'react-device-detect';
import { withApollo } from 'react-apollo';
import DropDownMenu from './DropDownMenu';
import Icon from './Icon';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import withSharedProps from "../HOCs/withSharedProps";
import { query } from "../components/company/drafts/companyTags/CompanyTags";
import TextInput from "./TextInput";
import { Divider } from "material-ui";
import Scrollbar from "./Scrollbar";


if (isChrome) {
	let style = document.createElement("style");
	style.innerHTML = '.ql-editor{white-space: normal !important;}';
	document.head.appendChild(style);
}


var AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

class RichTextInput extends React.Component {
	state = {
		value: this.props.value,
		showTags: false
	};

	componentDidMount() {
		this.setState({
			value: this.props.value
		});

	}

	changeShowTags = () => {
		this.setState({
			showTags: !this.state.showTags
		});
	};

	onChange = value => {
		if (!this.rtEditor) {
			return;
		}
		this.setState({ value });
		const html = value.toString('html');
		if (this.props.onChange) {
			if (removeHTMLTags(html).length > 0) {
				this.props.onChange(
					html.replace(/<a /g, '<a target="_blank" ')
				);
			} else {
				this.props.onChange('');
			}
		}
	};

	setValue = value => {
		this.setState({
			value: value
		});
	};

	paste = text => {
		const quill = this.rtEditor.getEditor();
		let selection = quill.getSelection();
		if (!selection) {
			this.rtEditor.focus();
			selection = quill.getSelection();
		}
		quill.clipboard.dangerouslyPasteHTML(selection.index, text);
		setTimeout(() => {
			this.rtEditor.focus();
			quill.setSelection(selection.index + removeHTMLTags(text).length, 0);
		}, 500);
	};

	render() {
		const { tags, loadDraft, errorText, required, translate } = this.props;
		const modules = {
			toolbar: {
				container: [
					[{ 'color': [] }, { 'background': [] }], ['bold', 'italic', 'underline', 'link', 'strike'],
					['blockquote', 'code-block', { 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'header': 1 }, { 'header': 2 }],
					[{ 'align': 'justify' }], ['custom']
				],
				handlers: {
					// 'custom': (...args) => {
					// 	console.log(args);
					// 	console.log(document.getElementById('pruebas'));
					// 	//this.setState({ showTags: true })
					// }
				}
			},
			clipboard: {
				matchVisual: false,
			}
		};

		return (
			<React.Fragment>
				<Typography
					variant="body1"
					style={{ color: !!errorText ? "red" : "inherit" }}
				>
					{this.props.floatingText}
					{!!required && "*"}
					{!!errorText &&
						<FontAwesome
							name={"times"}
							style={{
								fontSize: "13px",
								color: 'red',
								marginLeft: '0.2em'
							}}
						/>
					}
				</Typography>
				<Grid>
					<GridItem xs={12}>
						<div
							style={{
								marginTop: "0.7em",
								marginBottom: "-0.7em",
								paddingRight: "0.8em"
							}}
						>
							{
								<React.Fragment>
									<div
										style={{
											display: "flex",
											float: "right",
										}}
									>
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end'
										}}>
											{!!tags &&
												<SmartTags
													tags={tags}
													open={this.state.showTags}
													translate={translate}
													requestClose={() => this.setState({ showTags: false })}
													paste={this.paste}
												/>
											}
											<div>
												{!!loadDraft && loadDraft}
											</div>
											{!!this.props.saveDraft &&
												this.props.saveDraft
											}
										</div>
									</div>
								</React.Fragment>
							}
						</div>
						<div
							onClick={event => {
								if(event.target.className === 'ql-custom'){
									this.setState({
										showTags: event.target
									})
								}
							}}
						>
							<ReactQuill value={this.state.value}
								onChange={this.onChange}
								modules={modules}
								ref={editor => this.rtEditor = editor}
								id={this.props.id}
								className={`text-editor ${!!errorText ? 'text-editor-error' : ''}`}
							/>
						</div>
					</GridItem>
				</Grid>
			</React.Fragment>
		);
	}
}


const SmartTags = withApollo(withSharedProps()(({ open, requestClose, company, translate, tags, paste, client }) => {
	const secondary = getSecondary();
	const [companyTags, setCompanyTags] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [ocultar, setOcultar] = React.useState(false);

	const loadCompanyTags = React.useCallback(async () => {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id
			}
		});
		setLoading(false);
		setCompanyTags(response.data.companyTags);
	}, [company.id]);

	React.useEffect(() => {
		loadCompanyTags();
	}, [loadCompanyTags]);

	const getTextToPaste = tag => {
		let draftMode = false;
		if (tags) {
			if (tags[0].value.includes('{{')) {
				draftMode = true;
			}
		}

		if (draftMode) {
			return `{{${tag.key}}}`;
		}
		return tag.value;
	}


	return (
		<DropDownMenu
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			color={getPrimary()}
			requestClose={requestClose}
			open={open}
			loading={false}
			paperPropsStyles={{ border: " solid 1px #353434", borderRadius: '3px', }}
			styleBody={{}}
			Component={() => <span/> }
			text={translate.add_agenda_point}
			textStyle={"ETIQUETA"}
			items={
				<div style={{}}
					onClick={event => {
						event.stopPropagation();
					}}
				>
					<div style={{
						margin: "0px 1em",
					}}>
						<div style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between"
						}}
						>
							<div>
								<TextInput
									placeholder={"Buscar Etiquetas"}
									adornment={<Icon>search</Icon>}
									id={"buscarEtiquetasEnModal"}
									type="text"
									stylesAdornment={{ color: getPrimary() }}
									// value={searchModal}
									styleInInput={{ fontSize: "12px", color: getPrimary() }}
									styles={{ marginBottom: "0" }}
									// classes={{ input: props.classes.input }}
									// onChange={event => {
									// 	setSearchModal(event.target.value);
									// }}
									disableUnderline={true}
								/>
							</div>
							<div style={{ color: getPrimary() }}>
								&lt;tags&gt;
							</div>
						</div>
					</div>
					<Divider style={{ background: getPrimary() }} />
					<div
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							margin: "1em"
						}}
					>
						{/* //TRADUCCION */}
						<div style={{ fontSize: "14px", display: "flex", alignItems: "center", color: "#969696", minWidth: "700px", marginBottom: "1em" }} >
							<i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', cursor: "pointer", paddingRight: "0.3em" }} onClick={() => setOcultar(false)}>
								help
										</i>
							{!ocultar &&
								<div>Los &lt;tags&gt; son marcas inteligentes que añaden el nombre o elemento personalizado al documento <u style={{ cursor: "pointer" }} onClick={() => setOcultar(true)}>(Ocultar)</u></div>
							}
						</div>
						<div style={{ width: "97%", height: "16vh" }} >
							<Scrollbar>
								<div style={{ width: "100%", }}>
									{tags.map(tag => {
										return (
											<div
												key={`tag_${tag.label}`}
												onClick={() =>
													paste(`<span style="color:${getPrimary()};" id="${tag.label}">${tag.getValue ? tag.getValue() : tag.value}</span>`)
												}
												style={{ color: getPrimary(), display: "inline-flex", marginRight: "1em", cursor: "pointer" }}
											>
												&lt;{tag.label}&gt;
									</div>
										);
									})}
									{(!loading && companyTags) && companyTags.map(tag => (
										<div
											key={`tag_${tag.id}`}
											onClick={() =>
												paste(`<span id="${tag.id}">${getTextToPaste(tag)}</span>`)
											}
											style={{ color: getPrimary(), display: "inline-flex", marginRight: "1em", cursor: "pointer" }}
										>
											&lt;{tag.key}&gt;
									</div>
									))}
								</div>
							</Scrollbar>
						</div>
					</div>
				</div>
			}
		/>
	)
}))

export default RichTextInput;