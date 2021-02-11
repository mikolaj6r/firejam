import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import PageTitle from "../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { Badge, Avatar, Button } from "@windmill/react-ui";

const ProfilePage = () => {
  const user = useContext(UserContext);
  const { displayName, email } = user;

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.profilepage.pagetitle"
          defaultMessage="Profile Page"
          description="PageTitle"
        />
      </PageTitle>
      <div className="container mx-auto mt-36">
        <div>
          <div className="bg-white relative shadow-xl w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6 mx-auto shadow-xl rounded-lg py-3">
            <div className="flex justify-center">
              <img
                src={
                  "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
                }
                alt="profile picture"
                className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-2xl border-4 border-white"
              />
            </div>

            <div className="mt-16">
              <h1 className="font-bold text-center text-3xl text-gray-900">
                {displayName}
              </h1>
              <p className="text-center text-sm text-gray-400 font-medium mt-2">
                {email}
              </p>
              <div className="text-center my-8 justify-between flex justify-around  px-6">
                <Button layout="outline">
                  <Link
                    to="/app/passwordChange"
                    className="text-indigo-500 hover:text-indigo-600"
                  >
                    Change password
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    auth.signOut();
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
