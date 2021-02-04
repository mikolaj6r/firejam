import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { auth } from "../firebase";

import SectionTitle from "../components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../icons";
import { mutate } from "swr";
import useAPI, { API_URL } from "../hooks/useAPI";

import { useNavigate } from "@reach/router";
import { PlusCircledIcon } from "@modulz/radix-icons";

import formatDistance from "date-fns/formatDistance";

function relativeSignInTime(signInTime) {
  return signInTime === null
    ? "never"
    : formatDistance(new Date(signInTime), new Date(), { addSuffix: true });
}

export default function Users() {
  const { data, error } = useAPI("users");

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1);
  const navigate = useNavigate();

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = data?.length || 10;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  function onEditButtonClick(uid) {
    navigate(`/app/users/${uid}`);
  }

  function onCreateButtonClick() {
    navigate(`/app/users/create`);
  }

  async function onDeleteButtonClick(uid) {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    await fetch(`${API_URL}/users/${uid}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    mutate(`${API_URL}/users`);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    /* setDataTable(response.slice((pageTable - 1) * resultsPerPage, pageTable1 * resultsPerPage)) */
  }, [pageTable]);

  if (!data) console.log("render with no data");
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(data);
  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.users.pagetitle"
          defaultMessage="Users"
          description="PageTitle"
        />
      </PageTitle>

      <div className="container flex items-center justify-between mx-auto my-6 text-purple-600 dark:text-purple-300">
        <SectionTitle>Table</SectionTitle>
        <div className="flex-1"></div>
        <Button iconLeft={PlusCircledIcon} onClick={onCreateButtonClick}>
          Create
        </Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Last signIn Time</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={
                        user.avatar ||
                        "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
                      }
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{user.email}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.uid}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type={user.disabled ? "danger" : "success"}>
                    {user.disabled ? "disabled" : "enabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.role}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {relativeSignInTime(user.lastSignInTime)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={(event) => {
                        onEditButtonClick(user.uid);
                      }}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={(event) => {
                        onDeleteButtonClick(user.uid);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
