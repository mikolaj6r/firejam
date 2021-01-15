import React from 'react';

import { FormattedMessage } from 'react-intl'
import PageTitle from '../components/Typography/PageTitle'


export default function Dashboard() {
  return (
    <PageTitle><FormattedMessage id="app.dashboard.pagetitle"
    defaultMessage="Dashboard"
    description="PageTitle"/></PageTitle>
  )
}