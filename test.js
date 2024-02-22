const { Fernet } = require('fernet-nodejs');
const OAuthClient = require('intuit-oauth')

const oauthClient = new OAuthClient({
  clientId: "ABYs9K7nNAyIydfyQqccsA0bh0zuygGDh87S8E3BBmHiyo5bSX",
  clientSecret: "GI6NVRaFZQJ2mWwWDVwdS95xtfhHDfoEoe96LoCt",
  environment: "sandbox",
  redirectUri: "http://localhost:3001/v2/quickbooks/permissions/granted",
});

function getAuthUri() {
  const token = Fernet.encrypt(JSON.stringify({org_id: "33", user_id: "332"}), "fwHDeF02TCfW8ljjVgLGveSBJT4FhUtrnz7wEn7L_C4=");
  const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
      state: token,
  
  });
  return authUri;
}

console.log(getAuthUri())