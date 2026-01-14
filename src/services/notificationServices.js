import { apiError, appendQueryParams, getAuthToken, responseValidator, URL } from "./api/helper";

export const getNotificationsList = async (payload) => {
    let endpoint = `${URL}/notifications`
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

export const getPushNotificationsList = async (payload) => {
    let endpoint = `${URL}/notifications/admin`
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


export const getNotificationById = async (id, payload) => {
    let endpoint = `${URL}/notifications/${id}`
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

export const deleteNotifications = async (id) => {
    const token = await getAuthToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const endpoint = `${URL}/notifications`;

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ ids: [id] }),
        redirect: "follow",
    };

    try {
        const response = await fetch(endpoint, requestOptions);
        return responseValidator(response, true);
    } catch (e) {
        return apiError(e);
    }
};



export const createNotifications = async (payload) => {
    const endpoint = `${URL}/notifications`;
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

export const editNotification = async (id, payload) => {
    const endpoint = `${URL}/notifications/${id}`;
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

export const getUnreadNotifications = async () => {
    let endpoint = `${URL}/notifications/unread`
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

export const subscribeNotifications = async ({ fcmToken }) => {
    try {
        const token = await getAuthToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const endpoint = `${URL}/notifications/subscribe/${fcmToken}`;
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(endpoint, requestOptions);
        return responseValidator(response, true);
    } catch (error) {
        console.error("subscribeNotifications error:", error);
        return apiError(error);
    }
};

export const unsubscribeNotifications = async ({ fcmToken }) => {
    try {
        const requestOptions = await getRequestOptions();
        const payload = {
            fcmToken
        };

        const response = await fetch(`${URL}/notifications/unsubscribe/${fcmToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...requestOptions.headers
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        return responseValidator(response);
    } catch (error) {
        return apiError(error);
    }
};

export const readUnreadNotification = async (payload) => {
    const endpoint = `${URL}/notifications/mark-read-unread`;
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

export const readUnreadSingleNotification = async (payload) => {
    const endpoint = `${URL}/notifications/mark-read`;
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
export const unreadNotification = async (payload) => {
    const endpoint = `${URL}/notifications/mark-unread`;
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


export const deletePushNotifications = async (payload) => {
    const token = await getAuthToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    let endpoint = `${URL}/notifications`
    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: "follow",
    };
    try {
        const response = await fetch(`${endpoint}`, requestOptions);

        return responseValidator(response, true);
    } catch (e) {
        return apiError(e);
    }
};