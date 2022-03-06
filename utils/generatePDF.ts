import chromium from 'chrome-aws-lambda'

export default async function generatePDF({ html = '', margin }) {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    ignoreHTTPSErrors: true,
    headless: true,
  })
  const page = await browser.newPage()

  await page.setContent(html)
  await page.emulateMediaType('print')
  const { bottom = '1cm', top = '1cm', left = '3cm', right = '1.5cm' } = margin

  const pdfBuffer = await page.pdf({
    format: 'a4',
    printBackground: true,
    margin: { bottom, top, left, right },
  })

  await page.close()
  await browser.close()

  return pdfBuffer
}
