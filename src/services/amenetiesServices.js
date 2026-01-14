import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";


export const getAmenetiesList = async (payload) => {
  let endpoint = `${URL}/amenities`
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

export const deleteAmeneties = async (amenityId) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/amenities/${amenityId}`
  const requestOptions = {
    method: "DELETE",
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


export const createAmenity = async (payload) => {
  const endpoint = `${URL}/amenities`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json"); 
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(payload), 
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};


export const editAmenity = async (id, payload) => {
  const endpoint = `${URL}/amenities/${id}`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json"); 

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: JSON.stringify(payload), 
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};

