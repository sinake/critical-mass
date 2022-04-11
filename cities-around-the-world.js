/**
 * 
 * @param {*} cities - JSON list of cities
 */
const insertCities = ({ cities }) => {
  for(let city of cities) {
    const cityEl = `<li class='city'>${city.label}</li>`
    document.querySelector('.underline').insertAdjacentHTML('beforebegin', cityEl)
  }
}

/**
 * To show time of the selected city.
 * @param {string} cityName
 */
const showTime = (cityName) => {
  let timeApiUrl = ''
  switch (cityName) {
    case 'cupertino':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/America/Los_Angeles'
      break;
    case 'new york city':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/America/New_York'
      break;
    case 'london':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/Europe/London'
      break;
    case 'amsterdam':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/Europe/Amsterdam'
      break;
    case 'tokyo':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/Asia/Tokyo'
      break;
    case 'hong kong':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/Asia/Hong_Kong'
      break;
    case 'sydney':
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/Australia/Sydney'
      break;
    default:
      timeApiUrl = 'http://worldtimeapi.org/api/timezone/America/Los_Angeles'
  }

  /** Fetching time from world time API and updating DOM */
  fetch(timeApiUrl)
    .then(response => response.json())
    .then(cityTimeData => cityTimeData.datetime)
    .then(cityTime => {
      const timeString = cityTime.split('T')[1].split('.')[0]
      document.querySelector('h1').textContent = `The current time in ${cityName} is:`
      document.querySelector('.city-time').textContent = timeString
    })
    .catch(err => console.log(err))
} 

/**
 * When the city is clicked
 */
const cityClickHandler = () => {
  /** getting cities parent element's dimensions */
  const citiesListDimensions = document.querySelector('.cities-list').getBoundingClientRect()
  const citiesListLeft = citiesListDimensions.left
  
  /** getting city dimensions and adding in underline */ 
  document.querySelectorAll('.city').forEach(city => city.addEventListener('click', (e) => {
    const clickedCity = e.target
    const cityDimensions = clickedCity.getBoundingClientRect()
    const { width, left } = cityDimensions
    const cityWidth = width.toFixed(2)
    
    const cityLeft = left - citiesListLeft
    document.querySelector('.underline').setAttribute('style', `width: ${cityWidth}px; left: ${cityLeft.toFixed(2)}px;`)

    /**
     * This function is to select a new city.
     * @param {*} newCity - The city node which the user clicks.
     */
    const selectNewCity = (newCity) => {
      newCity.classList.add('selected')
      showTime(newCity.textContent.toLowerCase())
    }

    /** Logic for adding selected class */
    const currentlySelected = document.querySelector('.city.selected')
    if (currentlySelected) {
      if (currentlySelected !== clickedCity) {
        selectNewCity(currentlySelected, clickedCity)
        currentlySelected.classList.remove('selected')
        selectNewCity(clickedCity)
      }
    } else {
      selectNewCity(clickedCity)
    }
  }))
}

/** Final promise chain to get cities and show nav! */
fetch('navigation.json')
  .then(response => response.json())
  .then(citiesData => insertCities(citiesData))
  .then(cityClickHandler)
  .catch(err => console.log(err))
