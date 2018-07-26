import React from 'react';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import '../account.scss';

const AccountFormContainer = ({className, children}) =>
  <div className={classnames('account-form-container', className)}>
    <div className="row center-xs">
      <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6">
        <Paper className="account-paper" >
          {children}
        </Paper>
      </div>
    </div>
  </div>

export default AccountFormContainer;
