import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33300946-0122a5da3f7b887b7875e60e6';

export async function fetchImages(name, page = 1, per_page = 40) { 
  const response = axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
  return await response;
    
}