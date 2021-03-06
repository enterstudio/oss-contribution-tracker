/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';

import ErrorModal from '../components/ErrorModal';
import { setGeneralError } from '../modules/common';

import ExtensionPoint from '../util/ExtensionPoint';

import Admin from './Admin';
import Approvals from './Approvals';
import Contributions from './Contributions';
import EditCLA from './EditCla';
import EditContribution from './EditContribution';
import Employee from'./Employee';
import GithubLinkUpdater from './GithubLinkUpdater';
import List from './List';
import Metrics from './Metrics';

interface Props {
  children: any;
  dispatch: any;
  generalError: any;
}

interface State {
  user: {
    name: string;
    groups: string;
    ossApproved: boolean;
  };
}


export class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: {
          name: '',
          groups: '',
          ossApproved: false,
        },
    };
  };

  dismissError = () => {
    const { dispatch } = this.props;
    dispatch(setGeneralError(null));
  }

  mapError = (err) => {
    let dismissError = this.dismissError.bind(this);

    if (err.code === 403) {
      return (<ErrorModal
        message={err.message}
        onDismiss={dismissError}
        title="You might not have access to this resource"
        explain="If you think you need access to this item, contact your administrators."
      />);
    }
    return (<ErrorModal
      message={err.message}
      onDismiss={dismissError}
      title="Something went wrong"
      explain="Please try that again."
    />);
  }


  render() {
    const { generalError } = this.props;
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <ExtensionPoint ext="navbar-logo">
            <Link to="/" className="navbar-brand">OSS Contribution Tracker</Link>
          </ExtensionPoint>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/admin" className="nav-link">Admin</Link>
              </li>
              <li className="nav-item">
                <Link to="/contribute" className="nav-link">New Contribution</Link>
              </li>
              <li className="nav-item">
                <Link to="/list" className="nav-link">Contributions By Project</Link>
              </li>
              <li className="nav-item">
                <Link to="/employee" className="nav-link">Contributions By User</Link>
              </li>
              <li className="nav-item">
                <a target="_blank" href="https://github.com/amzn/oss-contribution-tracker/issues" className="nav-link">
                  <i className="fa fa-question-circle" /> Help
                </a>
              </li>
            </ul>
            <ExtensionPoint ext="navbar-end" />
          </div>
        </nav>

        { generalError != null ? this.mapError(generalError) : '' }

        <div className="container-fluid mt-4">
          <div className="row">
            <div className="mx-auto col-lg-10">
              <Switch>
                <Route exact path="/" component={Metrics} />
                <Route exact path="/employee" component={Employee} />
                <Route exact path="/list" component={List} />
                <Route exact path="/admin" component={Admin} />
                <Route path="/cla/:project_id" component={EditCLA} />
                <Route exact path="/contribute" component={Contributions} />
                <Route path="/approvals/:contrib_id" component={Approvals} />
                <Route path="/contribution/:contrib_id" component={EditContribution} />
                <Route exact path="/metrics" component={Metrics} />
                <Route exact path="/contribute/link" component={GithubLinkUpdater} />
              </Switch>
            </div>
          </div>

          <div className="row mt-4">
            <div className="mx-auto col-lg-11">
              <hr/>
              <ExtensionPoint ext="footer" />
            </div>
          </div>
        </div>
      </div>

    );
  }

}

export default connect((state: { common: any }) => state.common)(App);