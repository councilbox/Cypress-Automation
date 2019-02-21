import React from 'react';
import { Scrollbar, LoadingSection, TextInput, BasicButton } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import NewTranslationModal from './NewTranslationModal';

class TranslationsPage extends React.Component {

    state = {
        filterText: '',
        newModal: false
    }

    scrollbar = null;

    handleScrollStop = () => {
        if(this.scrollbar.getValues().top > 0.9){
            this.loadMore();
        }
    }

    updateFilterSearch = text => {
        this.setState({
            filterText: text
        }, this.refresh);
    }

    showNewModal = () => {
        this.setState({
            newModal: true
        })
    }

    closeNewModal = () => {
        this.setState({
            newModal: false
        })
    }

    refresh = async () => {
        this.props.data.refetch({
            filters: [{
                text: this.state.filterText,
                field: 'label'
            }],
        })
    }

    loadMore = async () => {
        this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.rootTranslations.length,
					limit: 10
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					rootTranslations: [
						...prev.rootTranslations,
						...fetchMoreResult.rootTranslations
                    ]
				};
			}
		});
    }

    render(){
        if(!this.props.data.rootTranslations){
            return <LoadingSection />;
        }

        return(
            <div style={{width: '100%', height: 'calc(100% - 3em)', overflow: 'hidden'}}>
                <div style={{borderBottom: '1px solid gainsboro', paddingRight: '1em', paddingLeft: '1em', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <BasicButton
                            text="Nueva traducción"
                            onClick={this.showNewModal}
                        />
                        <NewTranslationModal
                            open={this.state.newModal}
                            requestClose={this.closeNewModal}
                            translate={this.props.translate}
                        />
                    </div>
                    <div style={{width: '30%'}}>
                        <TextInput
                            value={this.state.filterText}
                            onChange={event => this.updateFilterSearch(event.target.value)}
                        />
                    </div>
                </div>
                <Scrollbar onScrollStop={this.handleScrollStop} ref={ref => this.scrollbar = ref}>
                    <div style={{width: '100%', padding: '1em'}}>
                        {this.props.data.rootTranslations.map(translation =>
                            <div style={{marginTop: '1em'}} key={`translation_${translation.label}`}>
                                <h5>{`${translation.label}:`}</h5>
                                <TextInput
                                    floatingText="es"
                                    value={translation.es}
                                />
                                <TextInput
                                    floatingText="en"
                                    value={translation.en}
                                />
                                <TextInput
                                    floatingText="gal"
                                    value={translation.gal}
                                />
                                <TextInput
                                    floatingText="cat"
                                    value={translation.cat}
                                />
                                <TextInput
                                    floatingText="pt"
                                    value={translation.pt}
                                />
                            </div>
                        )}
                    </div>
                </Scrollbar>
            </div>
        );
    }
}

const rootTranslations = gql`
    query RootTranslations($filters: [FilterInput], $options: OptionsInput){
        rootTranslations(filters: $filters, options: $options){
            label
            es
            gal
            pt
            cat
            en
        }
    }
`;

export default graphql(rootTranslations, {
    options: props => ({
        variables: {
            options: {
                limit: 10,
                offset: 0
            }
        }
    })
})(withTranslations()(TranslationsPage));