import React from 'react';
import Timbrado from './Timbrado';
import { withApollo } from 'react-apollo';
import { buildDocVariable } from './utils';
import gql from 'graphql-tag';
import CBXDocumentLayout from './CBXDocumentLayout';

const spinnerDelay = 2500;

const DocumentPreview = ({ translate, generatePreview, options, collapse, company, client }) => {
    const [loading, setLoading] = React.useState(true);
    const preview = React.useRef(null);
    const mountedDate = React.useRef(new Date().getTime());

    const getPreview = async () => {
        const response = await generatePreview();
        preview.current = response;
        if((new Date().getTime() - mountedDate.current) > spinnerDelay){
			setLoading(false);
		}
    }

    React.useEffect(() => {
        getPreview();
    }, [])


    React.useEffect(() => {
        let interval;
        if(loading){
            interval= setInterval(() => {
                if(preview.current){
                    setLoading(false);
                }
            }, spinnerDelay);
        }
        return () => clearInterval(interval);
    },  [loading])


    return (
        <CBXDocumentLayout
            preview={preview.current}
            options={options}
            loading={loading}
            company={company}
        />
    )
}

export default withApollo(DocumentPreview);