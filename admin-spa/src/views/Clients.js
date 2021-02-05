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

export default function Clients() {
  const { data, error } = useAPI("clients");

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
    navigate(`/app/clients/${uid}`);
  }

  function onCreateButtonClick() {
    navigate(`/app/clients/create`);
  }

  async function onDeleteButtonClick(uid) {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    await fetch(`${API_URL}/clients/${uid}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    mutate(`${API_URL}/clients`);
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
          id="app.clients.pagetitle"
          defaultMessage="Clients"
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
              <TableCell>Status</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Role</TableCell>
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
                  <Badge type={data.disabled ? "danger" : "success"}>
                    {data.disabled ? "disabled" : "enabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{data.token}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.role}</span>
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
