/**
 * Maps a user profile to a Slack-based identity.
 * (Drastically modified version of https://github.com/auth0/node-samlp/blob/0b29f97b3c36e706d15822e043d3affad1a7609c/lib/claims/PassportProfileMapper.js)
 *
 * @param  {Object} user - the user profile
 */
export default function mapSlackUserAttributes(user) {
  return {
    getClaims() {
      return {
        'User.Email': user.email,
        'User.Username': user.handle,
        first_name: user.firstName,
        last_name: user.lastName,
      }
    },

    getNameIdentifier() {
      return {
        nameIdentifier: user.id,
        nameIdentifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
      }
    },
  }
}
