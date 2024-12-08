import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface ContentItem {
  _id: string;
  title: string;
  type: string; // If specific categories exist, use a union type like: "Twitter" | "YouTube"
  link: string;
}

export function useContent() {
  const [contents, setContents] = useState([]);

  function refresh() {
    axios.get(`${BACKEND_URL}/api/v1/content`, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    })
    .then((response) => {
      setContents(response.data.content)
    })
  }

  useEffect(() => {
    refresh();

    let interval = setInterval(() => {
      refresh();
    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return contents;
}