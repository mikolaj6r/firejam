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

import Editor, {
  convertToRaw,
  convertFromRaw,
  EditorState,
} from "../../components/Editor/Editor";

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
    const post = data.json;

    return {
      ...post,
    };
  }
};

export default function EditPost({ uid }) {
  const navigate = useNavigate();

  const { handleSubmit, errors, control, register } = useForm();
  const onSubmit = async (data) => {
    const { content } = data;

    const rawContent = convertToRaw(content.getCurrentContent());

    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    await fetch(`http://localhost:3001/posts/${uid}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        content: rawContent,
      }),
    });

    mutate(`http://localhost:3001/posts/${uid}`);
    navigate(`/app/posts`);
  };

  const { data, error } = useSWR(`http://localhost:3001/posts/${uid}`, fetcher);

  if (error) return <div>failed to load: {error}</div>;
  if (!data) return <div>loading...</div>;

  const { data: post } = data;

  const rawEditorData = post.content;
  let contentState = null;

  if (rawEditorData !== null) {
    contentState = EditorState.createWithContent(convertFromRaw(rawEditorData));
  } else {
    contentState = EditorState.createEmpty();
  }

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.posts.pagetitle"
          defaultMessage="Edit post"
          description="PageTitle"
        />
      </PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Edit post details
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
                      defaultValue={post.title}
                      type="text"
                      ref={register}
                    />
                    {errors.title && <span>This field is required</span>}
                  </Label>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  Content
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <Controller
                    name="content"
                    control={control}
                    defaultValue={contentState}
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
              Update
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
