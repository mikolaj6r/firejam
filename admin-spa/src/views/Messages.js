import React from 'react';
import PageTitle from '../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

export default function Messages(){
  return (
    <>
     <PageTitle><FormattedMessage id="app.messages.pagetitle"
    defaultMessage="Messages"
    description="PageTitle"/></PageTitle>

    </>
  )
}