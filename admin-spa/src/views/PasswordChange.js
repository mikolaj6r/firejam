import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import PageTitle from "../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

const PasswordReset = () => {
  const [pass, setPass] = useState("");
  const [passHasBeenChanged, setPassHasBeenChanged] = useState(false);
  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "userPassword") {
      setPass(value);
    }
  };

  const changePassword = (event) => {
    event.preventDefault();

    auth.currentUser
      .updatePassword(pass)
      .then(() => {
        setPassHasBeenChanged(true);
        setTimeout(() => {
          setPassHasBeenChanged(false);
        }, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.profilepage.pagetitle"
          defaultMessage="Change password"
          description="PageTitle"
        />
      </PageTitle>
      <div class="container mx-auto mt-20">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div
            className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg"
          >
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              Change your password
            </h2>

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

            <form className="mt-10" method="POST">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-600 uppercase"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Your new password"
                autoComplete="new-password"
                className="block w-full py-3 px-1 mt-2 mb-4
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                required
                value={pass}
                onChange={(event) => onChangeHandler(event)}
              />
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={(event) => {
                  changePassword(event);
                }}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Change my password
              </button>
              <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
                <Link
                  to="/app/me"
                  className="flex-2 font-medium text-indigo-600 hover:text-indigo-500"
                >
                  back to profile page
                </Link>{" "}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default PasswordReset;
