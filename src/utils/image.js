import urlJoin from 'url-join';
import config from '../config';

export function getImgSrc(path) {
  if (path.indexOf('http') != 0) {
    return urlJoin(config.api.imgUrl, path);
  }else{
    return path;
  }
}
