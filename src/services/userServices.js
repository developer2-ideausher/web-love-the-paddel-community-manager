import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

export const getUserList = async (payload) => {
  let endpoint = `${URL}/users`
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
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
export const getBookingListById = async (payload) => {
  let endpoint = `${URL}/bookings`
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
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
export const getUserById = async (id) => {
  let endpoint = `${URL}/users/${id}`
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

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

//Suspend/Active

export const suspendUser = async (userId) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/users/toggleUserStatus/${userId}`

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${endpoint}`, requestOptions);

    return responseValidator(response, true);
  } catch (e) {
    return apiError(e);
  }
};