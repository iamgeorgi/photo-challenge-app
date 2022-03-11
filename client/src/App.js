import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ContestsPhaseOne from './containers/Contests/ContestsPhaseOne.js';
import ContestsPhaseTwo from './containers/Contests/ContestsPhaseTwo.js';
import ContestsFinished from './containers/Contests/ContestsFinished.js';
import UserContests from './containers/Contests/UserContests.js';
import NotFound from './components/NotFound/NotFound.js';
import Layout from './components/Layout/Layout';
import AuthContext from './custom-hooks/authContext.js';
import decode from 'jwt-decode';
import PublicApp from './components/PublicApp';
import { getToken } from './common/token-handlers.js';
import ContestPhaseOne from './containers/Contest/ContestPhaseOne.js';
import ContestPhaseTwo from './containers/Contest/ContestPhaseTwo.js';
import ContestFinished from './containers/Contest/ContestFinished.js';
import Users from './containers/Users/Users.js';
import CreateContest from './containers/CreateContest/CreateContest.js';

const App = () => {
    const token = getToken();
    const [user, setUser] = useState(token
        ? decode(token)
        : null);

    return (
        <BrowserRouter>
            <AuthContext.Provider value={{ user: user, setUser: setUser }}>
                <div className="App">
                    <Layout>
                        {user
                            ?
                            <Switch>
                                <Route path="/contests/phaseone" exact component={ContestsPhaseOne} />
                                <Route path="/contests/phaseone/:id" component={ContestPhaseOne} />
                                <Route path="/contests/phasetwo" exact component={ContestsPhaseTwo} />
                                <Route path="/contests/phasetwo/:id" component={ContestPhaseTwo} />
                                <Route path="/contests/finished" exact component={ContestsFinished} />
                                <Route path="/contests/finished/:id" component={ContestFinished} />
                                <Route path="/contests/usercontests" exact component={UserContests} />
                                <Route path="/contests/create" exact component={CreateContest} />
                                <Route path="/users" exact component={Users} />
                                <Route path="*" component={NotFound} />
                            </Switch>
                            :
                            <PublicApp />}
                    </Layout>
                </div>
            </AuthContext.Provider>
        </BrowserRouter>
    );
}

export default App;
