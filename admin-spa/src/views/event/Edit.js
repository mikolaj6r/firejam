import React from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { auth } from "../../firebase";
import useSWR, { mutate } from "swr";

import { Input, Button, Label, Select } from "@windmill/react-ui";
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from "../../icons";
import { useNavigate } from "@reach/router";
import availableRoles from "../../data/roles";
import DateTimePicker from "react-datetime-picker";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const fetcher = async (...args) => {
  const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
  const idTokenResult = await auth.currentUser.getIdTokenResult();

  const response = await fetch(args[0], {
    headers: {
      authorization: `Bearer ${idToken}`,
    },
  });
  const data = await response.json();
  if (data.status === "success") {
    const event = data.json;

    return {
      ...event,
    };
  }
};

export default function EditEvent({ uid }) {
  const navigate = useNavigate();

  const { handleSubmit, errors, control, register } = useForm();
  const onSubmit = async (data) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    await fetch(`http://localhost:3001/events/${uid}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    mutate(`http://localhost:3001/events/${uid}`);
    navigate(`/app/events`);
  };

  const { data, error } = useSWR(
    `http://localhost:3001/events/${uid}`,
    fetcher
  );

  if (error) return <div>failed to load: {error}</div>;
  if (!data) return <div>loading...</div>;

  const { data: event } = data;

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.events.pagetitle"
          defaultMessage="Edit event"
          description="PageTitle"
        />
      </PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Edit event details
            </p>
          </div>
          <div>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Title
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Input
                      name="title"
                      defaultValue={event.title}
                      type="text"
                      ref={register}
                    />
                    {errors.title && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-smpost leading-5 font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Input
                      name="description"
                      defaultValue={event.description}
                      type="text"
                      ref={register}
                    />
                    {errors.description && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Date
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Label>
                    <Controller
                      name="date"
                      control={control}
                      defaultValue={new Date(event.date)}
                      render={(props) => {
                        return (
                          <DateTimePicker
                            value={props.value}
                            onChange={props.onChange}
                          />
                        );
                      }}
                    ></Controller>
                    {errors.date && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <Button type="submit" iconLeft={FormsIcon}>
              Update
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
