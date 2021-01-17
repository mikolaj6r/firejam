import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

import { auth } from '../../firebase'
import useSWR, { mutate } from 'swr'

import {
  Input,
  Badge,
  Label,
  HelperText,
  Button,
  Select
} from '@windmill/react-ui'
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from '../../icons'
import { useNavigate } from "@reach/router"
import { v4 as uuidv4 } from 'uuid';
import availableRoles from '../../data/roles'

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const fetcher = async (...args) => {
  const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
  const response = await fetch(args[0], {
    headers: {
      "authorization": `Bearer ${idToken}`
    }
  });
  const data = await response.json();
  if (data.status === 'success') {
    const client = data.json;

    return {
      ...client.data,
      id: client.id
    }
  }
}


export default function EditClient({ uid }) {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();
  const { data: client, error } = useSWR(`http://localhost:3001/clients/${uid}`, fetcher)
  const [token, setToken] = useState(client?.token);



  useEffect(() => {
    setToken(client?.token);
  }, [client])

  function onGenerateClick(event) {
    event.preventDefault();
    setToken(uuidv4())
  }

  const onSubmit = async (data) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    await fetch(`http://localhost:3001/clients/${uid}`, {
      method: 'PATCH',
      headers: {
        "authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    navigate(`/app/clients`);
  }

  console.log(client)
  if (error) return <div>failed to load</div>
  if (!client) return <div>loading...</div>

  return (
    <>
      <PageTitle><FormattedMessage id="app.clients.pagetitle"
        defaultMessage="Edit client"
        description="PageTitle" /></PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Edit client details
            </p>
          </div>
          <div>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Id
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Controller
                      name="id"
                      control={control}
                      defaultValue={client.id}
                      disabled={true}
                      as={Input}
                    />
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Token
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="relative">
                    <Label>
                      <input
                        name="token"
                        className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray border rounded px-2 py-3 pl-28"
                        readOnly={true}
                        value={token}
                        ref={register}
                      />
                    </Label>
                    <button className="absolute inset-y-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-l-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" onClick={onGenerateClick}>
                      Generate
            </button>
                  </div>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Disabled
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label check>
                    <Input name="disabled" type="checkbox" ref={register} defaultChecked={client.disabled} />
                  </Label>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Role
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Controller
                      name="role"
                      control={control}
                      defaultValue={client.role}
                      render={({ value, onChange }) => {
                        return (<Select className="mt-1" value={value} onChange={onChange}>
                          {availableRoles.map(role => (<option value={role}>{capitalize(role)}</option>))}
                        </Select>)
                      }}
                    />
                  </Label>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <Button type="submit" iconLeft={FormsIcon}>Update</Button>
          </div>
        </div>

      </form>
    </>
  )
}