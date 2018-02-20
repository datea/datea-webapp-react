import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import validations from 'formsy-react/src/validationRules';
import {emailExists, usernameExists} from '../../../utils';
import Dialog from 'material-ui/Dialog';
import DIcon from '../../../icons';
import config from '../../../config';

const minUnameL = config.validation.username.minLength;
const maxUnameL = config.validation.username.maxLength;

@inject('store')
@observer
export default class AccountTab extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMsg : '',
      canSubmit : false,
      showChangePassword : false,
      emailDialogOpen : false
    }
  }

  /* EVENT HANDLERS */
  toggleShowPassword = () => this.setState({showChangePassword : !this.state.showChangePassword});
  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  notifyFormError = (e) => console.log('form error', e);
  onFormChange = () => this.setState({error: false});
  blurTextInputs = () => {
    let fis = document.querySelectorAll('.form-field input').forEach(f => f.blur())
  };

  submit = (warnEmailChange = false) => {
    this.setState({emailDialogOpen: false});
    let model = this.refs.accountForm.getModel();
    if ('password' in model) {
      delete model.passwordConfirm;
    }
    if (warnEmailChange && model.email != USER.data.email) {
      this.setState({emailDialogOpen: true});
    } else {
      this.props.store.user.save(model)
      .catch(err => this.setState({errorMsg: t('ERROR.UNKNOWN')}));
    }
  }

  validateEmailOnServer = (ev) => {
    const mail = ev.currentTarget.value;
    if (validations.isEmail([], mail) && mail !== this.props.store.user.data.email) {
      emailExists(mail)
      .then(res => {
        res.body.result && this.refs.accountForm.updateInputsWithError({
          email : t('ACCOUNT_MSG.EMAIL_EXISTS')
        });
      });
    }
  }

  validateUsernameOnServer = (ev) => {
    const uname = ev.currentTarget.value;
    if (validations.isAlphanumeric([], uname)
      && uname !== this.props.store.user.data.username
      && uname.length >= minUnameL
      && uname.length < maxUnameL) {
        usernameExists(uname)
        .then(res => {
          res.body.result && this.refs.accountForm.updateInputsWithError({
            username : t('ACCOUNT_MSG.DUPLICATE_USER')
          });
        });
    }
  }

  dialogActions = () => {
    return [
      <FlatButton
        label={t('CANCEL')}
        primary={true}
        onTouchTap={() => this.setState({emailDialogOpen: false})}
      />,
      <FlatButton
        label={t('SETTINGS_PAGE.CHANGE_EMAIL_PROCEED')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => this.submit()}
      />,
    ];
  }

  render() {
    const {store: {user}} = this.props;
    return (
      <div className="settings-tab-content account-tab">

        {!!this.state.errorMsg &&
          <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>
        }

        <Dialog open={this.state.emailDialogOpen}
          title={
            <span className="dialog-title">
              <DIcon name="daterito4"/>
              {t('SETTINGS_PAGE.CHANGE_EMAIL_WARNING_TITLE')}
            </span>
          }
          titleStyle={{fontSize: '1.3rem'}}
          className="account-dialog"
          actions={this.dialogActions()}
          onRequestClose={() => this.setState({emailDialogOpen: false})}
          >{t('SETTINGS_PAGE.CHANGE_EMAIL_WARNING')}</Dialog>

        <Formsy.Form ref="accountForm"
          onValid={this.enableSubmit}
          onInvalid={this.disableSubmit}
          onValidSubmit={() => this.submit(true)}
          onChange={this.onFormChange} >

          <div className="input-row">
            <FormsyText
              name="username"
              required
              value={user.data.username}
              className="username-field form-field"
              onBlur={this.validateUsernameOnServer}
              floatingLabelText={t('REGISTER_FORM_PAGE.USERNAME_LABEL')}
              validations={'isAlphanumeric,minLength:'+minUnameL+',maxLength:'+maxUnameL}
              validationErrors={{
                isAlphanumeric : t('REGISTER_FORM_PAGE.USERNAME_ALPHANUM'),
                minLength: t('REGISTER_FORM_PAGE.USERNAME_LENGTH'),
                maxLength: t('REGISTER_FORM_PAGE.USERNAME_LENGTH'),
              }} />
          </div>

          <div className="input-row">
            <FormsyText
              name="email"
              required
              value={user.data.email}
              onBlur={this.validateEmailOnServer}
              className="email-field form-field"
              floatingLabelText={t('REGISTER_FORM_PAGE.EMAIL_LABEL')}
              validations="isEmail"
              validationErrors={{isEmail : t('ACCOUNT_MSG.EMAIL_INVALID')}}
              />
          </div>

          <div className="show-pass-container">
            <FlatButton
              labelStyle={{color: "#888", fontWeight: 300, textTransform: 'none', paddingLeft:0, paddingRight:0}}
              label={t('SETTINGS_PAGE.'+(this.state.showChangePassword ? 'HIDE' : 'SHOW')+'_CHANGE_PASSWORD')}
              hoverColor="transparent"
              onTouchTap={this.toggleShowPassword}
              />
          </div>

          {this.state.showChangePassword &&
            <div>
              <div className="input-row">
                <FormsyText
                  name="password"
                  type="password"
                  className="password-field form-field"
                  floatingLabelText={t('SETTINGS_PAGE.NEW_PASSWORD')}
                  validations={{matchRegexp: config.validation.password.regex}}
                  validationErrors={{matchRegexp : t('REGISTER_FORM_PAGE.PASS_DESC')}}
                  />
              </div>

              <div className="input-row">
                <FormsyText
                  name="passwordConfirm"
                  type="password"
                  className="password-confirm-field form-field"
                  floatingLabelText={t('REGISTER_FORM_PAGE.REPEAT_PASS')}
                  validations="equalsField:password"
                  validationErrors={{equalsField : t('REGISTER_FORM_PAGE.PASS_REPEAT_ERROR')}}
                  />
              </div>
            </div>
          }

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
    );
  }
}
