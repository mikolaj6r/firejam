import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

import { auth } from '../firebase'

import SectionTitle from '../components/Typography/SectionTitle'
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
} from '@windmill/react-ui'
import { EditIcon, TrashIcon } from '../icons'
import useSWR, { mutate } from 'swr'
import { useNavigate } from "@reach/router"
import { PlusCircledIcon } from '@modulz/radix-icons'

const fetcher = async (...args) => {
  const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
  const response = await fetch(args[0], {
    headers: {
      "authorization": `Bearer ${idToken}`
    }
  });
  const data = await response.json();
  if (data.status === 'success') {
    const clients = data.json;

    return clients
  }
}


export default function Clients() {
  const { data, error } = useSWR('http://localhost:3001/clients', fetcher)

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1)
  const navigate = useNavigate();

  // pagination setup
  const resultsPerPage = 10
  const totalResults = data?.length || 10;;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function onEditButtonClick(uid) {
    navigate(`/app/clients/${uid}`);
  }

  function onCreateButtonClick() {
    navigate(`/app/clients/create`);
  }

  async function onDeleteButtonClick(uid) {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    await fetch(`http://localhost:3001/clients/${uid}`, {
      method: 'DELETE',
      headers: {
        "authorization": `Bearer ${idToken}`
      }
    })

    mutate('http://localhost:3001/clients')
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    /* setDataTable(response.slice((pageTable - 1) * resultsPerPage, pageTable1 * resultsPerPage)) */
  }, [pageTable])

  if (!data) console.log('render with no data')
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  console.log(data)
  return (
    <>
      <PageTitle><FormattedMessage id="app.clients.pagetitle"
        defaultMessage="Clients"
        description="PageTitle" /></PageTitle>

      <div className="container flex items-center justify-between mx-auto my-6 text-purple-600 dark:text-purple-300">
        <SectionTitle>Table</SectionTitle>
        <div className="flex-1"></div>
        <Button iconLeft={PlusCircledIcon} onClick={onCreateButtonClick}>Create</Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Id</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Token</TableCell>
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
                  <Badge type={data.disabled ? 'danger' : 'success'}>{data.disabled ? 'disabled' : 'enabled'}</Badge>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{data.token}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(data.metadata?.lastSignInTime).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={(event => { onEditButtonClick(id) })}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={(event => { onDeleteButtonClick(id) })}>
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
  )
}