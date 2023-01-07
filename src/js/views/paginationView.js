import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);

      const goToPage = btn.dataset.goto;
      // console.log(goToPage);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = +this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // console.log('numofpages:', numOfPages);
    // console.log('currentpage:', currentPage); // testing

    // Page 1 and there are other pages
    // prettier-ignore
    if (currentPage === 1 && numOfPages > 1) {
      return `
      <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
      `; 
    }

    // Last page
    if (currentPage === numOfPages && numOfPages > 1) {
      // prettier-ignore
      return `
      <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
      `;
    }

    // Other page
    if (currentPage < numOfPages) {
      // prettier-ignore
      return `
      <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
    
      <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }

    // Page 1 and there are NO other pages
    return '';
  }
}

export default new PaginationView();
