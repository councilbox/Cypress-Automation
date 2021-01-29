import React from 'react';
import { DropDownMenu, BasicButton } from '../../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../../styles/colors';
import withSharedProps from '../../../../../HOCs/withSharedProps';
import CompanyDocumentsBrowser from '../../../../company/drafts/documents/CompanyDocumentsBrowser';

const PointAttachments = ({ translate, company, attachments, setAttachments, setDeletedAttachments, deletedAttachments }) => {
    const primary = getPrimary();
    const secondary = getSecondary();
    const [companyDocumentsModal, setCompanyDocumentsModal] = React.useState(false)

    const handleFile = event => {
        const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		// if ((file.size / 1000 + totalSize) > MAX_FILE_SIZE) {
		// 	setState({
		// 		...state,
		// 		alert: true
		// 	});
		// 	return;
		// }
		const reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async event => {
			const fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: event.loaded.toString(),
				base64: btoa(event.target.result)
            };
            setAttachments([...attachments, fileInfo]);
		};
    }

    const removeAgendaAttachment = index => {
        const toDelete = attachments.splice(index, 1);
        if(setDeletedAttachments){
            setDeletedAttachments([...deletedAttachments, toDelete[0]]);
        }

        setAttachments([...attachments]);
    }



    return (
        <>
            <CompanyDocumentsBrowser
                company={company}
                translate={translate}
                open={companyDocumentsModal}
                requestClose={() => setCompanyDocumentsModal(false)}
                action={file => {
                    const { __typename, ...data } = file;
                    setAttachments([...attachments, data]);
                    setCompanyDocumentsModal(false);
                }}
                trigger={
                    <div style={{ color: secondary }}>
                        {translate.select}
                    </div>
                }
            />
            <input
                type="file"
                id={"raised-button-file"}
                onChange={handleFile}
                //disabled={uploading}
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: 0,
                    width: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    opacity: 0
                }}
            />
            <DropDownMenu
                color="transparent"
                styleComponent={{ width: "" }}
                Component={() => <BasicButton
                        color={primary}
                        icon={<i className={"fa fa-paperclip"}
                        style={{
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: '700',
                            paddingLeft: "5px"
                        }}></i>}
                        text={translate.add_attachment}
                        textStyle={{
                            color: 'white'
                        }}
                    />
                }
                textStyle={{ color: primary }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                type="flat"
                items={
                    <div style={{ padding: "1em" }}>
                        <label htmlFor="raised-button-file">
                            <div style={{ display: "flex", color: "black", padding: ".5em 0em", cursor: "pointer" }}>
                                <div style={{ paddingLeft: "10px" }}>
                                    {translate.upload_file}
                                </div>
                            </div>
                        </label>
                    <div
                        style={{
                            display: "flex",
                            color: "black",
                            padding: ".5em 0em",
                            borderTop: "1px solid" + primary,
                            cursor: "pointer"
                        }}
                        onClick={() => setCompanyDocumentsModal(true)}
                    >
                        <div style={{ paddingLeft: "10px" }} >
                            {translate.my_documentation}
                        </div>
                    </div>
                </div>
                }
            />
            <div>
                {attachments.map((attachment, index) => (
                    <div
                        style={{
                            border: `1px solid ${secondary}`,
                            float: 'left',
                            marginTop: '1em',
                            padding: '5px',
                            marginLeft: index > 0 ? '5px' : '0',
                            borderRadius: '5px',
                            color: 'primary'
                        }}
                        key={`attachment_${attachment.id || index}`}
                    >
                        {attachment.filename || attachment.name}
                        <span onClick={() => removeAgendaAttachment(index)}
                            style={{
                                marginLeft: '0.6em',
                                color: secondary,
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            X
                        </span>
                    </div>
                ))}
            </div>
            <div style={{ clear: 'both' }} />

        </>
    )
}

export default withSharedProps()(PointAttachments);
