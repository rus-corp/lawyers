import axios from "axios";

export const backendUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
})