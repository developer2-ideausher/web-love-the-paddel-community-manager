import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

export const getRevenueData = async (payload) => {
  let endpoint = `${URL}/revenue`
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("ngrok-skip-browser-warning", "true");
  const queryParams = appendQueryParams(payload);
  endpoint += queryParams;

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${endpoint}`, requestOptions);
    return responseValidator(response)

  } catch (error) {
    return apiError(error)
  }

}