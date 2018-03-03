import React from 'react';
import Button from 'material-ui/Button';
import Formsy from 'formsy-react';
import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';

@inject('store')
@translatable
@observer
export default class ProfileForm extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMsg  : false
    }
  }

  resetError = () => this.setState({errorMsg: false});

  submit = () => {
    let model = this.refs.notifySettingsForm.getModel();
    const {user} = this.props.store;
    model.notify_settings.id = user.data.notify_settings.id;
    user.save(model);
  }

  render() {
    const {user} = this.props.store;
    return (
      <div className="settings-tab-content notifications-tab">

        {this.state.errorMsg &&
          <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>}

        <Formsy ref="notifySettingsForm"
          onChange={this.resetError}
          onValidSubmit={this.submit}
          >

            <div className="info-row">{t('SETTINGS_PAGE.NOTIFY.DESC')}</div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.interaction"
                value={user.data.notify_settings.interaction}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.MY_CONTENT')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.conversations"
                value={user.data.notify_settings.conversations}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.THREADS')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.tags_dateos"
                value={user.data.notify_settings.tags_dateos}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.DATEOS_IN_TAGS')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.tags_reports"
                value={user.data.notify_settings.tags_reports}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.CAMPAIGN_MSG')}
                />
            </div>

            <div className="checkbox-row">
              <FormsyCheckbox
                name="notify_settings.site_news"
                value={user.data.notify_settings.site_news}
                className="form-checkbox"
                label={t('SETTINGS_PAGE.NOTIFY.NEWSLETTER')}
                />
            </div>

            <div className="form-btns">
              <Button variant="raised"
                color="primary"
                type="submit"
              >{t('SAVE')}</Button>
            </div>
          </Formsy>
      </div>
    )
  }
}
