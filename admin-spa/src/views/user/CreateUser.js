import React from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { auth } from "../../firebase";
import { API_URL } from "../../hooks/useAPI";

import { Input, Button, Label, Select } from "@windmill/react-ui";
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from "../../icons";
import { useNavigate } from "@reach/router";
import availableRoles from "../../data/roles";
import { capitalize } from "../../utils";

export default function CreateUser() {
  const navigate = useNavigate();
  const { handleSubmit, errors, control, register } = useForm();

  const onSubmit = async (data) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    navigate(`/app/users`);
  };

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.users.pagetitle"
          defaultMessage="Create user"
          description="PageTitle"
        />
      </PageTitle>

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
                  Display name
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Input
                      name="displayName"
                      defaultValue={""}
                      type="text"
                      ref={register({ required: true })}
                    />
                    {errors.displayName && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Email
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Input
                      name="email"
                      defaultValue=""
                      type="email"
                      ref={register({
                        required: "Required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "invalid email address",
                        },
                      })}
                    />
                    {errors.email && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Password
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Input
                      name="password"
                      defaultValue=""
                      type="password"
                      ref={register({
                        required: "Required",
                        pattern: {
                          value: /(?=.*[0-9a-zA-Z]).{6,}/i,
                          message:
                            "The password must be a string with at least  6 chars length",
                        },
                      })}
                    />
                    {errors.password && errors.password.message}
                  </Label>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Disabled
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label check>
                    <Input
                      name="disabled"
                      type="checkbox"
                      ref={register}
                      defaultChecked={false}
                    />
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Email verified
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label check>
                    <Input
                      name="emailVerified"
                      type="checkbox"
                      ref={register}
                      defaultChecked={true}
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
                    <Select
                      name="role"
                      className="mt-1"
                      defaultValue={"teacher"}
                      ref={register}
                    >
                      {availableRoles.map((role) => (
                        <option value={role} key={role}>
                          {capitalize(role)}
                        </option>
                      ))}
                    </Select>
                  </Label>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <Button type="submit" iconLeft={FormsIcon}>
              Create
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
