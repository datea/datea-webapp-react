import React from 'react';
import Dateo from './index.js';
import {observer, inject} from 'mobx-react';

@inject('store')
@observer
export default class TestDateo extends React.Component {

  componentWillMount() {
    this.props.store.data.getDateoDetail(3844)
  }

  render() {
    const {store: {data}} = this.props;
    return (
      <div className="test-dateo">
        {!data.dateoDetail && <div>Loading...</div>}
        {!!data.dateoDetail && <Dateo dateo={data.dateoDetail} />}
      </div>
    )
  }
}
