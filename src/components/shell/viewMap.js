import React from 'react';

/* VIEWS */
import Home from '../home';
import Landing from '../landing';
import Error404 from '../error/error-404';
import LoginPage from '../account/login-page';
import RegisterPage from '../account/register-page';
import RegisterFormPage from '../account/register-form-page';
import RecoverPasswordPage from '../account/recover-password-page';
import RecoverPasswordConfirmPage from '../account/recover-password-confirm-page';
import ActivationPage from '../account/activation-page';
import AccountSettings from '../account/settings';
import Profile from '../profile';
import CampaignView from '../campaign-view';
import CampaignManagerView from '../campaign-manager-view';
import StaticPage from '../static-page';
import SearchMappingView from '../search-mapping-view';

export default {
  home : <Home />,
  welcome : <Landing />,
  search : <SearchMappingView />,
  info : <StaticPage />,
  login : <LoginPage />,
  register : <RegisterPage />,
  registerFormPage : <RegisterFormPage />,
  activate: <ActivationPage />,
  recoverPass : <RecoverPasswordPage />,
  recoverPassConfirm : <RecoverPasswordConfirmPage />,
  settings : <AccountSettings />,
  campaignForm : <CampaignManagerView />,
  profile : <Profile />,
  campaign : <CampaignView />,
  notFound : <Error404 errorId="NOT_FOUND" />
};
