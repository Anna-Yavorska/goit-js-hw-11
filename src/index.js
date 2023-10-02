import GalleryService from './service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  showMore: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionsDelay: 250,
});

refs.searchForm.addEventListener('submit', createGallery);
refs.showMore.addEventListener('click', moreSearch);

const galleryService = new GalleryService();

function createGallery(e) {
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
  galleryService.fetchPhoto().then(data => {
    const { hits, totalHits } = data;
    if (hits.length === 0) {
      clearAll();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    refs.showMore.style.display = 'block';

    renderMarkupPhotos(data);
    Notify.success(`Hooray! We found ${totalHits} images.`);
  });
}

function moreSearch() {
  galleryService.incrementPage();

  galleryService.fetchPhoto().then(data => {
    const { totalHits } = data;
    renderMarkupPhotos(data);
    if (totalHits <= galleryService.PER_PAGE * galleryService.PAGE) {
      refs.showMore.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  });
}

function clearAll() {
  refs.showMore.style.display = 'none';
  refs.gallery.innerHTML = '';
}

function renderMarkupPhotos(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a href=${largeImageURL}>
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" width = '300px' />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
          : ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
          : ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
          : ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
          : ${downloads}
          </p>
        </div>
        </a>
        `
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

