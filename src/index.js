import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
let inputQuery = '';

const inputField = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  inputQuery = evt.target.value.trim();
  fetchCountries(inputQuery)
    .then(response => {
      if (!response.ok) {
        resetCountryCard();
        resetCountryList();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(countries => {
      console.log(countries);

      if (countries.length > 10) {
        resetCountryCard();
        resetCountryList();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        resetCountryCard();
        createCountrieslistMarkup(countries);
      } else if (countries.length === 1) {
        resetCountryList();
        createCountryCardMarkup(countries);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function resetCountryCard() {
  countryCard.innerHTML = '';
}

function resetCountryList() {
  countryList.innerHTML = '';
}

function createCountrieslistMarkup(countries) {
  const listMarkup = countries
    .map(country => {
      return `<p>
        <span class="country-flag">
        <img src="${country.flags.svg}" width="25px" height="20px" align="center">
        </span> <b>${country.name.official}</b>
        </p>`;
    })
    .join(``);
  countryList.innerHTML = listMarkup;
}

function createCountryCardMarkup(countries) {
  const cardMarkup = countries
    .map(country => {
      return `<div class="country-card">
    <p class="country-name">
        <span class="country-flag">
        <img src="${country.flags.svg}" width="40px" height="30px ">
        </span> <b>${country.name.official}</b>
    </p>
    <ul class="list">
    <li>
    <p class="decription-text"> <b>Capital:</b> ${country.capital}</p>
    </li>
    <li>
    <p class="decription-text"> <b>Population:</b> ${country.population}</p>
    </li>
    <li>
    <p class="decription-text"> <b>Languages:</b> ${Object.values(
      country.languages
    )}</p>
    </li>
    </ul>
</div>`;
    })
    .join(``);
  countryCard.innerHTML = cardMarkup;
}
