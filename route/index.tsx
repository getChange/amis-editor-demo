import React from 'react';
import { ToastComponent, AlertComponent, Spinner } from 'amis';
import { Route, Switch, Redirect, HashRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IMainStore } from '../store/IMainStore';

const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));
const Login = React.lazy(() => import('../Login/Login'));

export default observer(function ({store}: {store: IMainStore}) {
    return (
        <Router>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} theme="cxd" />
                <AlertComponent key="alert" theme="cxd" />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        <Redirect to={`/hello-world`} from={`/`} exact />
                        <Route path="/edit/:id" component={Editor} />
												<Route path="/login" component={Login} />
                        <Route component={Preview} />
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
});
