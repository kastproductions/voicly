/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ hello: 'world' }),
  }
}
