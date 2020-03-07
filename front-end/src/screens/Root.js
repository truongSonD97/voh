import React from 'react';
import { Route, Switch,Redirect} from 'react-router-dom'
import Home from './Home';
import Statistic from './Statistic/Statistic';
import Manage from './Manage/Manage';
import Editor from "../components/Edit/Editor";
import Insert from "../components/Insert/Insert";
import Read from "./Read/Read";
import NotFound from "./../components/NotFound/NotFound"


//check permission when user fill in domain 
const PrivateRoute = ({ role, allowRole = [], ...props }) => {
  if (allowRole.find(item => item === role)) {
    return <Route exact={true} {...props} />
  }
  else {
    return <Redirect to="/VohReport/home" />
  }
};

export default function Root(props) {

  return (
    <Switch>
      <Route path="/" exact component={Home} key="home_1" />

      <Route path="/VohReport/home" component={Home} key="home" />,
      <PrivateRoute
        role={props.user.role}
        allowRole={["ROLE_ADMIN", "ROLE_DATAENTRY","ROLE_DATAENTRY_EDITOR"]}
        path="/VohReport/insert"
        render={() => <Insert user={props.user} />} key="insert"
        handleCurrentPageChange={props.handleCurrentPageChange}/>,

      <PrivateRoute
        role={props.user.role}
        allowRole={["ROLE_ADMIN", "ROLE_EDITOR","ROLE_DATAENTRY_EDITOR"]}
        path="/VohReport/edit"
        render={() => <Editor user={props.user} />} key="edit"
        handleCurrentPageChange={props.handleCurrentPageChange}/>,

      <PrivateRoute
        role={props.user.role}
        allowRole={["ROLE_ADMIN", "ROLE_MC", "ROLE_EDITOR","ROLE_DATAENTRY_EDITOR"]}
        path="/VohReport/records"
        render={() => <Read user={props.user} />} key="read"
        handleCurrentPageChange={props.handleCurrentPageChange}/>,

      <PrivateRoute
        role={props.user.role}
        allowRole={["ROLE_ADMIN", "ROLE_EDITOR","ROLE_MC","ROLE_DATAENTRY_EDITOR"]}
        path="/VohReport/statistic"
        component={Statistic} key="statistic"
        handleCurrentPageChange={props.handleCurrentPageChange}/>,

      <PrivateRoute
        role={props.user.role}
        allowRole={["ROLE_ADMIN"]}
        path="/VohReport/admin"
        component={Manage} key="manage"
        handleCurrentPageChange={props.handleCurrentPageChange}/>,

      <Route render={() => <NotFound handleCurrentPageChange={props.handleCurrentPageChange}/> } />
    </Switch>
  )

}