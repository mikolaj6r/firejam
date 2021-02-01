import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import ProfilePage from "../views/ProfilePage";
import PasswordReset from "../views/PasswordReset";
import UserContext from "../context/UserContext";
import Dashboard from "../views/Dashboard";
import PasswordChange from "../views/PasswordChange";
import Messages from "../views/Messages";
import Posts from "../views/Posts";
import Pages from "../views/Pages";
import Events from "../views/Events";
import LoggedLayout from "../containers/LoggedLayout";
import Clients from "../views/Clients";
import EditClient from "../views/clients/EditClient";
import CreateClient from "../views/clients/CreateClient";
import Users from "../views/Users";
import EditUser from "../views/user/EditUser";
import CreateUser from "../views/user/CreateUser";
import EditPage from "../views/page/Edit";
import CreatePage from "../views/page/Create";
import EditPost from "../views/post/Edit";
import CreatePost from "../views/post/Create";
import EditEvent from "../views/event/Edit";
import CreateEvent from "../views/event/Create";
import CreateMessage from "../views/chat/Create";

function Application() {
  const user = useContext(UserContext);

  return user ? (
    <LoggedLayout>
      <Router>
        <ProfilePage path="/app/me" />
        <PasswordChange path="/app/passwordChange" />
        <Messages path="/app/messages" />
        <CreateMessage path="/app/messages/create" />
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
