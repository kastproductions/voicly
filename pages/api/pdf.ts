import type { NextApiRequest, NextApiResponse } from 'next'
import generatePDF from '../../utils/generatePDF'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  res.status(200).send(pdf)
}
