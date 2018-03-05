import './dropzone-controls.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import {Tr} from '../../../i18n';
import DropzoneButton from '../dropzone-button';

/*
dragging : false,
uploading : false,
progress  : 0,
errorMsg  : null,
uploadingType : 'image',
acceptTypes : ['image']
*/

@inject('store')
@observer
export default class DropzoneControl extends Component {

  static contextTypes = {
    dropzoneState: MobxPropTypes.observableObject,
    dropzoneActions : PropTypes.object,
    dropzoneTypes : PropTypes.array
  };

  render() {
    const {dropzoneState: state, dropzoneActions, dropzoneTypes} = this.context;

    const classes = cn(
      'dropzone-control',
      state.dragging && 'dragging',
    );

    return (
      <div className={classes}>
        <div className="dropzone-buttons">
          {state.acceptTypes.map( type =>
            <DropzoneButton
              key={type}
              onClick={() => dropzoneActions.openDialog(type)}
              uploading={state.uploading && state.uploadingType == type}
              progress={state.progress}
              type={type} />
          )}
        </div>

        <div className="dragging-msg">
          <Tr id={'FILEINPUT.DRAG_OVER_MSG'} />
        </div>

        {!!state.errorMsg && !state.dragging &&
          <div className="error-msg">{state.errorMsg}</div>
        }
      </div>
    );
  }
}
