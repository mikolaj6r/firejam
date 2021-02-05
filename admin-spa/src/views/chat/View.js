import React, { useState, useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { auth, firestore } from "../../firebase";
import { useUser } from "../../context/UserContext";

import { useNavigate } from "@reach/router";
import { capitalize } from "../../utils";

import Loader from "../../components/Loader";
import Error from "../../components/Error";

export default function ViewMessage({ uid }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { uid: currentUserId } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    firestore
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        let array = [];

        querySnapshot.forEach(function (doc) {
          array.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setUsers(array);
      });
  }, []);

  useEffect(() => {
    const individualCollection = firestore.collection("individualChat");
    const groupCollection = firestore.collection("groupChat");
    const messageHistory = firestore
      .collection("messageHistory")
      .doc(uid)
      .get();

    messageHistory.then(function (doc) {
      const { type } = doc.data();

      switch (type) {
        case "individual":
          individualCollection
            .doc(uid)
            .get()
            .then((document) => {
              const data = document.data();

              setData({
                type: "individual",
                id: doc.id,
                sender: data.sender,
                message: data.message,
                receiver: data.receiver,
                date: data.date,
              });
            });
          break;
        case "group":
          groupCollection
            .doc(uid)
            .get()
            .then((document) => {
              const data = document.data();
              setData({
                type: "group",
                id: doc.id,
                sender: data.sender,
                message: data.message,
                targetGroup: data.targetGroup,
                date: data.date,
              });
            });
          break;
      }
    });
  }, []);

  if (!data) return <Loader />;

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.chats.pagetitle"
          defaultMessage="Message details"
          description="PageTitle"
        />
      </PageTitle>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
            Message details
          </p>
        </div>
        <div>
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Type
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {capitalize(data.type)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                From
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUserId == data.sender ? "(You) " : ""}
                {users.find((user) => user.id == data.sender)?.data.displayName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                To
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {" "}
                {data.receiver
                  ? users.find((user) => user.id == data.receiver)?.data
                      .displayName
                  : data.targetGroup + "s"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Date
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(data.date).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Message
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {data.message}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
