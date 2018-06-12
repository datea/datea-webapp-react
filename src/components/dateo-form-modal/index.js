import './dateo-form-modal.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import Slide from 'material-ui/transitions/Slide';
import DateaAppBar from '../app-bar';
import {Tr} from '../../i18n';
import DateoForm from '../dateo-form';

const Transition = (props) => <Slide direction="up" {...props} />;

@inject('store')
@observer
export default class DatearDialog extends Component {

  static propTypes = {
    store: PropTypes.object,
  };

  handleClose = () => this.props.store.cancelDateoForm();
  saveDateo = () => this.props.store.dateoForm.save();
  closeMap = () => this.props.store.dateoForm.setLayout('content');

  render() {
    const {store} = this.props;
    const {ui, dateoForm} = store;
    const layoutMode = !!dateoForm ? dateoForm.layoutMode : 'content';

    const isOpen = store.datearMode != 'closed';

    return (
      <div>
        <Dialog
          fullScreen
          className={cn('datear-dialog',ui.isMobile ? 'mobile' : 'normal')}
          PaperProps={{className: 'datear-dialog-paper'}}
          open={isOpen}
          onClose={this.handleClose}
          transition={Transition}>
            <div className={cn('datea-form-modal',ui.isMobile ? 'mobile' : 'normal')}>
              <DateaAppBar position="static" colorName="greyLight">
                {layoutMode == 'content'
                  ? <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                      <CloseIcon />
                    </IconButton>
                  : <IconButton color="inherit" onClick={this.closeMap} aria-label="Back">
                      <ChevronLeft className="header-back-btn-icon" />
                    </IconButton>
                }
                <Typography variant="title" color="inherit" className="datear-app-bar-title">
                  <div className="title-content">
                    <Tr id="DATEAR.DATEAR" />
                  </div>
                </Typography>
                {layoutMode == 'content' &&
                  <Button color="inherit" onClick={this.saveDateo}>
                    <Tr id="SAVE" />
                  </Button>
                }
              </DateaAppBar>
              <div className="map-layout-form-container">
                <DateoForm />
              </div>
            </div>
          </Dialog>
      </div>
    );
  }
}
