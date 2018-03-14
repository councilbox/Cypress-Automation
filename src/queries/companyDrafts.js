import gql from "graphql-tag";

export const deleteDraft = gql`
    mutation deleteCompanyDraft($draftId: Int!) {
        deleteCompanyDraft(draftId: $draftId) {
            code
            msg
        }
    }
`;

export const companyDrafts = gql`
    query companyDrafts($companyId: Int!) {
      companyDrafts(companyId: $companyId) {
            id
            title
            description
        }
    }
`;

export const companyDraft = gql`
    query companyDraft($draftId: Int!) {
      companyDraft(draftId: $draftId) {
            id
            title
            description
            text
            type
            category
            votationType
            prototype
            councilType
            majorityType
            majority
            majorityDivider
            statuteId
            companyType
            language
        }
    }
`;