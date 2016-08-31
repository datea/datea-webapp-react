import OAuthIO from 'oauthio-web';
import config from '../config';

// trick oauthio into using our own oauthd instance
OAuthIO.OAuth.initialize(config.oauthio.publicKey);
OAuthIO.OAuth.setOAuthdURL(config.oauthio.url);
let oaConfig = OAuthIO.Materia.getConfig();
oaConfig.oauthd_api = config.oauthio.api;

const OAuth = OAuthIO.OAuth;

export default OAuth;  
