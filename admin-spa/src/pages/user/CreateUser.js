import React from 'react';
import PageTitle from '../../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

import { auth } from '../../firebase'

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

export default function CreateUser() {
  const navigate = useNavigate();
  const { handleSubmit, errors, control, register } = useForm();

  const onSubmit = async (data) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    console.log(data)
    /* await fetch(`http://localhost:3001/users`, {
      method: 'POST',
      headers: {
        "authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }) */

    navigate(`/app/users`);
  }

  return (
    <>
      <PageTitle><FormattedMessage id="app.users.pagetitle"
        defaultMessage="Create user"
        description="PageTitle" /></PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Create new user
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
                      defaultValue=""
                      type="email"
                      as={Input}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors.email && <span>This field is required</span>}
                  </label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Password
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <label>

                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      type="password"
                      as={Input}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors.password && <span>This field is required</span>}
                  </label>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Disabled
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label check>
                    <Input name="disabled" type="checkbox" ref={register} defaultChecked={false} />
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Email verified
        </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label check>
                    <Controller
                      name="emailVerified"
                      control={control}
                      defaultValue={true}
                      render={({ value, onChange }) => {
                        return (<Input type="checkbox" value={value} onChange={(event) => onChange(event.target.checked)} />)
                      }}
                    />
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
                      defaultValue={'teacher'}
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
            <Button type="submit" iconLeft={FormsIcon}>Create</Button>
          </div>
        </div>

      </form>
    </>
  )
}