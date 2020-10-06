// https://guides.superhi.com/advanced/jiffy#/10
const API_KEY = "6b7395b9d50a4660a22913fd5e0237ed"
//const for input value
const searchEl = document.querySelector(".search-input")
//applies curser click focus on form field
searchEl.focus()
//const for hint location div
const hintEL = document.querySelector(".search-hint")
//grad video div via class title
const videoEL = document.querySelector('.videos')
//grab clear search button
const clearEL = document.querySelector('.search-clear')

//https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  //returns index value of json data from giffy 
  return arr[randIndex];
};


//pull src from fetch function
const createVideo = src => {
  //creates an HTML eliminate
  const video = document.createElement("video")
  //sets the sourse of the video to our src constant above
  video.src = src
  video.autoplay = true
  video.loop = true
  //add css class, overrides any current class
  video.className = "video"
  console.log(video)
  //tells the function to give us something back
  return video
}

//when we search, show loading spinner
//when it works, change to "see more"
//if error, let the user know of error 
const toggleLoading = state => {
  console.log("we are loading", state)
  //if state is true - add loading class, else remove it
  //if statements check for true first with out declaring it 
  if (state) {
    //turn on spinner
    document.body.classList.add("loading")
    //disables the ability to change (input interaction) the search term without clearing search. 
    searchEl.disabled = true
  } else {
    //turn of spinner
    document.body.classList.remove("loading")
    //if no active search toggle ability to interact with search input
    searchEl.disabled = false
    searchEl.focus()

  }
}

//pass searchTerm as argument to searchGiphy function
//searches for gif when function runs
const searchGiphy = searchTerm => {
  //run loading function with true value - turns on spinner
  toggleLoading(true)
  console.log("search for", searchTerm)
  //use backticks to insert variables
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=R&lang=en`)
  //use .then to handel response from api fetch
  .then(response => {
    // convert response to json
    return response.json();
    // use .then to handel json Data
  })
  .then(json => {
    // json data is something we can work with
    console.log(json);
    //runs randomChoice function with argument of json.data
    //assigns gif to random index from giffy 
    const gif = randomChoice(json.data)
    console.log(gif)
    //look in 1st result and grab original mp4 url
    const src = gif.images.original.mp4
    console.log(src)
    //uses the createVideo function with the src attribute
    //the createVideo function returns the video element  
    const video = createVideo(src)
    //appendChild adds element after last child element
    //add video from createVideo function
    videoEL.appendChild(video)

      //listen for when video id done loading
      video.addEventListener('loadeddata', event => {
      //then add class of visible to video
      video.classList.add('visible')
      //run loading function with false value - turns off spinner
      toggleLoading(false)
      //toggle close button
      document.body.classList.add('has-results')
      //changes hint text 
      hintEL.innerHTML = `Hit enter to see more ${searchTerm}`
      })

   })
  .catch(error => {
    // .catch() will do something in case our fetch fails
    console.log("Search Failed")
    //toggle loading state off
    toggleLoading(false)
    //update hint
    hintEL.innerHTML = `Nothing found for ${searchTerm}`
  })
}








//separate out the keyup function to call it from various places in the code
//uses event data from keyup 
const doSearch = event => {
  //value of input of event 
  const searchTerm = searchEl.value
  //show hint when longer then 2
  if (searchTerm.length > 2) {
    //pass in html to hint div
    hintEL.innerHTML = `Hit enter to search ${searchTerm}`
    //toggle css to show hint
    document.body.classList.add('show-hint')
  } else {
    //toggle css to hide hint
    document.body.classList.remove('show-hint')
  }
  //run search when longer then 2 characters and press enter
  if (event.key === 'Enter' && searchEl.value.length > 2) {
    //run search function with search value
    searchGiphy(searchTerm)
  }
}

//ot using event data but this function is related 'click' event
const clearSearch = event => {
  //removes class the makes clear button visible 
  document.body.classList.remove('has-results')
  //removes content of video - set to empty string
  videoEL.innerHTML = ""
  //removes content of hint
  hintEL.innerHTML = ""
  //form values dont use innerHTML
  searchEl.value = ""
  //forces click on form field
  searchEl.focus()
}

//Listen for escape key globally
document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    //run clear search function
    clearSearch()
  }
})

//listen for keyUp event on searchEL, then preform function doSearch
searchEl.addEventListener('keyup', doSearch)
//when you click the clear button run clearSearch function
clearEL.addEventListener('click', clearSearch)

