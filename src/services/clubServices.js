import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

export const getClubList = async (payload) => {
  let endpoint = `${URL}/clubs`
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

export const getClubById = async (id, payload) => {
  let endpoint = `${URL}/clubs/${id}`
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
export const getClubEarningsById = async (id, payload) => {
  let endpoint = `${URL}/clubs/club-earnings-by-id/${id}`
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
export const getVendorRatings = async (id, payload) => {
  let endpoint = `${URL}/admin/vendor-ratings/${id}`
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

export const ClubApproval = async (id, payload) => {
  let endpoint = `${URL}/clubs/approve/${id}`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: JSON.stringify(payload), 
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};

export const ClubReject = async (id, payload) => {
  let endpoint = `${URL}/clubs/deny/${id}`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: JSON.stringify(payload), 
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
}; 
export const getVendorCategories = async (payload) => {
  let endpoint = `${URL}/admin/categories`
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

//active/Suspend approvedVendor
export const suspendUser = async (userId) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/suspend-vendor/${userId}`

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

export const suspendClub = async (id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/clubs/toggle-active-status/${id}`

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


//Create coupon

export const createCoupon = async (payload) => {
  const endpoint = `${URL}/coupons/`;
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


//removeRatings
export const removeRatings = async (id) => {
  let endpoint = `${URL}/admin/remove-rating/${id}`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};



export const deleteMediaAPI = async (vendorId, mediaType,mediaId ) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/delete-media/${vendorId}/${mediaType}/${mediaId}`; 
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


  
export const getCouponsList = async (payload) => {
  let endpoint = `${URL}/coupons`
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
export const deleteCoupon = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/coupons/${Id}`
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


export const getClubOfWeekList = async (payload) => {
  let endpoint = `${URL}/club-of-the-week`
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

export const getClubOfWeekById = async (id) => {
  let endpoint = `${URL}/club-of-the-week/${id}`
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



export const deleteClub = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/club-of-the-week/${Id}`
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

export const publishweekClub = async (payload) => {
  const endpoint = `${URL}/club-of-the-week`;
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
 