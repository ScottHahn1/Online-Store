import axiosInstance from "./AxiosInstance";

const getData = async <T, U>(url: string, params?: U) => {
    try {
        const response = await axiosInstance.get(url, {
            params: params
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

const postData = async ({ url, body }: MutateParams) => {
    const postRequest = await axiosInstance.post(url, 
        body
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