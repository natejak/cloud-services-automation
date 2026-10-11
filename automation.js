
const { chromium } = require("playwright");
const fs = require("fs");

async function main() {
  // Launch the browser
  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  // Open the OAMK website
  await page.goto("https://oamk.fi/en/", {
    waitUntil: "domcontentloaded"
  });

  // Read information from the website
  const title = await page.title();
  const headings = await page.locator("h1, h2").allTextContents();

  const results = {
    website: page.url(),
    title: title,
    headings: headings.map(h => h.trim()).filter(Boolean),
    checkedAt: new Date().toISOString()
  };

  // Save extracted data
  fs.writeFileSync(
    "results.json",
    JSON.stringify(results, null, 2)
  );

  // Take a screenshot
  await page.screenshot({
    path: "oamk-screenshot.png",
    fullPage: true,
    animations: "disabled"
  });

  console.log("Website title:", title);
  console.log("Headings found:", results.headings.length);
  console.log("Data saved to results.json");
  console.log("Screenshot saved to oamk-screenshot.png");

  await browser.close();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

