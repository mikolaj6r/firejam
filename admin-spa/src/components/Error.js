import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
import { ErrorIllustration } from "../icons";

export default function Error({ error }) {
  const { status, info } = error;

  const message = info.message || "There was an error.";

  return (
    <>
      <Card colored className="bg-red-600 mt-8 mb-4">
        <CardBody>
          <p className="mb-4 font-semibold text-white">
            Error {status ? `- ${status}` : ""}
          </p>
          <p className="text-white">{message}</p>
        </CardBody>
      </Card>
      <div className="max-w-sm mx-auto">
        <ErrorIllustration />
      </div>
    </>
  );
}
