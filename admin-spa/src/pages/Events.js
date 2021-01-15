import React from 'react';
import PageTitle from '../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

export default function Events(){
  return (
    <>
      <PageTitle><FormattedMessage id="app.events.pagetitle"
    defaultMessage="Events"
    description="PageTitle"/></PageTitle>

    </>
  )
}