import './sass/index.scss'
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



let lightBox = new SimpleLightbox('.gallery a');
let page = 1;

const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.button_load');
const form = document.getElementById("search-form");

btn.style.display = 'none';
form.addEventListener('submit', searchFormSubmit);
btn.addEventListener('click', onClick);

async function searchFormSubmit(event){
  event.preventDefault();
  let inputValue = form.elements.searchQuery.value.trim();
  page = 1;
  cleanGallary();
  if(!inputValue){
      return
  };
  if (!inputValue) {
        Notiflix.Notify.warning('Please enter a search term');
    cleanGallary();
    btn.style.display = 'block';
    return;
  }

try{
  const pages = await fetchImages(inputValue, page)
  let totalHits = pages.data.totalHits;     
    renderImage(pages.data.hits)
    lightBox.refresh();
    btn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
} catch (error) {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}};


function renderImage(images) {
  const markup = images
    .map(({ webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,}) => {
      return `<div class="photo-card">
      <a href="${largeImageURL}">
      <img class="photo" src="${webformatURL}" 
      alt="${tags}" loading="lazy"/>
      <div class="info">
      <p class="info-item">
      <b>Likes</b>
      <span class="info-item"> ${likes}</span>
      </p>
       <p class="info-item">
       <b>Views</b> <span class="info-item">${views}</span>  
       </p>
       <p class="info-item">
           <b>Comments</b>
           <span class="info-item">${comments}</span>  
       </p>
       <p class="info-item">
           <b>Downloads</b>
           <span class="info-item">${downloads}</span> 
       </p>
    </div>
      </a>
    
    </div>
    `;
    })
    .join("");
    return gallery.insertAdjacentHTML('beforeend', markup)
}




async function onClick(){
  page ++;
  const inputValue = form.elements.searchQuery.value.trim();
try{
  const pages = await fetchImages(inputValue, page)
  const pageAll = pages.data.totalHits ;
    if (page > pageAll) {
      Notiflix.Notify.info('Were sorry, but you ve reached the end of search results.');    
        form.reset();
        btn.style.display = 'none';
    }
    renderImage(pages.data.hits)
    lightBox.refresh();
    btn.style.display = 'block';
} catch (error) {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}};

function cleanGallary(){
  gallery.innerHTML = '';
  btn.style.display = 'none';
}