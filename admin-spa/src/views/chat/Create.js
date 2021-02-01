import React, { useState, useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { auth, firestore } from "../../firebase";
import { useUser } from "../../context/UserContext";

import { Input, Button, Label, Select, Textarea } from "@windmill/react-ui";
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from "../../icons";
import { useNavigate } from "@reach/router";
import availableRoles from "../../data/roles";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function CreateMessage() {
  const navigate = useNavigate();
  const { handleSubmit, errors, control, register, watch } = useForm();
  const [users, setUsers] = useState([]);
  const { uid: currentUserId } = useUser();

  const messageType = watch("messageType", "individual");

  useEffect(() => {
    firestore
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        let users = [];

        querySnapshot.forEach(function (doc) {
          users.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        const withoutMe = users.filter((user) => user.id !== currentUserId);
        setUsers(withoutMe);
      });
  }, []);

  const onSubmit = async (data) => {
    // save message to DB and maybe notify user
    switch (messageType) {
      case "individual":
        firestore
          .collection("individualChat")
          .add({
            sender: currentUserId,
            receiver: data.target,
            message: data.message,
            date: new Date().toISOString(),
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            navigate(`/app/messages`);
          });

        break;
      case "group":
        firestore
          .collection("groupChat")
          .add({
            sender: currentUserId,
            message: data.message,
            targetGroup: data.target,
            date: new Date().toISOString(),
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            navigate(`/app/messages`);
          });

        break;
      default:
        break;
    }
  };

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.chats.pagetitle"
          defaultMessage="Create message"
          description="PageTitle"
        />
      </PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Create new message
            </p>
          </div>
          <div>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Type
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <input
                      name="messageType"
                      type="radio"
                      value="individual"
                      defaultChecked={true}
                      ref={register}
                    />
                    Individual
                  </Label>
                  <Label>
                    <input
                      name="messageType"
                      type="radio"
                      value="group"
                      ref={register}
                    />
                    Group
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {messageType == "individual" ? "Receiver" : "Target group"}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    {messageType == "individual" ? (
                      <Select
                        name="target"
                        className="mt-1"
                        defaultValue={""}
                        ref={register}
                      >
                        {users.map((user) => (
                          <option value={user.id} key={user.id}>
                            {capitalize(user.data.displayName)}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        name="target"
                        className="mt-1"
                        defaultValue={""}
                        ref={register}
                      >
                        {availableRoles.map((role) => (
                          <option value={role} key={role}>
                            {capitalize(role)}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Label>
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Message
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Textarea
                      name="message"
                      defaultValue=""
                      rows="3"
                      ref={register}
                    />
                    {errors.message && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <Button type="submit" iconLeft={FormsIcon}>
              Send
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
