import { existsSync, readFileSync, unlinkSync } from "fs";
import { Selector } from "testcafe";
import TestDocument2 from "./fixture/sample-dns-verified-special-characters.json";
import TestDocument1 from "./fixture/sample-dns-verified.json";

fixture("Download Certificate").page`http://localhost:3000`;

const Document1 = "./fixture/sample-dns-verified.json";
const Document2 = "./fixture/sample-dns-verified-special-characters.json";
const StatusButton = Selector("#certificate-status");
const DownloadLink = Selector("a").withAttribute("download");
const DownloadButton = Selector("#btn-download");

const validateTextContent = async (t, component, texts) =>
  texts.reduce(async (_prev, curr) => t.expect(component.textContent).contains(curr), Promise.resolve());

// From https://stackoverflow.com/a/57624660/950462
const waitForFileDownload = async (t, filePath) => {
  // Timeout after 10 seconds
  for (let i = 0; i < 100; i++) {
    if (existsSync(filePath)) return true;
    await t.wait(100);
  }
  return existsSync(filePath);
};

test("Sample document is downloaded correctly", async (t) => {
  await t.setFilesToUpload("input[type=file]", [Document1]);

  await validateTextContent(t, StatusButton, ["Certificate issued by EXAMPLE.OPENATTESTATION.COM"]);

  // Simulate an OpenCert file download
  const fileName = await DownloadLink.getAttribute("download");
  const filePath = `${process.env.HOME}/${fileName}`; // Only works for *nix
  await t.click(DownloadButton);
  await t.expect(await waitForFileDownload(t, filePath)).eql(true);

  // We expect the contents of the input to match the downloaded file
  await t.expect(JSON.parse(readFileSync(filePath, "utf8"))).eql(TestDocument1);

  // Clean up
  await unlinkSync(filePath);
});

test("Sample document with special characters is downloaded correctly", async (t) => {
  await t.setFilesToUpload("input[type=file]", [Document2]);

  await validateTextContent(t, StatusButton, ["Certificate issued by EXAMPLE.OPENATTESTATION.COM"]);

  // Simulate an OpenCert file download
  const fileName = await DownloadLink.getAttribute("download");
  const filePath = `${process.env.HOME}/${fileName}`; // Only works for *nix
  await t.click(DownloadButton);
  await t.expect(await waitForFileDownload(t, filePath)).eql(true);

  // We expect the contents of the input to match the downloaded file
  await t.expect(JSON.parse(readFileSync(filePath, "utf8"))).eql(TestDocument2);

  // Clean up
  await unlinkSync(filePath);
});
