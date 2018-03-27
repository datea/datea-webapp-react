import './content-bar-detail.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {inject, observer} from 'mobx-react';
import BackArrowIcon from 'material-ui-icons/ArrowBack';
import ButtonBase from 'material-ui/ButtonBase';
import DatearBtn from '../../datear-btn';
import {Tr} from '../../../i18n';

@observer
export default class ContentBarDetail extends Component {

  static propTypes = {
    campaign : PropTypes.object,
    mode : PropTypes.string,
    onBackClick : PropTypes.func
  };

  render() {
    const {campaign, mode, onBackClick, isMobile} = this.props;
    return (
        <div className={cn('campaign-content-bar-detail', `mode-${mode}`, isMobile && 'mobile')}>
          <div className="center-content">
            <ButtonBase onClick={onBackClick} className="go-back-btn">
              <div className="back-icon">
                <BackArrowIcon />
              </div>
              <div className="campaign-ht">
                {'#'+campaign.main_tag.tag}
              </div>
            </ButtonBase>
          </div>
          <div className="datear-btn-container">
            <DatearBtn />
          </div>
        </div>
    );
  }
}
