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
        defaultMessage="Edit user"
        description="PageTitle" /></PageTitle>

    </>
  )
}