import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';
import {observer} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import USER from '../../../stores/user';
import UI from '../../../stores/ui';

@translatable
@observer
export default class ProfileForm extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMsg  : false
    }
  }

  resetError = () => this.setState({errorMsg: false});

  submit = () => {
    let model = this.refs.notifySettingsForm.getModel();
    model.notify_settings.id = USER.data.notify_settings.id;
    USER.save(model);
  }

  render() {
    return (
      <div className="settings-tab-content notifications-tab">

        {this.state.errorMsg &&
          <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>}

        <Formsy.Form ref="notifySettingsForm"
          onChange={this.resetError}
          onValidSubmit={this.submit}
          >

            <div className="info-row">{t('SETTINGS_PAGE.NOTIFY.DESC')}</div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.interaction"
                value={USER.data.notify_settings.interaction}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.MY_CONTENT')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.conversations"
                value={USER.data.notify_settings.conversations}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.THREADS')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.tags_dateos"
                value={USER.data.notify_settings.tags_dateos}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.DATEOS_IN_TAGS')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.tags_reports"
                value={USER.data.notify_settings.tags_reports}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.CAMPAIGN_MSG')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.site_news"
                value={USER.data.notify_settings.site_news}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.NEWSLETTER')}
                />
            </div>

            <div className="form-btns">
              <RaisedButton
                primary={true}
                type="submit"
                label={t('SAVE')}
              />
            </div>
          </Formsy.Form>
      </div>
    )
  }
}
