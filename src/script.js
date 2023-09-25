// import { Report } from 'notiflix/build/notiflix-report-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import InfiniteScroll from 'infinite-scroll';
// import { fetchImages, PER_PAGE, API_KEY, BASE_URL } from './js/api';
// import createMarkup from './js/createMarkup';

// const formElement = document.querySelector('.search-form');
// const galleryWrapperElement = document.querySelector('.gallery');
// const spanElement = document.querySelector('.js-span');
// const bottomElement = document.querySelector('.bottomElement');
// const lastItem = document.querySelector('.gallery :last-child');

// spanElement.classList.add('is-hidden')

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { photoSearch } from "./js/api";
import createMarkup from "./js/createMarkup";


const form = document.getElementById('search-form');
const inputValue = form.querySelector('input[name="searchQuery"]');
const btnElement = form.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const spanElement = document.querySelector('.js-span')

spanElement.classList.add('is-hidden')

btnElement.setAttribute("disabled", true);

const perPage = 40;
let currentPage = 1;
let totalHitsImg = 0;
let searchParam = '';

inputValue.addEventListener("input", inputSearch);
function inputSearch() {
  inputValue.value = event.currentTarget.value;
if (inputValue.value.length > 1 ) {
  btnElement.removeAttribute("disabled");
} else {
  btnElement.setAttribute("disabled", true);
  };
}

form.addEventListener('submit', onClick);

function onClick(e) {
  e.preventDefault();
  inputValue.removeEventListener("input",inputSearch)
  window.removeEventListener('scroll', handleScroll);
    
    searchParam = inputValue.value.trim().toLowerCase();
    if (!searchParam) {
       return
  };
    clearingPage();
  callRequest(searchParam);
  inputValue.value = '';
  inputValue.addEventListener("input", inputSearch);
  btnElement.setAttribute("disabled", true);
};

async function callRequest(param) {
  try {
      const resp = await photoSearch(param, perPage, currentPage);
      console.log("rrrrr", resp);
      let totalPage = Math.ceil(resp.totalHits / perPage);
      
      console.log('загальна кількість сторінок',totalPage);

        if (!resp.hits.length) {
            Notiflix.Notify.failure('Please write correct data!');
            return
        };

      totalHitsImg += resp.hits.length;
      let thisPage = Math.ceil(totalHitsImg / perPage);
      // console.log("поточна сторінка",thisPage);
      // console.log("к-сть зав карток",totalHitsImg);
      let totalCard = resp.total;
      
        if (totalHitsImg > totalCard || resp.totalHits < perPage) {
            Notiflix.Notify.info('There are no images on this topic!');
        }
        
      gallery.insertAdjacentHTML("beforeend", createMarkup(resp.hits));
      if (thisPage === 1) {
        Notiflix.Notify.success(`Total photos You can see = ${resp.totalHits}`);
      }

if (thisPage < totalPage) {
    window.addEventListener('scroll',handleScroll);
}

if (thisPage === totalPage) {
  searchParam = '';
  window.removeEventListener('scroll', handleScroll);
  if (thisPage !== 1) {
    spanElement.classList.remove('is-hidden')
    spanElement.textContent = `End of the search. We found ${totalHitsImg} images.`;
    Notiflix.Notify.info('All photos are downloaded.');
  }
}
      if (resp.totalHits > perPage  ) {
        if (totalCard > perPage) {
           const { height: cardHeight } = document
       
        gallery.firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });         };
      };

        if (totalCard > perPage) {
           const { height: cardHeight } = document
    
        gallery.firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });         };

        const lightbox = new SimpleLightbox('.gallery a', { animationSpeed: 300 });
    
        
    } catch (error) {
        console.log(error);
    }; 
}

function onPage() {
  currentPage += 1;
}

function clearingPage() {
  gallery.innerHTML = "";
  currentPage = 1;
  totalHitsImg = 0
};
 
function handleScroll() {
    // Отримуємо висоту сторінки
    const pageHeight = document.documentElement.scrollHeight;
    // Отримуємо висоту вікна перегляду
    const windowHeight = window.innerHeight;
    // Отримуємо поточну позицію прокрутки
    const scrollPosition = window.scrollY;

    if (scrollPosition + windowHeight >= pageHeight) {
        newFunction();
    }
}

function newFunction() {
  onPage()
  callRequest(searchParam)
}


