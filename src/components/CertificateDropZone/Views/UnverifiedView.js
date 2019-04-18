import PropTypes from "prop-types";
import Link from "next/link";
import css from "./viewerStyles.scss";

const View = ({
  issuerIdentityStatus,
  hashStatus,
  issuedStatus,
  notRevokedStatus
}) => {
  const isWarning =
    hashStatus.verified && issuedStatus.verified && notRevokedStatus.verified;
  return (
    <div
      className={`${css["viewer-container"]} ${
        isWarning ? css.warning : css.invalid
      }`}
      style={{
        backgroundColor: isWarning ? "#fbf6e9" : "#fbeae9",
        borderRadius: 10
      }}
    >
      <span className={css["message-container"]}>
        {isWarning ? (
          <img src="/static/images/dropzone/warning.svg" />
        ) : (
          <img src="/static/images/dropzone/invalid.svg" />
        )}
        <span
          className={`${isWarning ? "warning" : "invalid"} m-3`}
          style={{ fontSize: "1.5rem" }}
        >
          {isWarning
            ? "Certificate from unregistered institution"
            : "This certificate is not valid"}
        </span>
      </span>

      <div className={css.verifications}>
        {!hashStatus.verified ? (
          <p className={css.messages}>
            The certificate&#39;s contents are inaccurate
          </p>
        ) : null}

        {!issuedStatus.verified ? (
          <p className={css.messages}>The certificate records are not found</p>
        ) : null}

        {!notRevokedStatus.verified ? (
          <p className={css.messages}>The certificate has been revoked</p>
        ) : null}

        {!issuerIdentityStatus.verified ? (
          <div>
            <p className={css.messages}>
              Certificate from unregistered institution
            </p>
            <p>
              We are unable to verify the certificate as this institution has
              not registered with OpenCerts
            </p>
          </div>
        ) : null}
      </div>

      <Link href="/faq">
        <div className={css["unverified-btn"]}>What should I do?</div>
      </Link>

      <div className={css["secondary-links"]}>
        <span>
          <Link href=" ">
            <a className={css["text-link"]}>Try another</a>
          </Link>
        </span>
        {isWarning ? (
          <span
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            <Link href="/viewer">
              <a id="certificate-view-anyway" className={css["text-link"]}>
                View certificate anyway
              </a>
            </Link>
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

View.propTypes = {
  handleRenderOverwrite: PropTypes.func,
  document: PropTypes.object,

  issuerIdentityStatus: PropTypes.object,
  hashStatus: PropTypes.object,
  issuedStatus: PropTypes.object,
  notRevokedStatus: PropTypes.object
};

export default View;
