import axios from 'axios';
import fetch from 'node-fetch'
import { Platform } from 'react-native';




export const fetchLocations = async (limit: number) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL;
    const response = await axios.get(`${url}/locations?limit=${limit}`);
    return response.data;

};

export const fetchLocationById = async (id: number) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL;
    console.log('id-> ', id);
    const response = await axios.get(`${url}/locations/${id}`);
    return response.data;

};