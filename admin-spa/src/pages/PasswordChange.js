import React, { useState } from "react";
import { Link } from "@reach/router";
import {auth} from "../firebase";

const PasswordReset = () => {
  const [pass, setPass] = useState("");
  const [passHasBeenChanged, setPassHasBeenChanged] = useState(false);
  const [error, setError] = useState(null);


  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userPassword") {
      setPass(value);
    }
  };

  const changePassword = event => {
    event.preventDefault();
    
    auth.currentUser.updatePassword(pass)
      .then(() => {
        setPassHasBeenChanged(true);
        setTimeout(() => {setPassHasBeenChanged(false)}, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  return (
    <div className="mt-8">
      <h1 className="text-xl text-center font-bold mb-3">
        Change your Password
      </h1>
      <div className="border border-blue-300 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        <form action="">
          {passHasBeenChanged && (
            <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
              Password has been changed!
            </div>
          )}
          {error !== null && (
            <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
              {error}
            </div>
          )}
          <label htmlFor="userPassword" className="block">
            Password:
          </label>
          <input
            type="password"
            className="mt-1 mb-3 p-1 w-full"
            name="userPassword"
            value = {pass}
            placeholder="Your Password"
            id="userPassword"
            autoComplete="new-password"
            onChange = {(event) => onChangeHandler(event)}
          />
          <button
            className="w-full bg-blue-400 text-white py-3"
            onClick={event => {
              changePassword(event);
            }}
          >
            Change my password
          </button>
        </form>
        <Link
         to ="/me"
          className="my-2 text-blue-700 hover:text-blue-800 text-center block"
        >
          &larr; back to profile page
        </Link>
      </div>
    </div>
  );
};
export default PasswordReset;