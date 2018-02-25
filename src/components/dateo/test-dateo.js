import React from 'react';
import DateoDetail from './index.js';
import {observer, inject} from 'mobx-react';

@inject('store')
@observer
export default class TestDateo extends React.Component {

  componentWillMount() {
    this.props.store.data.getDateoDetail(3844)
  }

  render() {
    const {data} = this.props.store;
    return (
      <div className="test-dateo">
        {!data.detail.dateo && <div>Loading...</div>}
        {!!data.detail.dateo && <DateoDetail dateo={data.detail.dateo} />}
      </div>
    )
  }
}
