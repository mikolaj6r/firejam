import React from 'react';
import PageTitle from '../../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

import { auth } from '../../firebase'
import useSWR from 'swr'

import {
  Input,
  Button,
  Label,
  Select
} from '@windmill/react-ui'
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from '../../icons'
import { useNavigate } from "@reach/router"
import availableRoles from '../../data/roles'

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const fetcher = async (...args) => {
  const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
  const idTokenResult = await auth().currentUser.getIdTokenResult();

  const response = await fetch(args[0], {
    headers: {
      "authorization": `Bearer ${idToken}`
    }
  });
  const data = await response.json();
  if (data.status === 'success') {
    const user = data.json;

    return {
      ...user,
      role: idTokenResult.claims.role
    }
  }
}


export default function EditUser({ uid }) {
  const navigate = useNavigate();


  const { handleSubmit, errors, control, register } = useForm();
  const onSubmit = async (data) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    await fetch(`http://localhost:3001/users/${uid}`, {
      method: 'PATCH',
      headers: {
        "authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    navigate(`/app/users`);
  }

  const { data: user, error } = useSWR(`http://localhost:3001/users/${uid}`, fetcher)


  console.log(user)
  if (error) return <div>failed to load</div>
  if (!user) return <div>loading...</div>

  return (
    <>
      <PageTitle><FormattedMessage id="app.users.pagetitle"
        defaultMessage="Edit user"
        description="PageTitle" /></PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Edit user details
            </p>
          </div>
          <div>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Email
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <label>

                    <Controller
                      name="email"
                      control={control}
                      defaultValue={user.email}
                      as={Input}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors.email && <span>This field is required</span>}
                  </label>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Disabled
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label check>
                    <Input name="disabled" type="checkbox" ref={register} defaultChecked={user.disabled} />
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Email verified
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <label>
                    <Controller
                      name="emailVerified"
                      control={control}
                      as={Input}
                      type="checkbox"
                      defaultChecked={user.emailVerified} />
                  </label>
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
                      defaultValue={user.role}
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