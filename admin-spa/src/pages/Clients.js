import React from 'react';
import PageTitle from '../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

export default function Clients(){
  return (
    <>
      <PageTitle><FormattedMessage id="app.clients.pagetitle"
    defaultMessage="Clients"
    description="PageTitle"/></PageTitle>

    </>
  )
}