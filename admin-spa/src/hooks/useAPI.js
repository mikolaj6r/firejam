import React, { useState, useEffect, useCallback, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { auth } from "../firebase";

export const API_URL = process.env.REACT_APP_API_URL;

const fetcher = async (...args) => {
  const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

  const response = await fetch(args[0], {
    headers: {
      authorization: `Bearer ${idToken}`,
    },
  });
  const data = await response.json();
  if (data.status === "success") {
    return data.json;
  }
};

export default function useAPI(endpoint = "") {
  const { data, error } = useSWR(`${API_URL}/${endpoint}`, fetcher);

  return {
    data,
    error,
  };
}
