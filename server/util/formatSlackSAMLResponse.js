// adds Slack-specific attributes to SAML response elements
export default function formatSlackSAMLResponse(SAMLResponse, params = {}) {
  const insertStr = ` NameQualifier="${params.NameQualifier}" SPNameQualifier="${params.SPNameQualifier}"`
  const insertAfterStr = 'Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"'
  const insertIndex = SAMLResponse.indexOf(insertAfterStr) + insertAfterStr.length
  return _insertAtIndex(SAMLResponse, insertStr, insertIndex)
}

function _insertAtIndex(targetStr, insertStr, index) {
  return `${targetStr.slice(0, index)}${insertStr}${targetStr.slice(index)}`
}
