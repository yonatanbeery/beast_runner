import axios from "axios";
import { FiltersOptions } from "../components/filters/filtersTypes";

export interface Photo {
    fileName: string;
    fileData: Buffer;
}

export const getPosts = async (filters: FiltersOptions, access_token: string) => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": access_token
    }
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/properties`, {params: filters, headers});
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const postComment = (id: string, comment: string, access_token: string) => {
    const headers = {
        "Authorization": access_token
    }
    try {
        axios.post(`${import.meta.env.VITE_SERVER_URL}/properties/postComment`, {id, comment}, {headers})
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const getPostById = async (id: string, access_token: string) => {
    const headers = {
        "Authorization": access_token
    }
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/properties/${id}`, {headers});
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const getPostPhotos = async (id: string, access_token: string) => {
    const headers = {
        "Authorization": access_token
    }
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/properties/photos/${id}`, {headers});
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const postProperty = (formData: FormData, access_token: string) => {
    const headers = {
        "Authorization": access_token,
        "Content-Type": "image/form-data" ,
    }
    try {
        return axios.post(`${import.meta.env.VITE_SERVER_URL}/properties`, formData, {headers})
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const updateProperty = (formData: FormData, postId:string, access_token: string) => {
    const headers = {
        "Authorization": access_token,
        "Content-Type": "image/form-data" ,
    }
    try {
        return axios.put(`${import.meta.env.VITE_SERVER_URL}/properties/${postId}`, formData, {headers})
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const delelteProperty = (postId:string, access_token: string) => {
    const headers = {
        "Authorization": access_token,
    }
    try {
        return axios.delete(`${import.meta.env.VITE_SERVER_URL}/properties/${postId}`, {headers})
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}