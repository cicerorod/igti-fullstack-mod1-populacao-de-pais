let tabCountries = null;
let tabFavorites = null;
let allCountries = [];
let favoriteCountries = [];
let countCountries = 0;
let countFavorites = 0;
let totalPopulationList = 0;
let totalPopulationFavorites = 0;
let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');
  //prettier-ignore
  totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');
  numberFormat = Intl.NumberFormat('pt-br');
  //fetchCountries();
  fetchCountriesAsyncAwait();
});

function fetchCountries() {
  fetch('https://restcountries.eu/rest/v2/all')
    .then((res) => res.json())
    .then((json) => {
      allCountries = json;
      console.log(allCountries);
    })
    .catch((error) => {
      console.log('erro de requisição da url');
    });
}

async function fetchCountriesAsyncAwait() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;

    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: FormatNumber(population),
      flag: flag,
    };
  });

  //favoriteCountries = allCountries;

  render();
}

function render() {
  renderCountryList();
  renderFarorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, id, flag, population, formattedPopulation } = country;

    const countryHTML = `
      <div class ='country'>
        <div> 
          <a id="${id}" class ="waves-effect waves-light btn">+</a> 
        </div>
        <div> 
          <img src="${flag}" alt ="name"> 
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul> 
        </div>
      </div>        
    `;
    countriesHTML += countryHTML;
  });

  // countriesHTML += '/<div>';
  tabCountries.innerHTML = countriesHTML;
}

function renderFarorites() {
  let favoritesHTML = '<div>';
  favoriteCountries.forEach((country) => {
    const { name, id, flag, population, formattedPopulation } = country;

    const favoritecountryHTML = `
      <div class ='country'>
        <div> 
          <a id="${id}" class ="waves-effect waves-light btn red darken-4">+</a> 
        </div>
        <div> 
          <img src="${flag}" alt ="name"> 
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul> 
        </div>
      </div>        
    `;
    favoritesHTML += favoritecountryHTML;
  });
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulationAllCountries = allCountries.reduce(
    (accumulator, current) => {
      return accumulator + current.population;
    },
    0
  );

  const totalPopulationFavoriteCountries = favoriteCountries.reduce(
    (accumulator, current) => {
      return accumulator + current.population;
    },
    0
  );

  totalPopulationFavorites.textContent = FormatNumber(
    totalPopulationFavoriteCountries
  );
  totalPopulationList.textContent = FormatNumber(totalPopulationAllCountries);
}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });

  // console.log(countryButtons);
  // console.log(favoriteButtons);
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);
  favoriteCountries = [...favoriteCountries, countryToAdd];
  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  allCountries = allCountries.filter((country) => country.id !== id);
  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find(
    (country) => country.id === id
  );
  allCountries = [...allCountries, countryToRemove];
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);
  render();
}

function FormatNumber(number) {
  return numberFormat.format(number);
}
