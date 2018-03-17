import {observable, action, autorun, computed, runInAction} from 'mobx';
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
      !!showLoading && this.main.ui.setLoading(false);
      this.data.dateos.replace(reduceIntoObjById(res.objects));
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

  //dateoQueryRun = autorun(() => this.getDateos(this.data.queryParams));

  @action clearDateos = () => this.data.dateos.clear();
  @action clearDetail = () => this.data.detail = {};
}
