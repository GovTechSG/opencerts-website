import PropTypes from "prop-types";
import CertificateHeader from "../common/certificateheader";
import CertificateFooter from "./certificatefooter";

const Certificate = ({ certificate }) => (

  <div className="container">
    <style>
      {`

        .recipient-paragraph{
          font-style: italic;
          font-family: "Times New Roman", Times, serif;
        }

        .exempted-paragraph{
          font-style:normal;
        }

        .recipient-name{
          font-size:1.5em;
          font-style: italic;
          font-variant:small-caps;
          font-family: "Times New Roman", Times, serif;
        }

        .certificate-name{
          font-size:2.7em;
          font-variant:small-caps;
          font-style: italic;
          font-family: "Times New Roman", Times, serif;
          text-transform:uppercase;
          border-top:1px solid #ccc;
          border-bottom:1px solid #ccc;
          margin-top:0.25em;
          margin-bottom:0.35em;
          padding-top:1em;
          padding-bottom:5em;
        }

        .academic-year{
          margin-top:1em;
          font-variant: normal;
          text-transform: capitalize;
        }

        `}
    </style>

    <CertificateHeader />

    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <div className="recipient-paragraph">It is hereby certified that</div>
    <div className="recipient-name">{certificate.recipient.name}</div>
    <div className="recipient-paragraph">has successfully completed the</div>
    <div className="certificate-name">
      <div>
        Polytechnic
        <br />
        Foundation Programme
      </div>
      <div className="academic-year">
        Academic Year {new Date(certificate.admissionDate).getFullYear()}/
        {new Date(certificate.admissionDate).getFullYear() + 1}
      </div>
    </div>
    <div className="recipient-paragraph">
      at Temasek Polytechnic (Singapore) on{" "}
      {new Date(certificate.issuedOn).toLocaleDateString("en-SG", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })}
    </div>

    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <CertificateFooter certificate={certificate} />
    
  </div>
);

Certificate.propTypes = {
  certificate: PropTypes.object.isRequired
};

export default Certificate;