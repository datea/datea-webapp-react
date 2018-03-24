import _ from 'lodash';

export default function cleanObject(obj) {
  return _.pickBy(obj, f => !!f && (!Array.isArray(f) || !!f.length));
}
