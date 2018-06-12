import {observable, action, autorun, runInAction, when} from 'mobx';
import Api from '../rest-api';
import {reduceIntoObjById} from '../../utils';

export default class DateoStore {

  @observable dateos = new Map();

  constructor(main) {
    this.main = main;
  }

  @action getDateos = (params = {}, showLoading = false) => new Promise ((resolve, reject) => {
    !!showLoading && this.main.ui.setLoading(true);
    Api.dateo.getList(params)
    .then(res => runInAction(() => {
      !!showLoading && this.main.ui.setLoading(false);
      this.dateos.replace(res.objects.map( d => [d.id, d]));
      resolve(this.dateos);
    }))
    .catch((err) => {
      !!showLoading && this.main.ui.setLoading(false);
      reject(err)
    });
  })

  @action clearDateos = () => this.dateos.clear();

  @action setMetaData = async (dateo, url) => {
    const setFunc = (dateoObj) => {
      this.main.metaData.set({
        title : {
          id: 'METADATA.DATEO.TITLE',
          params: {
            username : dateoObj.user.username,
            extract : dateoObj.extract
          }
        },
        description : {
          id: 'METADATA.DATEO.DESCRIPTION',
          params : {
            username : dateoObj.user.username,
            extract : dateoObj.extract
          }
        },
        imgUrl : !!dateoObj.images && !!dateoObj.images.length && dateoObj.images[0].image,
        url : url || '/dateo/'+dateoObj.id
      })
    };

    if (typeof(dateo) == 'object') {
      setFunc(dateo);
    } else {
      when(() => !this.main.ui.loading, () => {
        setTimeout(() => {
          let dateoObj = this.dateos.get(dateo);
          if (dateoObj) {
            setFunc(dateoObj);
          } else {
            this.main.ui.show404();
          }
        });
      });
    }
  }
}
