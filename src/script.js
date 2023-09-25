import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { serchingPhoto } from "./js/api";
import createMarkup from "./js/createMarkup";


const formElement = document.getElementById('search-form');
const inputValue = formElement.querySelector('input[name="searchQuery"]');
const btnElement = formElement.querySelector('button[type="submit"]');
const galleryWrapperElement = document.querySelector('.gallery');
const spanElement = document.querySelector('.js-span')

spanElement.classList.add('is-hidden')
btnElement.setAttribute("disabled", true);

const perPage = 40;
let currentPage = 1;
let totalHitsImg = 0;
let searchValue = '';
let lightbox;

inputValue.addEventListener("input", inputSearch);

function inputSearch() {
if (inputValue.value.length > 1 ) {
  btnElement.removeAttribute("disabled");
} else {
  btnElement.setAttribute("disabled", true);
  };
}

formElement.addEventListener('submit', onSubmitSearch);

function onSubmitSearch(e) {
  e.preventDefault();
  inputValue.removeEventListener("input",inputSearch)
  window.removeEventListener('scroll', handScrolling);  
  searchValue = inputValue.value.trim().toLowerCase();
  if (!searchValue) {
      return
  };
  clearGallery();
  getImage(searchValue);
  inputValue.value = '';
  inputValue.addEventListener("input", inputSearch);
  btnElement.setAttribute("disabled", true);
};

async function getImage(photo) {
  try {
      const resp = await serchingPhoto(photo, perPage, currentPage);
      let totalPages = Math.ceil(resp.totalHits / perPage);

      if (!resp.hits.length) {
          Notiflix.Notify.failure('Please write correct data!');
          return
      };

      totalHitsImg += resp.hits.length;
      let thisPage = Math.ceil(totalHitsImg / perPage);
      let totalCard = resp.total;
    
    //Checking end of search  
      if (totalHitsImg > totalCard || resp.totalHits < perPage) {
          Notiflix.Notify.info('There are no more images on this data!');
      }
      
      galleryWrapperElement.insertAdjacentHTML("beforeend", createMarkup(resp.hits));
    
    //Checking page
      if (thisPage === 1) {
        Notiflix.Notify.success(`Total photos You can see = ${resp.totalHits}`);
      }
      if (thisPage < totalPages) {
          window.addEventListener('scroll',handScrolling);
      }
      if (thisPage === totalPages) {
          searchValue = '';
          window.removeEventListener('scroll', handScrolling);
          if (thisPage !== 1) {
              spanElement.classList.remove('is-hidden')
              spanElement.textContent = `End of the search. We found ${totalHitsImg} images.`;
              Notiflix.Notify.info('All photos are downloaded.');
          }
      }
    
      if (resp.totalHits > perPage  ) {
        if (totalCard > perPage) {
            const { height: cardHeight } = document
            galleryWrapperElement.firstElementChild.getBoundingClientRect();
            window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
        };
      };
    
      if (totalCard > perPage) {
           const { height: cardHeight } = document
           galleryWrapperElement.firstElementChild.getBoundingClientRect();
           window.scrollBy({
           top: cardHeight * 2,
           behavior: "smooth",
           });
        };
    
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
    
  } catch (error) {
    console.log(error);
  }; 
}

function clearGallery() {
  galleryWrapperElement.innerHTML = "";
  spanElement.innerHTML = '';
  currentPage = 1;
  totalHitsImg = 0
};

function onPage() {
  currentPage += 1;
}

function onLoad() {
  onPage()
  getImage(searchValue)
}
 
function handScrolling() {
  const pageHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollPosition = window.scrollY;
  if (scrollPosition + windowHeight >= pageHeight) {
    onLoad();
  }
}