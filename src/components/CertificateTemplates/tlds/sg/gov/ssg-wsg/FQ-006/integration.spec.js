import { Selector } from "testcafe";

fixture("ROPSTEN : Skillsfuture Singapore").page`http://localhost:3000`;

const Certificate = "./FQ-006.OPENCERT";

const TemplateTabList = Selector("#template-tabs-list");
const RenderedCertificate = Selector("#rendered-certificate");

const validateTextContent = async (t, component, texts) =>
  texts.reduce(
    async (prev, curr) => t.expect(component.textContent).contains(curr),
    Promise.resolve()
  );

test("FQ006 certificate is rendered correctly", async t => {
  // Uploads certificate via dropzone
  await t.setFilesToUpload("input[type=file]", [Certificate]);

  // Certificate tabs rendered
  await t.expect(TemplateTabList.textContent).contains("Certificate");

  // Certificate tab content
  await validateTextContent(t, RenderedCertificate, [
    "Higher Certificate in Healthcare Support",
    "Podiatry Support",
    "is awarded to",
    "Lee1",
    "ID No: S0000000A",
    "for successful attainment of the requiredindustry approved competencies",
    "20 Nov 2018"
  ]);
});
