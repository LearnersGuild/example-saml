import {Router} from 'express'
import samlp from 'samlp'

import mapSlackUserAttributes from './util/mapSlackUserAttributes'
// JW - 2017/03/28 -- this logic causes things to fail and doesn't seem necessary
// import formatSlackSAMLResponse from './util/formatSlackSAMLResponse'

const router = new Router()

// JW - 2017/03/28 -- this will instead be the IDM user
router.use(process.env.SAML_SLACK_LOGIN_PATH, (req, res, next) => {
  req.user = {
    id: 'abcd1234-abcd-1234-abcd-1234abcd1234',
    handle: 'someone',
    name: 'Some One',
    email: 'someone@learnersguild.org',
  }
  next()
})

// JW - 2017/03/28 -- this will instead be the standard IDM sign-in button
router.get(process.env.SAML_SLACK_LOGIN_PATH, (req, res) => {
  console.log({query: req.query})
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
  audience: 'https://learnersguild.slack.com',
  destination: process.env.SAML_SLACK_POSTBACK_URL,
  profileMapper: mapSlackUserAttributes,
  signResponse: true,
  signatureNamespacePrefix: 'ds',
  getPostURL(audience, samlRequestDom, req, cb) {
    cb(null, process.env.SAML_SLACK_POSTBACK_URL)
  },
  // JW - 2017/03/28 -- we can totally get rid of responseHandler and things still seem to work
  // responseHandler(SAMLResponse, options, req, res, next) {
  //   console.log({body: req.body, options})
  //   // JW - 2017/03/28 -- this logic causes things to fail and doesn't seem necessary
  //   // const samlRes = formatSlackSAMLResponse(SAMLResponse.toString(), {
  //   //   NameQualifier: process.env.SAML_SLACK_ATTR_NAMEQUALIFIER,
  //   //   SPNameQualifier: process.env.SAML_SLACK_ATTR_SPNAMEQUALIFIER,
  //   // })
  //   // const encodedSamlRes = new Buffer(samlRes).toString('base64')
  //   const encodedSamlRes = new Buffer(SAMLResponse).toString('base64')
  //   res.status(200).send(`
  //     <!doctype html>
  //     <html>
  //       <head>
  //         <title>Login Successful</title>
  //         <meta charSet="utf-8" />
  //       </head>
  //       <body>
  //         <form method="post" action="${process.env.SAML_SLACK_POSTBACK_URL}">
  //           <input type="hidden" name="SAMLResponse" value="${encodedSamlRes}" />
  //           <input type="hidden" name="RelayState" value="${req.body.RelayState}" />
  //           <input type="submit" value="Return to Slack" />
  //         </form>
  //         <script>
  //           <!-- automatically submit form -->
  //           window.onload=function(){document.forms[0].submit();}
  //         </script>
  //       </body>
  //     </html>
  //   `)
  // },
}));

export default router
