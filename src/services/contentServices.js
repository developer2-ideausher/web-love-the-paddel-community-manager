import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";


//update policy

export const createContent = async (payload) => {
  const endpoint = `${URL}/admin/content`;
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



//update privacy
export const updatePrivacyContent = async (payload) => {
  const endpoint = `${URL}/admin/content/privacy`;
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

//update tnc
export const updatetncContent = async (payload) => {
  const endpoint = `${URL}/users/tcAndPrivacyPolicy`;
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
//GET Policy 

export const getPrivacy = async () => {
  const myHeaders = new Headers();
  const token = await getAuthToken();

  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${URL}/users/tcAndPrivacyPolicy`, requestOptions);
    return responseValidator(response);
  } catch (e) {
    return apiError(e);
  }
};


//About

export const getAboutus = async () => {
  const myHeaders = new Headers();
  const token = await getAuthToken();

  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${URL}/admin/content/about`, requestOptions);
    return responseValidator(response);
  } catch (e) {
    return apiError(e);
  }
};

//tnc

export const getContent = async () => {
  const myHeaders = new Headers();
  const token = await getAuthToken();

  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${URL}/users/tcAndPrivacyPolicy`, requestOptions);
    return responseValidator(response);
  } catch (e) {
    return apiError(e);
  }
};

//Get faqs

export const getfaqs = async (payload) => {
  let endpoint = `${URL}/admin/faq`
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

export const addFaq = async (payload) => {
  try {
    const res = await fetch(`${URL}/admin/faq`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};

//get faq by id
export const getfaqsById = async (id) => {
  let endpoint = `${URL}/admin/faq/${id}`
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

export const editFaq = async (id, payload) => {
  try {
    const res = await fetch(`${URL}/admin/faq/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};


//unArchive faq

export const unArchivefaq = async (faqId, payload) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${getAuthToken()}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  try {
    const response = await fetch(
      URL + `/faq/archive/${faqId}`,
      requestOptions
    );
    return responseValidator(response, true);
  } catch (e) {
    return apiError(e);
  }
};


//Suspend/Active

export const suspendFaq = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/faq-soft/${Id}`

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

export const deleteFaq = async (Id) => {
  const token = await getAuthToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let endpoint = `${URL}/admin/faq-hard/${Id}`

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