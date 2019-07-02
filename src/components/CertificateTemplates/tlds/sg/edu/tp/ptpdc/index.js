import MultiCertificateRenderer from "template-utils/MultiCertificateRenderer";

import TPCert from "../ptmc/certificate";
import ApprovedAddresses from "../common/approvedAddresses";

const templates = [
  {
    id: "certificate",
    label: "Certificate",
    template: TPCert
  }
];

const ptpdc = () => (
  <MultiCertificateRenderer
    templates={templates}
    whitelist={ApprovedAddresses}
  />
);

export default ptpdc;
