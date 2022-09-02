import axios from "axios";

export async function apiService(method, url, data = {}, timeout = 20000) {
  let config = {
    method: method,
    url: url,
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
    timeout,
  };
  return axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log("error: ", error);
      if (error.response?.status === 401) window.location.href = "/home";
      return null;
    });
}
