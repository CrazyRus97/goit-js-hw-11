import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { fetchImages, PER_PAGE, API_KEY, BASE_URL } from './js/api';
import createMarkup from './js/createMarkup';

const formElement = document.querySelector('.search-form');
const galleryWrapperElement = document.querySelector('.gallery');
const spanElement = document.querySelector('.js-span');

formElement.addEventListener('submit', onSubmitSearch);

let currentPage = 1;
let value = '';
let totalHitsImg = 0;

function onLoad() {
    currentPage += 1;
    getImage();
}

function onSubmitSearch(e) {
    e.preventDefault();
    value = e.currentTarget.elements.searchQuery.value;
    if (!value) {
        message('Please write correct data!');
        return;
    }
    clearGallery();
    getImage();
}

async function getImage() {
  try {
    const resp = await fetchImages(currentPage, value);
    galleryWrapperElement.insertAdjacentHTML(
      'beforeend',
      createMarkup(resp.hits)
    );
    lightbox.refresh();
    if (resp.total === 0) {
      message('Please write correct data!');
      return;
    }
    totalHitsImg += resp.hits.length;
    if (totalHitsImg === resp.totalHits || totalHitsImg < 40) {
      spanElement.textContent =
        'Were sorry, but you ve reached the end of search results.';
      return;
    }
    if (totalHitsImg >  PER_PAGE) {
      const { height: cardHeight } =
        galleryWrapperElement.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    Report.failure('404', '');
    console.error(error);
  }
}

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const infiniteScroll = new InfiniteScroll(galleryWrapperElement, {
  responseType: 'json',
  history: false,
  status: '.scroll-status',
  path: function () {
    return `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${currentPage}`;
  },
})

infiniteScroll.on('load', onLoad);

infiniteScroll.on('error', () => Report.failure('404', ''));

function message(messageSrc) {
  Report.warning(`Warning!`, `${messageSrc}`);
}

function clearGallery() {
  totalHitsImg = 0;
  currentPage = 1;
  spanElement.innerHTML = '';
  galleryWrapperElement.innerHTML = '';
}