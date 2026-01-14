import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

//coupon list
export const getCouponList = async (payload) => {
  let endpoint = `${URL}/admin/vendor`
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
  let endpoint = `${URL}/admin/client-redeemed-coupons/${id}`
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
  let endpoint = `${URL}/admin/suspend-user?userId=${userId}`

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

// getCategoryList 
export const getCategoryList = async (payload) => {
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

export const getCouponById = async (id, payload) => {
  let endpoint = `${URL}/admin/vendor-coupons?vendorId=${id}`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let queryParams = appendQueryParams(payload);
  if (endpoint.includes('?') && queryParams) {
    queryParams = queryParams.replace('?', '&');
  }
  endpoint += queryParams;

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};

export const getVendorLabels = async (payload) => {
  let endpoint = `${URL}/admin/labels`
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

export const suspendCoupon = async (userId) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/softDelete-coupon/${userId}`

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


export const deleteCoupon = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/coupons/${Id}`

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

export const deleteLabelByName = async (name) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/delete-label/${name}`

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


export const deleteCategoryById = async (id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/delete-category/${id}`

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

export const deleteCampaignById = async (id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/campaigns/${id}`

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
//Campaign apis
export const getCampaignList = async (payload) => {
  let endpoint = `${URL}/admin/campaigns`
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

export const getCampaignById = async (id, payload) => {
  let endpoint = `${URL}/admin/campaign-vendors?campaignId=${id}`
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let queryParams = appendQueryParams(payload);
  if (endpoint.includes('?') && queryParams) {
    queryParams = queryParams.replace('?', '&');
  }
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


export const suspendCampaign = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/softDelete-campaign/${Id}`

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


export const deleteCampaign = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/campaigns/${Id}`

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
export const getCampaignCouponById = async (id, payload) => {
  let endpoint = `${URL}/admin/vendor-coupons?vendorId=${id}`;
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let queryParams = appendQueryParams(payload);
  if (endpoint.includes('?') && queryParams) {
    queryParams = queryParams.replace('?', '&');
  }
  endpoint += queryParams;

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};

//Category apis

//coupon list
export const getCategoyList = async (payload) => {
  let endpoint = `${URL}/admin/vendor-byCategory`
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

export const getCategoryVendorList = async (id, payload) => {
  const myHeaders = new Headers();
  const token = await getAuthToken();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const queryParams = new URLSearchParams(payload);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${URL}/admin/vendor?businessCategories=${id}`,
      requestOptions
    );
    return responseValidator(response);
  } catch (e) {
    return apiError(e);
  }
};


export const getLabelList = async (payload) => {
  let endpoint = `${URL}/admin/vendor-byLabel`
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


export const getLabelVendorList = async (payload) => {
  let endpoint = `${URL}/admin/vendor`;
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
    return responseValidator(response);
  } catch (error) {
    return apiError(error);
  }
};


//Create Amenity

export const CreateAmenity = async (payload) => {
  const endpoint = `${URL}/amenities`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: payload,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};

//Edit campaign

export const editCampaign = async (id, payload) => {
  const endpoint = `${URL}/admin//campaigns/${id}`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: payload,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};
//create category

export const createCategory = async (payload) => {
  const endpoint = `${URL}/admin/new-category`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
 

  const requestOptions = {
    method: "POST",
    body: payload,
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};


export const editCategory = async (payload) => {
  const endpoint = `${URL}/admin/add-category`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "PATCH",
    body: payload,
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};

export const editLabel = async (payload) => {
  const endpoint = `${URL}/admin/add-label`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};
export const createLabel = async (payload) => {
  const endpoint = `${URL}/admin/add-label`;
  const token = await getAuthToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    return responseValidator(response, true);
  } catch (error) {
    return apiError(error);
  }
};


export const getcampaigndetailById = async (id) => {
  let endpoint = `${URL}/admin/campaigns/${id}`
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


export const getCategorydetailById = async (id) => {
  let endpoint = `${URL}/admin/business-categories/${id}`
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


export const getLabeldetByName = async (name) => {
  let endpoint = `${URL}/admin/vendors-label/${name}`
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
export const getLabelDetailByName = async (name, payload) => {
  let endpoint = `${URL}/admin/vendors-label/${name}`
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