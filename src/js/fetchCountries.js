export default function fetchCountries(query) {
  const URL = `https://restcountries.com/v3.1/name/${query}?fields=flags,name,capital,languages,population`;
  return fetch(URL);
}
