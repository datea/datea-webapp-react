import React from 'react';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {observer, inject} from 'mobx-react';
import {Tr} from '../../../i18n';

const NotificationsTab = ({store}) => {
  const form = store.settingsView;
  return (
    <div className="settings-tab-content notifications-tab">

      {form.error.has('main') &&
        <div className="error-msg"><Tr id={form.error.get('main')} /></div>
      }

      <div className="form">

        <div className="info-row left"><Tr id="SETTINGS_PAGE.NOTIFY.DESC" /></div>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color="default"
                checked={form.user.notify_settings.interaction}
                onChange={ev => form.setNotify('interaction', ev.target.checked)}
              />
            }
            label={<Tr id="SETTINGS_PAGE.NOTIFY.MY_CONTENT" />}
          />

          <FormControlLabel
            control={
              <Switch
                color="default"
                checked={form.user.notify_settings.conversations}
                onChange={ev => form.setNotify('conversations', ev.target.checked)}
              />
            }
            label={<Tr id="SETTINGS_PAGE.NOTIFY.THREADS" />}
          />

          <FormControlLabel
            control={
              <Switch
                color="default"
                checked={form.user.notify_settings.tags_dateos}
                onChange={ev => form.setNotify('tags_dateos', ev.target.checked)}
              />
            }
            label={<Tr id="SETTINGS_PAGE.NOTIFY.DATEOS_IN_TAGS" />}
          />

          <FormControlLabel
            control={
              <Switch
                color="default"
                checked={form.user.notify_settings.tags_reports}
                onChange={ev => form.setNotify('tags_reports', ev.target.checked)}
              />
            }
            label={<Tr id="SETTINGS_PAGE.NOTIFY.CAMPAIGN_MSG" />}
          />

          <FormControlLabel
            control={
              <Switch
                color="default"
                checked={form.user.notify_settings.site_news}
                onChange={ev => form.setNotify('site_news', ev.target.checked)}
              />
            }
            label={<Tr id="SETTINGS_PAGE.NOTIFY.NEWSLETTER" />}
          />
        </FormGroup>

        <div className="form-btns">
          <Button variant="raised"
            onClick={form.submit}
            color="primary"
            type="submit">
            <Tr id="SAVE" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default inject('store')(observer(NotificationsTab))
