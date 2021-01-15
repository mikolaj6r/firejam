import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

import {  auth } from '../firebase'

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
  Avatar, 
  Button,
  Pagination,
} from '@windmill/react-ui'
import { EditIcon, TrashIcon } from '../icons'

export default function Users() {

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1)

  const [totalResults, setTotalResults] = useState(10);

  // setup data for every table
  const [dataTable, setDataTable] = useState([]);

  useEffect(
    async () => {
      const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
      const response = await fetch("http://localhost:3001/users", {
        headers: {
          "authorization": `Bearer ${idToken}`
        }
      });
      const data = await response.json();
      if(data.status === 'success'){
        const users = data.json;
        const mappedUsers = users.map(({disabled, email, emailVerified, metadata, uid}) => ({
          disabled,
          email,
          emailVerified,
          metadata,
          uid
        }));

        setDataTable(mappedUsers);
        setTotalResults(mappedUsers.length);
      }
      console.log(data);
    },
    [] 
  );

  // pagination setup
  const resultsPerPage = 10

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
  }
  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    /* setDataTable(response.slice((pageTable - 1) * resultsPerPage, pageTable1 * resultsPerPage)) */
  }, [pageTable])

  return (
    <>
      <PageTitle><FormattedMessage id="app.users.pagetitle"
        defaultMessage="Users"
        description="PageTitle" /></PageTitle>


      <SectionTitle>Table</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar className="hidden mr-3 md:block" src={user.avatar || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'} alt="User avatar" />
                    <div>
                      <p className="font-semibold">{user.email}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.uid}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type={user.disabled ? 'danger':'success'}>{user.disabled ? 'disabled':'enabled'}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(user.metadata.lastSignInTime).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete">
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