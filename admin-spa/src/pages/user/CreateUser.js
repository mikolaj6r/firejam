import React from 'react';
import PageTitle from '../../components/Typography/PageTitle'
import { FormattedMessage } from 'react-intl'

import { auth } from '../../firebase'

import {
  Input,
  Button,
} from '@windmill/react-ui'
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from '../../icons'
import { useNavigate } from "@reach/router"


export default function CreateUser() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, errors, control } = useForm();

  const onSubmit = async (data) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    console.log(data)
    await fetch(`http://localhost:3001/users`, {
      method: 'POST',
      headers: {
        "authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify(data)
    })

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
                  <label>
                    <Controller
                      name="disabled"
                      control={control}
                      as={Input}
                      type="checkbox"
                      defaultChecked={false}/>
                  </label>
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
                      defaultChecked={true} />
                  </label>
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