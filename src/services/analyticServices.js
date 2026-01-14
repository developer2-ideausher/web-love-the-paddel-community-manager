import { apiError, getAuthToken, responseValidator, URL } from "./api/helper";

//MetricsData api
export const getMetricsData = async () => {
    const myHeaders = new Headers();
    const token = await getAuthToken();

    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`${URL}/admin/stats`, requestOptions);
        return responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
};

//top vendor api
export const getTopVendor = async () => {
    const myHeaders = new Headers();
    const token = await getAuthToken();

    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`${URL}/admin/top-vendors`, requestOptions);
        return responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
};

//top users chart
export const getTopUsers = async (payload) => {
    const myHeaders = new Headers();
    const token = await getAuthToken();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`${URL}/admin/top-user`, requestOptions);
        return responseValidator(response);
    } catch (e) {
        return apiError(e);
    }
};
;

