import { Selector } from "testcafe";

fixture("Unverified Ceritifcate Rendering").page`http://localhost:3000`;

const Certificate = "./fixture/unverified-issuer.json";

const RenderedCertificate = Selector("#certificate-dropzone");
const InvalidMessage = Selector(".invalid");

const validateTextContent = async (t, component, texts) =>
  texts.reduce(
    async (prev, curr) => t.expect(component.textContent).contains(curr),
    Promise.resolve()
  );

test("Error view rendered when certificate issuers are unverfied", async t => {
  await t.setFilesToUpload("input[type=file]", [Certificate]);

  await InvalidMessage.with({ visibilityCheck: true })();

  await validateTextContent(t, RenderedCertificate, [
    "This certificate is not valid",
    "Certificate issuer identity can not be verified"
  ]);
});
