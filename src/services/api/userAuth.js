import { URL, responseValidator, apiError } from "./helper";

export const userLogin = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`)


    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };
    try{
        const response = await fetch(URL+"/auth/login", requestOptions) 
        return responseValidator(response)
    }
    catch(e){
        return apiError(e)
    }
}
