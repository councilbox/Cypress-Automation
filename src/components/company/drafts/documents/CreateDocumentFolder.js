import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../../displayComponents';
import { Input } from 'material-ui';


const CreateDocumentFolder = ({ translate, refetch, open, requestClose, client, company, parentFolder }) => {
    const [name, setName] = React.useState('');

    const createDocumentFolder = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation CreateDocumentFolder($companyDocument: CompanyDocumentInput){
                    createDocumentFolder(companyDocument: $companyDocument){
                        id
                    }
                }
            `,
            variables: {
                companyDocument: {
                    name,
                    companyId: company.id,
                    parentFolder
                }
            }
        });

        refetch();
        requestClose();
    }


    const renderBody = () => {
        return (
            <Input
                placeholder={translate.title}
                //error={!!errors.title}
                disableUnderline={true}
                id={"titleDraft"}
                style={{
                    color: "rgba(0, 0, 0, 0.65)",
                    fontSize: '15px',
                    boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                    //border: !!errors.title? '2px solid red' : '1px solid #d7d7d7',
                    width: "100%",
                    padding: '.5em 1.6em',
                    marginTop: "1em"
                }}
                value={name}
                onChange={event =>
                    setName(event.nativeEvent.target.value)
                }
            >
            </Input>
        )
    }

    //TRADUCCION
    return (
        <>
            <AlertConfirm
                title='Crear nueva carpeta'
                open={open}
                acceptAction={createDocumentFolder}
                requestClose={requestClose}
                buttonCancel={translate.cancel}
                buttonAccept={translate.accept}
                bodyText={renderBody()}
            />
        </>
    )
}

export default withApollo(CreateDocumentFolder);