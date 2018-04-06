import urlJoin from 'url-join';
import fetch from './fetch';
import config from '../config';


/*****************************
  ACOOUNT VALIDATION HELPERS
******************************/

export function emailExists(email) {
  return fetch.get(urlJoin(config.api.url, 'account/email-exists'), {email});
}

export function usernameExists(username) {
  return fetch.get(urlJoin(config.api.url, 'account/username-exists'), {username});
}
