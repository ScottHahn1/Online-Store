import axiosInstance from "./AxiosInstance";

const getData = async <T, U>(url: string, params?: U, accessToken?: string | null) => {
    const headers: Record<string, string> = {};

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    try {
        const response = await axiosInstance.get(url, {
            headers,
            params
        });
        const data: T = await response.data;
        return data;
    } catch(err) {
        console.log(err);
    }
}

type MutateParams = {
    url: string,
    body: {
        [key: string]: any
    }
}

const postData = async ({ url, body }: MutateParams, accessToken?: string | null) => {
    const postRequest = await axiosInstance.post(
        url, 
        body,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then(res => {
        return res.data;
    }).catch(err => {
        return err.response.data;
    })

    return postRequest;
}

const deleteData = async (url: string) => {
    const deleteRequest = await axiosInstance.delete(url)
    .then(res => {
        return res.data;
    }).catch(error => {
        console.log(error);
    })

    return deleteRequest;
}

export { getData, postData, deleteData };