import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { fetchImages, PER_PAGE, API_KEY, BASE_URL } from './js/api';
import createMarkup from './js/createMarkup';

const formElement = document.querySelector('.search-form');
const galleryWrapperElement = document.querySelector('.gallery');
const spanElement = document.querySelector('.js-span');
const bottomElement = document.querySelector('.bottomElement');
const lastItem = document.querySelector('.gallery :last-child');

spanElement.classList.add('is-hidden')

formElement.addEventListener('submit', onSubmitSearch);

let currentPage = 1;
let value = '';
let totalHitsImg = 0;
let lightbox;

function onLoad() {
  currentPage += 1;
  getImage();
}

function onSubmitSearch(e) {
    e.preventDefault();
    spanElement.classList.add('is-hidden')
    value = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  if (!value) {
      clearGallery();
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

      if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery a', {
          captions: true,
          captionsData: 'alt',
          captionPosition: 'bottom',
          captionDelay: 250,
        });
      } else {
        lightbox.refresh();
      }

      if (resp.total === 0) {
        message('Please write correct data!');
        return;
    }
    
    totalHitsImg += resp.hits.length;
    console.log(totalHitsImg)
    spanElement.classList.remove('is-hidden')

      infiniteScroll.on('load', onLoad);
      infiniteScroll.on('error', () => Report.failure(`Stop searching. We found ${totalHitsImg} images.`, ''));
    
      intersectionObserver.observe(galleryWrapperElement);

      if (totalHitsImg === resp.totalHits || totalHitsImg < PER_PAGE) {
        infiniteScroll.off('load', onLoad);
        spanElement.classList.remove('is-hidden');
        spanElement.textContent = `End of the search. We found ${totalHitsImg} images.`;
        return;
      }
      if (totalHitsImg > PER_PAGE) {
        const { height: cardHeight } =
          galleryWrapperElement.firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
      }
  } catch (error) {
      Report.failure(`Stop searching - found ${totalHitsImg} images. Reload page, please.`, '');
      console.error(error);
    }
}


function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      getImage();
    }
  });
}
const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.5,
};
const intersectionObserver = new IntersectionObserver(handleIntersection, options);
// const infinite = new IntersectionObserver(([entry], observer) => {
//     if (entry.isIntersecting) {
//       observer.unobserve(entry.target);
//       getImage();
//     }
// });


const infiniteScroll = new InfiniteScroll(galleryWrapperElement, {
    responseType: 'json',
    history: false,
    status: '.scroll-status',
    path: function () {
      return `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${currentPage}`;
    },
})

function message(messageSrc) {
  Report.warning(`Warning!`, `${messageSrc}`);
}

function clearGallery() {
  totalHitsImg = 0;
  currentPage = 1;
  spanElement.innerHTML = '';
  galleryWrapperElement.innerHTML = '';
}