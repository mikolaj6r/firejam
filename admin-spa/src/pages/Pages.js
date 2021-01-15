import React from 'react';
import PageTitle from '../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

export default function Pages(){
  return (
    <>
      <PageTitle><FormattedMessage id="app.pages.pagetitle"
    defaultMessage="Pages"
    description="PageTitle"/></PageTitle>

    </>
  )
}