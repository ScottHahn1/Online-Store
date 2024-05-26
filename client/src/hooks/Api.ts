import axios from "axios";

const getProducts = async <T, U>(url: string, params?: U) => {
    try {
        const response = await axios.get(url, {
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
    const postRequest = await axios.post(url, 
        body
    ).then(res => {
        return res.data;
    }).catch(error => {
        console.log(error);
    })

    return postRequest;
}

const deleteData = async (url: string) => {
    const deleteRequest = await axios.delete(url)
    .then(res => {
        return res.data;
    }).catch(error => {
        console.log(error);
    })

    return deleteRequest;
}

export { getProducts, postData, deleteData };