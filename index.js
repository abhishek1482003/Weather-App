// to sabse phel mai ek function create karugna jo kis page ko dikhana hai ye control karta ho

// to sbse phle tabs ko fetch karna pdega
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// now variabel bhi guess karke ban lete hai
//initially vairables need????

let oldTab = userTab;
// mujhe pta hona chahiye kis tab par hu tabhi swithc kar paunga
// by default starting me ye userTab ke barabar hoga
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// current tab ke class list ke andar current tab wali class by default added rhegi
// basically yhi class jo currently visible ui hai uski property define karega
oldTab.classList.add("current-tab");
// hosakt hai data phel se maujud ho to ek baar call karke dek lo
getfromSessionStorage();

// now jab bhi kisi tab par click karenge tab switching hogi
// to do tabs hai dono par listener laga denga aur dono ek hi function ko call karenge
// input me clicked tab ka elment aa rkha hai
function switchTab(newTab) {
  // agar jo new clicked tab hai agar wo oldtab se diff hai tabhi change karna hoga
  if (newTab != oldTab) {
    // jo oldtab ak highlighted bg colour hai use htao
    oldTab.classList.remove("current-tab");
    // hum mere old tab ki value new tab ek barabar hogyi
    oldTab = newTab;
    // aur ab uske pcihe bg add kar diya
    oldTab.classList.add("current-tab");

    // now mai janna chahta hu ki mai kis tab ke andar kda hu search tab ke upar
    // ya your weather tab ek upar
    // to agar search form ek andar active nhi pda hua hai
    // to yhi clicked tab hai kyuki agar ye old tab hota to isme active pda hua hota
    // to mujhe isme active add krna hai
    if (!searchForm.classList.contains("active")) {
      //kya search form wala container is invisible, if yes then make it visible
      // agar class search form me nhi hai to in dono mese khi pr bhi hosakti hai thus inmese
      // remove kar do
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //main pehle search wale tab pr tha, ab your weather tab visible karna h
      searchForm.classList.remove("active");
      // search tab par kisi location ka tab visible hoga to use htana pdega
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
      //for coordinates, if we haved saved them there.
      //to mujhe ko default current location ka tab visible karana hai uske
      // coordinates maine current tab wale window ke seesion me store kar rkhe honge to wha se nikalne pdenge
      getfromSessionStorage();
    }
  }
}

// jab bhi koi userTab par click karega to switch tab ko call kardena
// with input userTab element
userTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
  // yha par user-coordinate humare dware given name hai un coordinates ko
  // thus ye change ho sakta hai
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //agar local coordinates nahi mile
    // yani location ka access nhi mila to mangna pdega
    grantAccessContainer.classList.add("active");
  } else {
    // agar coordinates hai to unke cooresponding data lao
    const coordinates = JSON.parse(localCoordinates);
    // ye funciotn use ke location coordinated ke basisi par uski weather info layega
    fetchUserWeatherInfo(coordinates);
  }
}

// isme api call hogi thus functio asynce hoga
// aslo jab mai api call karunga is function se yani abhi ui par merea
// grant access wala page hoga to usko hta kar loader dikhao
async function fetchUserWeatherInfo(coordinates) {
  // coordinates mese latitue aur logitude nikal liya
  const { lat, lon } = coordinates;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    // data aagya to loader hatao aur user weather dikhao
    loadingScreen.classList.remove("active");
    notFound.classList.remove("active");
    userInfoContainer.classList.add("active");
    // basically ye niche wale function ak kam bhi whi hai useer ka weither dikhana
    // ye function jo user ke data me information aayi hai usko userinfo container me bhejega
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    //HW
  }
}

function renderWeatherInfo(weatherInfo) {
  //fistly, we have to fethc the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherINfo object and put it UI elements
  // optional chaining operator ke bare me pdf addeda hai wo nested object properties ko access karna asan kar deta hai
  // hum iske dware json object ke andar kisi particular propety ko access kar sakte hai
  // agar wo propery object me exist nhi karti to ye chaining operator hume error show nhi karega hum undefined value dedga
  // user? yha par iska mtalab hua ki use ke andar jao ? chining operator hai joki bta rha hai user ke andar jao lekin
  // mujhe pta nhi hai ki wha par kuch pda hai ki nhi, agar wo chiz nhi mili to ? undefined return kar deta error ki jgh
  // aur . operator to objects ki property nesting ke liy hota hi hia
  // konsi property kha pr hai ye api call se pta chalta hia call karo aur
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position) {
  //  ye humen object bnaya hai
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  // ye current window session me data store karne ke liy use hua hai
  // stringigy string me convert karne ke liy use hota hai
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  // use ke weather ki information nikal lo
  fetchUserWeatherInfo(userCoordinates);
}

// jab bhi grant access button par click hoga do kam karna locatoin ko cooridnate then store in sessional storage
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const notFound = document.querySelector(".not-found");

const searchInput = document.querySelector("[data-searchInput]");

// jab bhi city name encter hoga
searchForm.addEventListener("submit", (e) => {
  // uske default functinalities ko remove karo
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

// ye function city name ke basisi par weather info lata hai
async function fetchSearchWeatherInfo(city) {
  // jab tak ye function data layega loader chalta rhega
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    if (data?.cod == 404) {
      notFound.classList.add("active");

    } else {
      notFound.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
  } catch (err) {
    console.log(err);
  }
}
