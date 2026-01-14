import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

export const getProfile = async () => {
    let endpoint = `${URL}/admin/profile`
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

export const updateProfile = async (payload) => {
 let endpoint = `${URL}/admin/profile`
    const token = await getAuthToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: "PUT",
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
  