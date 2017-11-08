module.exports = {
  twitter: {
    requestUrl: 'https://api.twitter.com/oauth/request_token',
    authorizeUrl: 'https://api.twitter.com/oauth/authorize',
    accessUrl: 'https://api.twitter.com/oauth/access_token',
    userUrl: 'https://api.twitter.com/1.1/account/verify_credentials.json',
    apiKey: '8aHiqcxwfu30CQKyxdR79iEfQ',
    apiSecret: 'COsivqmbaOgkb9tIiDlEkBqLKhF2PoJUhpe2HVKu8Q2opiIbZX',
    version: '1.0',
    signatureMethod: 'HMAC-SHA1',
  },
  youtube: {
    apiUrl: 'https://www.googleapis.com',
    accessTokenPath: '/oauth2/v4/token',
    usersUrl: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
    clientId: '643806121748-0fsie6jbn04v5hun7p8r3c9jkksap8po.apps.googleusercontent.com',
    clientSecret: 'nu3NKm3IX1wrShcL5-AasgLH',
  },
};
