import fetch from './fetch';
import config from '../config';

/*****************************
  ACOOUNT VALIDATION HELPERS
******************************/

export function emailExists(email) {
  return fetch.get(config.api.url+'account/email-exists', {email});
}

export function usernameExists(username) {
  return fetch.get(config.api.url+'account/username-exists', {username});
}
