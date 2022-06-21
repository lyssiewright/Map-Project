const cityDisplayDiv = document.querySelector("#city-display");
const cityInfo = document.querySelector("#city-info");
const citySearch = document.querySelector("#city-search");
const citySearchInput = document.querySelector("#city-search-input");
const searchDiv = document.querySelector(".search-container");
const searchResults = document.querySelector("#search-results");

const getPOIs = () => {
    fetch("https://www.triposo.com/api/20220104/location.json?part_of=United_States&tag_labels=city&count=10&order_by=-score&fields=name,id,snippet,parent_id,score,type,images,coordinates,intro&account=7GPWA5CT&token=8w8tduvc82ln7ebbx42bd1ugcd6hxbcw")
    .then(res => res.json())
    .then(data => renderCitiesNav(data.results));
}

const getPlacesToEat = cityID => {
    fetch(`https://www.triposo.com/api/20220104/poi.json?location_id=${cityID}&tag_labels=eatingout&count=10&fields=id,name,score,intro,tag_labels,best_for,images,snippet&order_by=-score&account=7GPWA5CT&token=8w8tduvc82ln7ebbx42bd1ugcd6hxbcw`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        renderRestaurant(data);
    });
}

const getAttractions = cityID => {
    fetch(`https://www.triposo.com/api/20220104/poi.json?location_id=${cityID}&tag_labels=!eatingout&count=10&fields=id,name,score,intro,tag_labels,images&order_by=-score&account=7GPWA5CT&token=8w8tduvc82ln7ebbx42bd1ugcd6hxbcw`)
    .then(res => res.json())
    .then(data => renderAttractions(data));
}

const getLocal = cityID => {
    fetch(`https://www.triposo.com/api/20220104/poi.json?account=7GPWA5CT&token=8w8tduvc82ln7ebbx42bd1ugcd6hxbcw&location_id=${cityID}&tag_labels=character-Popular_with_locals&order_by=-character-Popular_with_locals_score&fields=id,name,snippet,images,coordinates,intro`)
    .then(res => res.json())
    .then(data => renderLocalHighlights(data));
}

const renderCitiesNav = cities => {
    console.log(cities);
    cities.forEach(city => {
        const cityDiv = document.createElement("div");
        const cityName = document.createElement("h1");
        const cityImg = document.createElement("img");
        
        cityName.textContent = city.name;
        cityImg.src = city.images[0].sizes.thumbnail.url;

        cityDiv.addEventListener("click", () => {
            changeCityDisplay(city);
        })

        cityDiv.append(cityName, cityImg);
        document.body.append(cityDiv);
    })
}

const changeCityDisplay = city => {
    console.log(city);

    const newCityDisplayName = document.createElement("h1");
    const newCityDisplayImg = document.createElement("img");

    newCityDisplayName.textContent = city.name;
    newCityDisplayImg.src = city.images[0].sizes.medium.url;

    const localHighlightsButton = document.createElement("button");
    localHighlightsButton.textContent = "Local Highlights";

    localHighlightsButton.addEventListener("click", () => {
        getLocal(city.id);
    })

    const attractionsButton = document.createElement("button");
    attractionsButton.textContent = "Attractions";

    attractionsButton.addEventListener("click", () => {
        getAttractions(city.id);
    })

    const localrestaurantButton = document.createElement("button");
    localrestaurantButton.textContent = "Local Restaurants";

    localrestaurantButton.addEventListener('click', () => {
        getPlacesToEat(city.id);
    })

    cityDisplayDiv.replaceChildren();
    cityInfo.replaceChildren();
    cityDisplayDiv.append(newCityDisplayName, newCityDisplayImg, localrestaurantButton, attractionsButton, localHighlightsButton);
}

const renderLocalHighlights = data => {
    console.log(data);

    cityInfo.replaceChildren();

    data.results.forEach(highlight => {
        console.log(highlight);
        const localDiv = document.createElement("div");
        const localName = document.createElement("h3");
        const localDesc = document.createElement("p");

        localName.textContent = highlight.name;
        localDesc.textContent = highlight.intro;

        localDiv.append(localName, localDesc);
        cityInfo.append(localDiv);
    });
}

const renderAttractions = data => {
    cityInfo.replaceChildren();

    data.results.forEach(attraction => {
        
        const attractionDiv = document.createElement("div");
        const attractionName = document.createElement("h3");
        const attractionDesc = document.createElement("p");

        attractionName.textContent = attraction.name;
        attractionDesc.textContent = attraction.intro;

        attractionDiv.append(attractionName, attractionDesc);
        cityInfo.append(attractionDiv);
    });
}

const renderRestaurant = data => {
    cityInfo.replaceChildren();
    data.results.forEach(restaurant => {
        const restaurantDiv = document.createElement('div');
        const restaurantName = document.createElement('h3');
        const restaurantSnippet = document.createElement('p');
        const restaurantScore = document.createElement ('p');
        // const restaurantImage = document.createElement ('div');
        const restaurantIntro = document.createElement('p');
        const score = restaurant.score.toFixed(0);

        restaurantName.textContent = restaurant.name;
        restaurantSnippet.textContent = restaurant.snippet;
        restaurantScore.textContent = ("Score: " + score);
        // restaurantImage.setAttribute('src', restaurant.images[0].source_url);
        // restaurantImage.src = restaurant.images[0].sizes.thumbnail.url;
        restaurantIntro.textContent = restaurant.intro;

        restaurantDiv.append (restaurantName, restaurantSnippet, restaurantScore, restaurantIntro);
        cityInfo.appendChild(restaurantDiv)
        console.log(data.results) 
    })
}

citySearch.addEventListener("submit", event => {
    event.preventDefault();
    handleSearch();
})

const handleSearch = () => {
    console.log(citySearchInput.value);
    fetch(`https://www.triposo.com/api/20220104/location.json?countrycode=US&tag_labels=city&annotate=trigram:${citySearchInput.value}&trigram=>=0.3&count=5&fields=id,name,score,country_id,parent_id,snippet,images,coordinates,intro&order_by=-score&account=7GPWA5CT&token=8w8tduvc82ln7ebbx42bd1ugcd6hxbcw`)
    .then(res => res.json())
    .then(data => renderSearchResults(data.results));
}

const renderSearchResults = cities => {
    searchResults.replaceChildren();

    cities.forEach(city => {
        console.log(city);
        const cityDiv = document.createElement("div");
        const cityName = document.createElement("h3");
        const cityImg = document.createElement("img");

        cityName.textContent = `${city.name}, ${city.parent_id}`;
        cityImg.src = city.images[0].sizes.thumbnail.url;

        cityDiv.addEventListener("click", () => {
            changeCityDisplay(city);
        });

        cityDiv.append(cityName, cityImg);
        searchResults.append(cityDiv);
    })
}

getPOIs();