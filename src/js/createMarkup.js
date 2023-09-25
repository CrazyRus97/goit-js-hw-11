// export default function createMarkup(photosArr) {
//     return photosArr
//       .map(
//         ({
//           webformatURL,
//           largeImageURL,
//           likes,
//           views,
//           tags,
//           comments,
//           downloads,
//         }) => {
//           return `
//           <div class="photo-box">
//               <a class="gallery_link" href="${largeImageURL}">
//                 <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//               </a>
//               <ul class="photo-info list">
//                 <li class="photo-info-item">
//                   <p class="photo-info-tag-name photo-info-tag">Likes:</p>
//                   <p class="photo-info-tag-value photo-info-tag">${likes}</p>
//                 </li>
//                 <li class="photo-info-item">
//                   <p class="photo-info-tag-name photo-info-tag">Views:</p>
//                   <p class="photo-info-tag-value photo-info-tag">${views}</p>
//                 </li>
//                 <li class="photo-info-item">
//                   <p class="photo-info-tag-name photo-info-tag">Comments:</p>
//                   <p class="photo-info-tag-value photo-info-tag">${comments}</p>
//                 </li>
//                 <li class="photo-info-item">
//                   <p class="photo-info-tag-name photo-info-tag">Downloads:</p>
//                   <p class="photo-info-tag-value photo-info-tag">${downloads}</p>
//                 </li>
//               </ul>
//           </div>
//           <style>
//           </style>`;
//         }
//       )
//       .join('');
// }


export default function createMarkup(photosArr) {
    return photosArr.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
            return `<div class="photo-box">
  <a class="gallery__link" href="${largeImageURL}">
    <img src="${webformatURL}" width="300" alt="${tags}" loading="lazy" />
  </a>
              <ul class="photo-info list">
                <li class="photo-info-item">
                  <p class="photo-info-tag-name photo-info-tag">Likes:</p>
                  <p class="photo-info-tag-value photo-info-tag">${likes}</p>
                </li>
                <li class="photo-info-item">
                  <p class="photo-info-tag-name photo-info-tag">Views:</p>
                  <p class="photo-info-tag-value photo-info-tag">${views}</p>
                </li>
                <li class="photo-info-item">
                  <p class="photo-info-tag-name photo-info-tag">Comments:</p>
                  <p class="photo-info-tag-value photo-info-tag">${comments}</p>
                </li>
                <li class="photo-info-item">
                  <p class="photo-info-tag-name photo-info-tag">Downloads:</p>
                  <p class="photo-info-tag-value photo-info-tag">${downloads}</p>
                </li>
              </ul>
    </p>
    </div>
    </div>`
        }).join("");
};
