const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
const getObjectKeys = obj => (isObject(obj) ? Object.keys(obj) : []);

const viewsForDirector = (views, store) =>
    getObjectKeys(views).reduce((obj, viewKey) => {
        const view = views[viewKey];
        obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
        return obj;
    }, {});

const getRegexMatches = (string, regexExpression, callback) => {
    let match;
    while ((match = regexExpression.exec(string)) !== null) {
        callback(match);
    }
};

export {isObject, getObjectKeys, viewsForDirector, getRegexMatches};
