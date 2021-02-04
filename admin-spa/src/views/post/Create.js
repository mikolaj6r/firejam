import React, { useState } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import { auth } from "../../firebase";

import { Input, Button, Label, Select } from "@windmill/react-ui";
import { useForm, Controller } from "react-hook-form";
import { FormsIcon } from "../../icons";
import { useNavigate } from "@reach/router";
import availableRoles from "../../data/roles";

import Editor, {
  convertToRaw,
  EditorState,
} from "../../components/Editor/Editor";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function CreatePost() {
  const navigate = useNavigate();
  const { handleSubmit, errors, control, register } = useForm();

  const onSubmit = async (data) => {
    const { content } = data;

    const rawContent = convertToRaw(content.getCurrentContent());

    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        content: rawContent,
      }),
    });

    navigate(`/app/posts`);
  };

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.posts.pagetitle"
          defaultMessage="Create post"
          description="PageTitle"
        />
      </PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Create new post
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
                      defaultValue=""
                      type="text"
                      ref={register}
                    />
                    {errors.title && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 pb-20 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Content
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Controller
                    name="content"
                    control={control}
                    defaultValue={EditorState.createEmpty()}
                    render={(props) => (
                      <Editor
                        editorState={props.value}
                        onEditorStateChange={props.onChange}
                      />
                    )}
                  />
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
