import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
// const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = '39579949-ce46c8eabb2900040151a1ef2';

async function serchingPhoto(searchParam, perPage, page) {
    try {
    const response = await axios.get(`?key=${API_KEY}&q=${searchParam}
      &image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
        return response.data;
  } catch (error) {
        console.log(error.message);
    }; 
};

export { serchingPhoto }