
export function reduceIntoObjById (array) {
  return array.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}
