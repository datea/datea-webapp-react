import {observable, action, autorun, computed, runInAction, wait} from 'mobx';
import Api from '../rest-api';
import {reduceIntoObjById} from '../../utils';


export default class DateoStore {

  @observable data = {
    dateos : new Map(),
    detail : null,
    queryParams : {}
  };

  constructor(main) {
    this.main = main;
  }

  @action query(params = {}, showLoading = true) {
    params = {...params, showLoading};
    this.data.queryParams = params;
  }

  @action getDateos = (params = {}, showLoading = false) => new Promise ((resolve, reject) => {
    !!showLoading && this.main.ui.setLoading(true);
    Api.dateo.getList(params)
    .then(res => runInAction(() => {
      console.log(res);
      !!showLoading && this.main.ui.setLoading(false);
      this.data.dateos.replace(res.objects.map( d => [d.id, d]));
      resolve(this.data.dateos);
    }))
    .catch((err) => {
      !!showLoading && this.main.ui.setLoading(false);
      reject(err)
    });
  })

  @action getDateoDetail(id, opts = {forceUpdate: true, showLoading: true}) {
    if (!opts.forceUpdate && this.data.dateos.has(id)) {
      this.data.detail = this.data.dateos.get(id);
    } else {
      !!opts.showLoading && this.main.ui.setLoading(true);
      Api.dateo.getDetail(id)
      .then(res => runInAction(() => {
        opts.showLoading && this.main.ui.setLoading(false);
        this.data.detail = res;
      }))
      .catch((err) => console.log(err));
    }
  }

  @action clearDateos = () => this.data.dateos.clear();
  @action clearDetail = () => this.data.detail = {};


  @action setMetaData = async (dateo, url) => {

    const setFunc = (dateo) => {
      this.main.metaData.set({
        title : {
          id: 'METADATA.DATEO.TITLE',
          params: {
            username : dateo.user.username,
            extract : dateo.extract
          }
        },
        description : {
          id: 'METADATA.DATEO.DESCRIPTION',
          params : {
            username : dateo.user.username,
            extract : dateo.extract
          }
        },
        imgUrl : !!dateo.images && !!dateo.images.length && dateo.images[0].image,
        url : url || '/dateo/'+dateo.id
      })
    };

    if (typeof(dateo) == 'object') {
      setFunc(dateo);
    } else {
      wait(() => !this.main.ui.loading, () => {
        setTimeout(() => {
          let dateo = this.data.dateos.get(String(dateo));
          if (dateo) {
            setFunc(dateo);
          }
        })
      });
    }
  }
}
