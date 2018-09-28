import Dropzone from "react-dropzone";
import PropTypes from "prop-types";

import DefaultView from "./Views/DefaultView";
import FileFormatErrorView from "./Views/FileFormatErrorView";
import VerifyingView from "./Views/VerifyingView";
import UnverifiedView from "./Views/UnverifiedView";

const renderDropzoneContent = props => {
  const {
    handleRenderOverwrite,
    isDragReject,
    verifying,
    issuerIdentityStatus,
    hashStatus,
    issuedStatus,
    notRevokedStatus,
    document,
    verificationStatus
  } = props;
  if (isDragReject) {
    return <FileFormatErrorView />;
  }
  if (verifying) {
    return <VerifyingView verificationStatus={verificationStatus} />;
  }
  if (
    document &&
    (!hashStatus.verified ||
      !issuedStatus.verified ||
      !notRevokedStatus.verified ||
      !issuerIdentityStatus.verified)
  ) {
    return (
      <UnverifiedView
        handleRenderOverwrite={handleRenderOverwrite}
        hashStatus={hashStatus}
        issuedStatus={issuedStatus}
        notRevokedStatus={notRevokedStatus}
        issuerIdentityStatus={issuerIdentityStatus}
      />
    );
  }
  return <DefaultView />;
};

// Injects additional props on top of isDragReject, isDragActive, acceptedFiles & rejectedFiles
const renderDropzoneContentCurry = additionalProps => props =>
  renderDropzoneContent({ ...props, ...additionalProps });

const onFileDrop = (acceptedFiles, handleCertificateChange) => {
  // eslint-disable-next-line no-undef
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result);
      handleCertificateChange(json);
    } catch (e) {
      // TODO add in error handling
      // eslint-disable-next-line
        console.log(e);
    }
  };
  if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
    acceptedFiles.map(f => reader.readAsBinaryString(f));
};

const CertificateDropzone = ({
  handleCertificateChange,
  handleRenderOverwrite,
  verifying,
  issuerIdentityStatus,
  hashStatus,
  issuedStatus,
  notRevokedStatus,
  document,
  verificationStatus
}) => (
  <Dropzone
    accept="application/json"
    onDrop={acceptedFiles => onFileDrop(acceptedFiles, handleCertificateChange)}
    className="h-100"
    acceptClassName=""
    rejectClassName=""
  >
    {renderDropzoneContentCurry({
      handleCertificateChange,
      handleRenderOverwrite,
      verifying,
      issuerIdentityStatus,
      hashStatus,
      issuedStatus,
      notRevokedStatus,
      document,
      verificationStatus
    })}
  </Dropzone>
);

CertificateDropzone.propTypes = {
  document: PropTypes.object,
  handleCertificateChange: PropTypes.func,
  handleRenderOverwrite: PropTypes.func,
  updateCertificate: PropTypes.func,
  verifying: PropTypes.bool,
  issuerIdentityStatus: PropTypes.object,
  hashStatus: PropTypes.object,
  issuedStatus: PropTypes.object,
  notRevokedStatus: PropTypes.object,
  verificationStatus: PropTypes.array
};

renderDropzoneContent.propTypes = {
  handleRenderOverwrite: PropTypes.func,
  document: PropTypes.object,
  verifying: PropTypes.bool,
  isDragReject: PropTypes.bool,
  issuerIdentityStatus: PropTypes.object,
  hashStatus: PropTypes.object,
  issuedStatus: PropTypes.object,
  notRevokedStatus: PropTypes.object,
  verificationStatus: PropTypes.array
};

export default CertificateDropzone;
