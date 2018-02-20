import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import ImageField from '../../image-field';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';

@inject('store')
@translatable
@observer
export default class ProfileForm extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false,
      errorMsg  : false
    }
  }

  /* EVENT HANDLERS */
  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  notifyFormError = (e) => console.log('form error', e);
  resetError = () => this.setState({errorMsg: false});

  submit = () => this.props.store.user.save(this.refs.profileForm.getModel())
  //submit = () => console.log(this.refs.profileForm.getModel())

  saveNewAvatar = (imgRes) => this.props.store.user.save({image: imgRes});
  saveNewUserBg = (imgRes) => this.props.store.user.save({bg_image: imgRes});

  blurTextInputs = () => {
    let fis = document.querySelectorAll('.form-field input').forEach(f => f.blur())
  };

  render() {
    const {store: {user}} = this.props;
    return (
      <div className="settings-tab-content profile-tab">

        {this.state.errorMsg &&
          <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>}

        <Formsy.Form ref="profileForm"
          onValid={this.enableSubmit}
          onInvalid={this.disableSubmit}
          onChange={this.resetError}
          onValidSubmit={this.submit}
          onInvalidSubmit={this.notifyFormError} >

            <div className="input-row img-row avatar-row">
              <div className="img-label">{t('SETTINGS_PAGE.AVATAR_LABEL')}</div>
              <ImageField
                onUploadSuccess={this.saveNewAvatar}
                src={user.data.image_large}
                imgType="avatar"
                iconSize={120}
                />
            </div>

            <div className="input-row img-row bg-img-row">
              <div className="img-label">{t('SETTINGS_PAGE.BG_LABEL')}</div>
              <ImageField
                onUploadSuccess={this.saveNewUserBg}
                src={user.data.bg_image}
                />
            </div>


            <div className="input-row">
              <FormsyText
                name="full_name"
                value={user.data.full_name}
                className="fullname-field form-field"
                floatingLabelText={t('SETTINGS_PAGE.NAME_LABEL')}
                />
            </div>

            <div className="input-row">
              <FormsyText
                name="url"
                value={user.data.url}
                className="url-field form-field"
                floatingLabelText={t('SETTINGS_PAGE.URL_LABEL')}
                validations="isUrl" />
            </div>

            <div className="info-row">{t('SETTINGS_PAGE.FOLLOW_FIELDS_TITLE')}</div>

            <div className="input-row">
              <FormsyText
                name="url_facebook"
                value={user.data.url_facebook}
                className="url-fb-field form-field"
                floatingLabelText={t('SETTINGS_PAGE.FB_URL_LABEL')}
                validations="isUrl" />
            </div>

            <div className="input-row">
              <FormsyText
                name="url_twitter"
                value={user.data.url_twitter}
                className="url-tw-field form-field"
                floatingLabelText={t('SETTINGS_PAGE.TW_URL_LABEL')}
                validations="isUrl" />
            </div>

            <div className="input-row">
              <FormsyText
                name="url_youtube"
                value={user.data.url_youtube}
                className="url-yt-field form-field"
                floatingLabelText={t('SETTINGS_PAGE.YOUTUBE_URL_LABEL')}
                validations="isUrl" />
            </div>

            <div className="form-btns">
              <RaisedButton
                onMouseEnter={this.blurTextInputs}
                primary={true}
                type="submit"
                label={t('SAVE')}
                disabled={!this.state.canSubmit}
              />
            </div>
          </Formsy.Form>
      </div>
    )
  }
}
