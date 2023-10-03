import axios from 'axios';

export default class GalleryService {
  constructor() {
    this.URL = 'https://pixabay.com/api/';
    this.KEY = '39789519-bfdb30523b7afb905fe29e8a0';
    this.PAGE = 1;
    this.PER_PAGE = 40;
    this.searchQuery = '';
  }

  async fetchPhoto() {
    const searchParams = new URLSearchParams({
      key: this.KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.PAGE,
      per_page: this.PER_PAGE,
    });
    const newParams = searchParams.toString();
    try {
      const response = await axios.get(`${this.URL}?${newParams}`);
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    } catch (error) {
        throw error;
    }
  }
  get page() {
    return this.PAGE;
  }
  set page(newPage) {
    this.PAGE = newPage;
  }

  incrementPage() {
    this.PAGE += 1;
  }

  resetPage() {
    this.PAGE = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}