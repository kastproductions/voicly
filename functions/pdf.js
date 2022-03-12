/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const chromium = require('chrome-aws-lambda')
// const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda')

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath

  if (!executablePath) {
    // running locally
    const puppeteer = require('puppeteer')
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true,
    })
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
}

async function generatePDF({ html = '', margin }) {
  const browser = await getBrowserInstance()
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle2' })
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

exports.handler = async (event, ctx) => {
  const { styleTags = '', innerHTML = '', margin = {} } = JSON.parse(event.body)
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
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
    body: pdf.toString('base64'),
  }

  //   res.setHeader('Content-Type', 'application/pdf')
  //   res.setHeader('Content-Length', pdf.length)
  //   res.status(200).send(pdf)
}
