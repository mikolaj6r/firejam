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
  Button,
  Pagination,
} from "@windmill/react-ui";
import Loader from "../components/Loader";
import Error from "../components/Error";

import { EditIcon, TrashIcon } from "../icons";
import { mutate } from "swr";
import useAPI, { API_URL } from "../hooks/useAPI";

import { useNavigate } from "@reach/router";
import { PlusCircledIcon } from "@modulz/radix-icons";

export default function Posts() {
  const { data, error } = useAPI("posts");

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
    navigate(`/app/posts/${uid}`);
  }

  function onCreateButtonClick() {
    navigate(`/app/posts/create`);
  }

  async function onDeleteButtonClick(uid) {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    await fetch(`${API_URL}/posts/${uid}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    mutate(`${API_URL}/posts`);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    /* setDataTable(response.slice((pageTable - 1) * resultsPerPage, pageTable1 * resultsPerPage)) */
  }, [pageTable]);

  if (error) return <Error error={error} />;
  if (!data) return <Loader />;

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.posts.pagetitle"
          defaultMessage="Posts"
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
              <TableCell>Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map(({ id, data }, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{data.title}</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{data.user.displayName}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.date).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={(event) => {
                        onEditButtonClick(id);
                      }}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={(event) => {
                        onDeleteButtonClick(id);
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
