import './content-bar-detail.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {inject, observer} from 'mobx-react';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';
import IconButton from 'material-ui/IconButton';
import ButtonBase from 'material-ui/ButtonBase';
import DatearBtn from '../../datear-btn';
import {Tr} from '../../../i18n';

@inject('store')
@observer
export default class ContentBarDetail extends Component {

  static propTypes = {
    campaign : PropTypes.object,
    store : PropTypes.object,
    mode : PropTypes.string
  };

  onClickNav = (direction) => {
    const dateos = this.props.store.dateo.data.dateos;
    const currentId = this.props.store.router.queryParams.dateo;
    // find current idx
    const dateoIds = dateos.keys();
    const idx = dateoIds.indexOf(String(currentId));
    let nextId;
    if (direction == 'next') {
      nextId = dateoIds.length > idx + 1 ? dateoIds[idx + 1] : dateoIds[0];
    } else {
      nextId = idx > 0 ? dateoIds[idx -1] : dateoIds[dateoIds.length - 1];
    }
    this.props.store.openDateo({dateo: nextId});
  }

  goBackToList = () => {
    this.props.store.closeDateo();
  }

  render() {
    const {campaign, mode} = this.props;
    return (
        <div className={cn('campaign-content-bar-detail', `mode-${mode}`)}>
          <div className="left-btn">
            <IconButton className="dateo-nav-btn" onClick={() => this.onClickNav('prev')}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <div className="center-content">
            <ButtonBase onClick={this.goBackToList} className="go-back-btn">
              <div className="campaign-ht">
                {'#'+campaign.main_tag.tag}
              </div>
              <div className="back-hint-holder">
                {'['}<Tr id="BACK" />{']'}
              </div>
            </ButtonBase>
          </div>
          <div className="right-btn">
            <IconButton className="dateo-nav-btn"  onClick={() => this.onClickNav('next')}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          {/*
          <div className="datear-btn-container">
            <DatearBtn />
          </div>*/}
        </div>
    );
  }
}
