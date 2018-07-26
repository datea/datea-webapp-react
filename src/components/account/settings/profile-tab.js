import React from 'react';
import {toJS} from 'mobx';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ImageField from '../../image-field';
import {observer, inject} from 'mobx-react';
import {Tr} from '../../../i18n';

@inject('store')
@observer
export default class ProfileForm extends React.Component {

  renderErrorTxt = (field) => {
    const error = this.props.store.settingsView.error;
    return error.has(field) ? <Tr id={error.get(field)} /> : '';
  }

  render() {
    const form = this.props.store.settingsView;

    console.log('user', toJS(form.user));

    return (
      <div className="settings-tab-content profile-tab">

        {form.error.has('main') &&
          <div className="error-msg"><Tr id={form.error.get('main')} /></div>
        }

        <div className="form">

            <div className="input-row img-row avatar-row">
              <div className="img-label"><Tr id="SETTINGS_PAGE.AVATAR_LABEL" /></div>
              <ImageField
                onUploadSuccess={form.setImage}
                src={form.user.image_large}
                imgType="avatar"
                iconSize={120}
                />
            </div>

            <div className="input-row img-row bg-img-row">
              <div className="img-label"><Tr id="SETTINGS_PAGE.BG_LABEL" /></div>
              <ImageField
                onUploadSuccess={form.setBgImage}
                src={form.user.bg_image}
                />
            </div>

            <div className="input-row">
              <TextField
                name="full_name"
                value={form.user.full_name || ''}
                onChange={ev => form.setFullName(ev.target.value)}
                className="fullname-field form-field"
                fullWidth={true}
                label={<Tr id="SETTINGS_PAGE.NAME_LABEL" />}
                />
            </div>

            <div className="input-row">
              <TextField
                name="url"
                value={form.user.url || ''}
                onChange={ev => form.setUrl(ev.target.value)}
                className="url-field form-field"
                fullWidth={true}
                label={<Tr id="SETTINGS_PAGE.URL_LABEL" />}
                error={form.error.has('url')}
                helperText={this.renderErrorTxt('url')}
                />
            </div>

            <div className="form-btns">
              <Button variant="raised"
                onClick={form.submit}
                color="primary"
                type="submit"
                disabled={!form.isValid}>
                <Tr id="SAVE" />
              </Button>
            </div>
          </div>
      </div>
    )
  }
}
