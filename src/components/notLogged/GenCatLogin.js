import React from 'react';
import { BasicButton, ButtonIcon } from "../../displayComponents";
import { ConfigContext } from '../../containers/AppControl';

const GenCatLogin = ({ loginSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const config = React.useContext(ConfigContext);

    window.setToken = creds => {
        setLoading(false);
        loginSuccess(creds.token, creds.refreshToken)
    }

    const gicarRedirect = () => {
        setLoading(true);
        //dades de l aplicacio a integrar
        let entityid="Councilbox";
        let AssertionConsumerServiceURL="https://api.councilbox.com/sso/gicar";

        //url endpoint de GICAR a utilitzar
        let endpointGICAR="https://idp1-gicar.gencat.cat/idp/profile/SAML2/Redirect/SSO?SAMLRequest=";

        //calculem el id de la peticio
        let randomnumber = +new Date();
        //calculem la data d'emissio de la peticio. El desitjable és que la data de la petició es calculi en el servidor web i no en Javascript. Aquest fragment de codi per a calcular la data en Javascript és només per a fer proves, en entorn de producció la data s'hauria de calcular al servidor web de cara a assegurar que estigui generada per un rellotge sincronitzar amb un servidor NTP.
        let d = new Date();
        let curr_date = d.getDate();
        let curr_month = d.getUTCMonth()+1;
        let curr_month2 = (curr_month<10?'0':'') + curr_month;
        let curr_year = d.getFullYear();
        let ymd= curr_year+"-"+curr_month2+"-"+ curr_date+"T";
        let curr_hour = d.getUTCHours();
        let curr_min = d.getUTCMinutes();
        let curr_min2 = (curr_min<10?'0':'') + curr_min;
        let curr_sec = d.getUTCSeconds();
        let curr_msec = d.getUTCMilliseconds();
        let hms=curr_hour + ":" + curr_min2 + ":" + curr_sec + "." + curr_msec;
        let datasaml=ymd+hms;

        //generem samlrequest en pla
        let samlrequestpla="<?xml version=\"1.0\"?> <samlp:AuthnRequest xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\" Version=\"2.0\" ID=\"b"+randomnumber+"a\" IssueInstant=\""+datasaml+"\" AssertionConsumerServiceURL=\""+AssertionConsumerServiceURL+"\" ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" IsPassive=\"false\" xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\"> <saml:Issuer>"+entityid+"</saml:Issuer> </samlp:AuthnRequest>";

        //fem deflate i codificacio en base64
        let samlrequestb64 = btoa(window.RawDeflate.deflate(samlrequestpla));

        //codifiquem url
        let samlrequest=encodeURIComponent(samlrequestb64);


        let targeturl=endpointGICAR+samlrequest;

        //fem el redirect
        window.open(targeturl, "width=800,height=600", "width=800,height=600");
    }

    if(!config.gicarLogin){
        return <span />
    }

    return (
        <BasicButton
            text={'Accés amb GICAR'}
            color={'#BF0000'}
            loading={loading}
            id={'login-button'}
            textStyle={{
                color: "white",
                fontWeight: "700"
            }}
            textPosition="before"
            onClick={gicarRedirect}
            fullWidth={true}
            icon={
                <ButtonIcon
                    color="white"
                    type="arrow_forward"
                />
            }
        />
    )
}

export default GenCatLogin;