import chromium from 'chrome-aws-lambda'

async function generatePDF({ html = '', margin }) {
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

export default async function handler(req, res) {
  const { styleTags = '', innerHTML = '', margin = {} } = req.body
  const html = `<html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${styleTags}
      </style>
    </head>
    <body>
      ${innerHTML}
    </body>
  </html>
  `
  const pdf = await generatePDF({ html, margin })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Length', pdf.length)
  res.status(200).send(pdf)
}
