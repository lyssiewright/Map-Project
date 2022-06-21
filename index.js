const cityDisplayDiv = document.querySelector("#city-display");
const cityInfo = document.querySelector("#city-info");

const reviewsList = document.querySelector("#reviews-list")
const reviewForm = document.querySelector('#review-form');

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
    cities.forEach(city => {
        const cityList = document.querySelector('#city-list')
        const cityDiv = document.createElement("div");
        const cityName = document.createElement("h3");
        const cityImg = document.createElement("img");
        
        cityName.textContent = city.name;
        cityImg.src = city.images[0].sizes.thumbnail.url;

        cityDiv.addEventListener("click", () => {
            changeCityDisplay(city);
        })

        cityDiv.setAttribute("id", "city-nav");

        cityDiv.append(cityName, cityImg);
        cityList.append(cityDiv);
    })
}

const changeCityDisplay = city => {
    const newCityDisplayName = document.createElement("h1");
    const newCityDisplayImg = document.createElement("img");

    newCityDisplayName.textContent = city.name;
    newCityDisplayImg.src = city.images[0].sizes.original.url;
    newCityDisplayImg.id = 'new-city-image'


    const localHighlightsButton = document.createElement("button");
    localHighlightsButton.textContent = "Local Highlights";
    localHighlightsButton.className = "btn";

    localHighlightsButton.addEventListener("click", () => {
        getLocal(city.id);
    })

    const attractionsButton = document.createElement("button");
    attractionsButton.textContent = "Attractions";
    attractionsButton.className = "btn";

    attractionsButton.addEventListener("click", () => {
        getAttractions(city.id);
    })

    const localrestaurantButton = document.createElement("button");
    localrestaurantButton.textContent = "Local Restaurants";
    localrestaurantButton.className = "btn";

    localrestaurantButton.addEventListener('click', () => {
        getPlacesToEat(city.id);
    })
    
    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("id", "button-div");
    cityDisplayDiv.replaceChildren();
    cityInfo.replaceChildren();
    searchResults.replaceChildren();
    buttonDiv.append(localrestaurantButton, attractionsButton, localHighlightsButton);
    cityDisplayDiv.append(newCityDisplayName, newCityDisplayImg, buttonDiv);

    addReview(city.id);
    checkForReviews(city.id);
}

const renderLocalHighlights = data => {
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


function addReview(cityID){
    reviewsList.replaceChildren()
    const reviewsTitle = document.createElement("label")
    const textArea = document.createElement("textarea")
    textArea.setAttribute("id", "review")
    const submitButton = document.createElement("button")

    reviewsList.setAttribute("city-id", cityID)
    const title = document.createElement("h1");
      submitButton.className = "btn";

    submitButton.textContent = "Add Review"
    reviewsTitle.textContent = "Your Review"
    title.textContent = "Reviews"

    reviewsList.append(reviewsTitle,textArea,submitButton,title)
}

reviewForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    
    const cityID = reviewsList.getAttribute("city-id");
    const newReview = document.querySelector('#review').value
    renderReview(newReview);

    const reviewObj = {
        city: cityID,
        review: newReview
    }
    handleReviewDB(reviewObj)

    reviewForm.reset()
})

const renderReview = review => {
    const newCityReview = document.createElement('p')
    newCityReview.textContent = review

    reviewsList.append(newCityReview)
}

const handleReviewDB = review => {
    console.log(JSON.stringify(review))
    fetch("http://localhost:3000/reviews/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    })
    .then(res => res.json())
    .then(data => console.log(data));
}

const checkForReviews = cityID => {
    fetch("http://localhost:3000/reviews")
    .then(res => res.json())
    .then(data => {
        data.forEach(city => {
            if(city.city === cityID){
                renderReview(city.review)
            }
        })
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
    fetch(`https://www.triposo.com/api/20220104/location.json?countrycode=US&tag_labels=city&annotate=trigram:${citySearchInput.value}&trigram=>=0.3&count=5&fields=id,name,score,snippet,images,intro,names&order_by=-score&account=7GPWA5CT&token=8w8tduvc82ln7ebbx42bd1ugcd6hxbcw`)
    .then(res => res.json())
    .then(data => renderSearchResults(data.results));
}

const renderSearchResults = cities => {
    searchResults.replaceChildren();

    cities.forEach(city => {
        const cityDiv = document.createElement("div");
        const cityName = document.createElement("h3");
        const cityImg = document.createElement("img");

        cityName.textContent = `${city.name} (${city.names[city.names.length - 1]})`;
        cityImg.src = city.images[0].sizes.thumbnail.url;

        cityDiv.addEventListener("click", () => {
            changeCityDisplay(city);
        });

        cityDiv.append(cityName, cityImg);
        searchResults.append(cityDiv);
    })

    citySearch.reset();
}

getPOIs();
