import {Router} from 'express'
import samlp from 'samlp'

import mapSlackUserAttributes from './util/mapSlackUserAttributes'
import formatSlackSAMLResponse from './util/formatSlackSAMLResponse'

const router = new Router()

router.use(process.env.SAML_SLACK_LOGIN_PATH, (req, res, next) => {
  req.user = {
    id: '3760fbe8-2c2e-46d9-bca7-a9610dc0d417',
    handle: 'prattsj',
    name: 'SJ Pratt',
    email: 'sabra@learnersguild.org',
  }
  next()
})

router.get(process.env.SAML_SLACK_LOGIN_PATH, (req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html>
      <head>
        <title>Sign in to IDM</title>
        <meta charSet="utf-8" />
      </head>
      <body>
        <form method="post" action="${process.env.SAML_SLACK_LOGIN_PATH}">
          <input type="hidden" name="SAMLRequest" value="${req.query.SAMLRequest}" />
          <input type="hidden" name="RelayState" value="${req.query.RelayState}" />
          <input type="text" name="email" />
          <input type="password" name="password" />
          <input type="submit" value="Sign In" />
        </form>
      </body>
    </html>
  `)
})

router.post(process.env.SAML_SLACK_LOGIN_PATH, samlp.auth({
  issuer: process.env.SAML_ISSUER,
  cert: process.env.SAML_PUBLIC_CERT,
  key: process.env.SAML_PRIVATE_KEY,
  profileMapper: mapSlackUserAttributes,
  signResponse: true,
  getPostURL(audience, samlRequestDom, req, cb) {
    cb(null, process.env.SAML_SLACK_POSTBACK_URL)
  },
  responseHandler(SAMLResponse, options, req, res, next) {
    const samlRes = formatSlackSAMLResponse(SAMLResponse.toString(), {
      NameQualifier: process.env.SAML_SLACK_ATTR_NAMEQUALIFIER,
      SPNameQualifier: process.env.SAML_SLACK_ATTR_SPNAMEQUALIFIER,
    })
    const encodedSamlRes = new Buffer(samlRes).toString('base64')
    res.status(200).send(`
      <!doctype html>
      <html>
        <head>
          <title>Login Successful</title>
          <meta charSet="utf-8" />
        </head>
        <body>
          <form method="post" action="${process.env.SAML_SLACK_POSTBACK_URL}">
            <input type="hidden" name="SAMLResponse" value="${encodedSamlRes}" />
            <input type="hidden" name="RelayState" value="${req.body.RelayState}" />
            <input type="submit" value="Return to Slack" />
          </form>
          <script>
            <!-- automatically submit form -->
            window.onload=function(){document.forms[0].submit();}
          </script>
        </body>
      </html>
    `)
  },
}));

export default router
