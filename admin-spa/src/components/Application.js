import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ProfilePage from "../pages/ProfilePage";
import PasswordReset from "../pages/PasswordReset";
import UserContext from "../context/UserContext";
import Dashboard from "../pages/Dashboard";
import PasswordChange from "../pages/PasswordChange";
import Messages from "../pages/Messages";
import Posts from "../pages/Posts";
import Pages from "../pages/Pages";
import Events from "../pages/Events";
import LoggedLayout from "../containers/LoggedLayout";
import Clients from "../pages/Clients";
import EditClient from "../pages/clients/EditClient";
import CreateClient from "../pages/clients/CreateClient";
import Users from "../pages/Users";
import EditUser from "../pages/user/EditUser";
import CreateUser from "../pages/user/CreateUser";
import EditPage from "../pages/page/Edit";
import CreatePage from "../pages/page/Create";
import EditPost from "../pages/post/Edit";
import CreatePost from "../pages/post/Create";
import EditEvent from "../pages/event/Edit";
import CreateEvent from "../pages/event/Create";
function Application() {
  const user = useContext(UserContext);

  return user ? (
    <LoggedLayout>
      <Router>
        <ProfilePage path="/app/me" />
        <PasswordChange path="/app/passwordChange" />
        <Messages path="/app/messages" />
        <Posts path="/app/posts" />
        <EditPost path="/app/posts/:uid" />
        <CreatePost path="/app/posts/create" />
        <Pages path="/app/pages" />
        <EditPage path="/app/pages/:uid" />
        <CreatePage path="/app/pages/create" />
        <Events path="/app/events" />
        <EditEvent path="/app/events/:uid" />
        <CreateEvent path="/app/events/create" />
        <Clients path="/app/clients" />
        <EditClient path="/app/clients/:uid" />
        <CreateClient path="/app/clients/create" />
        <Dashboard path="/app/dashboard" />
        <Users path="/app/users" />
        <EditUser path="/app/users/:uid" />
        <CreateUser path="/app/users/create" />
        <Redirect from="*" to="/app/dashboard" noThrow />
      </Router>
    </LoggedLayout>
  ) : (
    <Router>
      <SignIn path="/" />
      <SignUp path="signUp" />
      <PasswordReset path="passwordReset" />
      <Redirect from="*" to="/" noThrow />
    </Router>
  );
}
export default Application;
