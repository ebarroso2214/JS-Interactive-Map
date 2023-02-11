//Used part of the solution code provided as reference for production of this application. Furthermore, I also used the previous assignment as well to be able to replicate creating a map using .


const myMap = {
    coordinates : [],
    businesses: [],
    map: {},
    markers: {},
//creats objects + arrays pertaining to either businesses, coordinates, maps, and markers
    buildMap(){ //Function to construct the actual map
		this.map = L.map('map', { //uses the leaflet documentation to create map, and add properties such as the center and actual zoom of the map
            center: this.coordinates,
            zoom: 8,
            });
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '8', //minimum zoom is 8
            }).addTo(this.map) 
            
            const marker = L.marker(this.coordinates) //made const's to make sure their value is never changed
            marker
            .addTo(this.map) 
            .bindPopup('<p1><b>You are here</b><br></p1>')
            .openPopup()

    },
    
    
    addMarkers() {
		for (let i = 0; i < this.businesses.length; i++) { //iterates through the array of businesses 
		this.markers = L.marker([
			this.businesses[i].lat, //adds the coordinates latitude wise
			this.businesses[i].long, //adds coordinates longitude wise
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`) //When marker is pressed it will have the businesses actual name 
			.addTo(this.map) //adds it to the actual map, it
		}
	},

    

}

async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	}); //A promise that either resolves be returning the coordinates or rejects it if coordinates are not obtained. 
	return [pos.coords.latitude, pos.coords.longitude]
}

async function Foursquare(business) {
	const options = {
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3DQVOLhkAOS45v199mb4mOhbX3ULcWV9QcKLNgzRVio4='
		} 
	}
	let limit = 5 //this limits the amount of businesses that load on the map, this value can be changed if you so wish to change it here
	let lat = myMap.coordinates[0] //gets lat coords in the array which starts at index 0 
	let lon = myMap.coordinates[1] //gets long coords in the array which starts at index 1
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options) //fetch request to create string of objects from the api
	let data = await response.text() 
	let parsedData = JSON.parse(data) //parses data and turns it into object
	let businesses = parsedData.results 
	return businesses
}

function loadBusinesses(data) { 
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses //loads business data such as the name , coordinates lat + long wise 
}

window.onload = async () => {
	const coords = await getCoords() //invokes function to get coordinates on window load
	myMap.coordinates = coords 
	myMap.buildMap() //inokes the build map function
}

document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await Foursquare(business)
	myMap.businesses = loadBusinesses(data)
	myMap.addMarkers()
})

//document.getElementById('submit').addEventListener('click' essentially grabs the element with the id 'submit' from the html document and adds an event listener to it whenever the 'click' event happens a function is invoked in which it it will load a the specific type of business you choose in the option dropdown menu. For example, if you choose restaurants, all restaurants will load. If you choose Hotels, hotels will load on the map