import GalleryService from './js/service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { renderMarkupPhotos } from './js/markup';

refs.searchForm.addEventListener('submit', createGallery);
refs.showMore.addEventListener('click', moreSearch);

const galleryService = new GalleryService();

async function createGallery(e) {
  e.preventDefault();
  galleryService.searchQuery = e.currentTarget.elements.searchQuery.value;
  clearAll();
  if (galleryService.query === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  galleryService.resetPage();
  try {
    const data = await galleryService.fetchPhoto();
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      clearAll();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderMarkupPhotos(data, refs);
    if (data.hits.length >= galleryService.PER_PAGE) {
      refs.showMore.style.display = 'block';
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    console.log(error);
  }
}

async function moreSearch() {
  galleryService.incrementPage();
  try {
    const data = await galleryService.fetchPhoto();
    const { totalHits } = data;
    renderMarkupPhotos(data, refs);
    if (totalHits <= galleryService.PER_PAGE * galleryService.PAGE) {
      refs.showMore.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

function clearAll() {
  refs.showMore.style.display = 'none';
  refs.gallery.innerHTML = '';
}

