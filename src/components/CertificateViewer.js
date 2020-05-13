import PropTypes from "prop-types";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import CertificateVerifyBlock from "./CertificateVerifyBlock";
import styles from "./certificateViewer.scss";
import Modal from "./Modal";
import ErrorBoundary from "./ErrorBoundary";
import CertificateShareLinkForm from "./CertificateShareLink/CertificateShareLinkForm";
import { FeatureFlagContainer } from "./FeatureFlag";

const CertificateSharingForm = dynamic(
  import("./CertificateSharing/CertificateSharingForm")
);

const DecentralisedRenderer = dynamic(
  () => import("./DecentralisedTemplateRenderer/DecentralisedRenderer"),
  { ssr: false }
);

// https://github.com/zeit/next.js/issues/4957#issuecomment-413841689
// eslint-disable-next-line react/display-name
const ForwardedRefDecentralisedRenderer = React.forwardRef((props, ref) => (
  <DecentralisedRenderer {...props} forwardedRef={ref} />
));

const renderVerifyBlock = props => (
  <CertificateVerifyBlock verificationStatus={props.verificationStatus} />
);

const renderHeaderBlock = (props, childRef) => {
  const renderedVerifyBlock = renderVerifyBlock(props);
  return (
    <div className={`container-fluid ${styles["pd-0"]} ${styles.container}`}>
      <div className="row">
        <div>{renderedVerifyBlock}</div>
        <div className={`${styles["share-buttons"]}`}>
          <div className={`${styles["share-buttons-wrap"]}`}>
            <div className={`${styles["share-buttons-content"]}`}>
              <div className={`row flex-nowrap`}>
                <div className="col-auto">
                  <div
                    id="btn-print"
                    className={`${styles["print-btn"]} ${styles.deadcenter}`}
                    onClick={() => {
                      childRef.current.print();
                    }}
                  >
                    <i className="fas fa-print" />
                  </div>
                </div>
                <FeatureFlagContainer
                  name="SHARE_LINK"
                  render={() => (
                    <div
                      className="col-auto"
                      onClick={() => props.handleShareLinkToggle()}
                    >
                      <div
                        id="btn-link"
                        className={`${styles["send-btn"]} ${styles.deadcenter}`}
                      >
                        <i className="fas fa-link" />
                      </div>
                    </div>
                  )}
                />
                <div
                  className="col-auto"
                  onClick={() => props.handleSharingToggle()}
                >
                  <div
                    id="btn-email"
                    className={`${styles["send-btn"]} ${styles.deadcenter}`}
                  >
                    <i className="fas fa-envelope" />
                  </div>
                </div>
                <div className="col-auto">
                  <a
                    download={`${props.certificate.id}.opencert`}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`data:text/plain;,${JSON.stringify(
                      props.document,
                      null,
                      2
                    )}`}
                  >
                    <button
                      id="btn-download"
                      className={`${styles["send-btn"]} ${styles.deadcenter}`}
                      title="Download"
                    >
                      <i className="fas fa-file-download" />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CertificateViewer = props => {
  const { document } = props;
  const childRef = React.useRef();

  const registryFragmentName = "OpencertsRegistryVerifier";
  const registryFragment = props.verificationStatus.find(
    status => status.name === registryFragmentName
  );
  const renderedHeaderBlock = renderHeaderBlock(props, childRef);
  const isInRegistry = registryFragment && registryFragment.status === "VALID";

  return (
    <ErrorBoundary>
      {
        <div>
          {isInRegistry ? (
            <div
              id="status-banner-container"
              className={`${styles["status-banner-container"]} ${
                styles.valid
              } exact-print`}
            >
              <div className={`${styles["status-banner"]}`}>
                Certificate issuer is in the SkillsFuture Singapore registry for
                Opencerts
              </div>
            </div>
          ) : (
            <div
              id="status-banner-container"
              className={`${styles["status-banner-container"]} ${
                styles.invalid
              }`}
            >
              <div className={`${styles["status-banner"]}`}>
                Certificate issuer is <b>not</b> in the SkillsFuture Singapore
                registry for Opencerts
                <br />
                <Link href="/faq#verifications-issuers-not-in-registry-meaning">
                  <a>
                    <small>What does this mean ?</small>
                  </a>
                </Link>
              </div>
            </div>
          )}
          <div id={styles["top-header-ui"]}>
            <div className={styles["header-container"]}>
              {renderedHeaderBlock}
            </div>
          </div>
          <ForwardedRefDecentralisedRenderer
            rawDocument={document}
            ref={childRef}
          />
          <Modal show={props.showSharing} toggle={props.handleSharingToggle}>
            <CertificateSharingForm
              emailSendingState={props.emailSendingState}
              handleSendCertificate={props.handleSendCertificate}
              handleSharingToggle={props.handleSharingToggle}
            />
          </Modal>
          <Modal
            show={props.showShareLink}
            toggle={props.handleShareLinkToggle}
          >
            <CertificateShareLinkForm
              shareLink={props.shareLink}
              copiedLink={props.copiedLink}
              handleShareLinkToggle={props.handleShareLinkToggle}
              handleCopyLink={props.handleCopyLink}
            />
          </Modal>
        </div>
      }{" "}
    </ErrorBoundary>
  );
};

CertificateViewer.propTypes = {
  document: PropTypes.object,
  certificate: PropTypes.object,
  verifying: PropTypes.bool,
  shareLink: PropTypes.object,

  verificationStatus: PropTypes.array,
  showSharing: PropTypes.bool,
  showShareLink: PropTypes.bool,
  emailSendingState: PropTypes.string,
  handleSharingToggle: PropTypes.func,
  handleSendCertificate: PropTypes.func,
  handleShareLinkToggle: PropTypes.func
};

renderVerifyBlock.propTypes = CertificateViewer.propTypes;
renderHeaderBlock.propTypes = CertificateViewer.propTypes;
