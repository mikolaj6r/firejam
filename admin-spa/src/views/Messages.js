import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import SectionTitle from "../components/Typography/SectionTitle";
import { PlusCircledIcon } from "@modulz/radix-icons";
import { auth, firestore } from "../firebase";
import { useUser } from "../context/UserContext";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
} from "@windmill/react-ui";
import Loader from "../components/Loader";
import Error from "../components/Error";

import { ChatIcon } from "../icons";
import { useNavigate } from "@reach/router";

export default function Messages() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { uid: currentUserId } = useUser();
  const [data, setData] = useState([]);

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = data?.length || 10;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  function onCreateButtonClick() {
    navigate(`/app/messages/create`);
  }

  function onViewButtonClick(uid) {
    navigate(`/app/messages/${uid}`);
  }

  useEffect(() => {
    /* setDataTable(response.slice((pageTable - 1) * resultsPerPage, pageTable1 * resultsPerPage)) */
  }, [pageTable]);

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
        setUsers(users);
      });
  }, []);

  useEffect(() => {
    const individualPromise = firestore.collection("individualChat").get();
    const groupPromise = firestore.collection("groupChat").get();

    Promise.all([individualPromise, groupPromise]).then(function ([
      individualSnapshot,
      groupSnaphot,
    ]) {
      let individualChats = [];
      let groupChats = [];

      individualSnapshot.forEach(function (doc) {
        const data = doc.data();

        individualChats.push({
          id: doc.id,
          sender: data.sender,
          message: data.message,
          receiver: data.receiver,
          date: data.date,
        });
      });

      groupSnaphot.forEach(function (doc) {
        const data = doc.data();

        groupChats.push({
          id: doc.id,
          sender: data.sender,
          message: data.message,
          targetGroup: data.targetGroup,
          date: data.date,
        });
      });

      setData([...individualChats, ...groupChats]);
    });
  }, []);

  if (!data) return <Loader />;
  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.messages.pagetitle"
          defaultMessage="Messages"
          description="PageTitle"
        />
      </PageTitle>

      <div className="container flex items-center justify-between mx-auto my-6 text-purple-600 dark:text-purple-300">
        <Button iconLeft={PlusCircledIcon} onClick={onCreateButtonClick}>
          Create
        </Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map(
              ({ id, sender, message, date, receiver, targetGroup }, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-semibold">
                        {
                          users.find((user) => user.id == sender)?.data
                            .displayName
                        }
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {receiver
                          ? users.find((user) => user.id == receiver)?.data
                              .displayName
                          : targetGroup + "s"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {message.substring(0, 16)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          layout="link"
                          size="icon"
                          aria-label="View"
                          onClick={(event) => {
                            onViewButtonClick(id);
                          }}
                        >
                          <ChatIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}
