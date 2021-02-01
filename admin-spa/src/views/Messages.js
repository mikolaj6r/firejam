import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import { FormattedMessage } from "react-intl";

import SectionTitle from "../components/Typography/SectionTitle";
import { PlusCircledIcon } from "@modulz/radix-icons";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../icons";
import { useNavigate } from "@reach/router";

export default function Messages() {
  const navigate = useNavigate();

  function onCreateButtonClick() {
    navigate(`/app/messages/create`);
  }

  return (
    <>
      <PageTitle>
        <FormattedMessage
          id="app.messages.pagetitle"
          defaultMessage="Messages"
          description="PageTitle"
        />
      </PageTitle>

      <div className="container flex items-center justify-between mx-auto my-6 text-purple-600 dark:text-purple-300">
        <Button iconLeft={PlusCircledIcon} onClick={onCreateButtonClick}>
          Create
        </Button>
      </div>
    </>
  );
}
