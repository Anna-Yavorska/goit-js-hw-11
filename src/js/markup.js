import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionsDelay: 250,
});

export function renderMarkupPhotos(data, refs) {
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
