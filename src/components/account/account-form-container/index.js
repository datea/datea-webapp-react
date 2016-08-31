import React from 'react';
import Paper from 'material-ui/Paper';

const AccountFormContainer = ({children}) =>
  <div className="account-form-container">
    <div className="row center-xs">
      <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6">
        <Paper className="account-paper">
          {children}
        </Paper>
      </div>
    </div>
  </div>

export default AccountFormContainer;
