async function setRenderBackground() {

    const result = await axios.get("https://picsum.photos/1920/1080", {
        responseType: "blob"
    })

    const data = URL.createObjectURL(result.data)
    document.querySelector("body").style.backgroundImage = `url(${data})` //css에서의 background-img를 동적으로 구현한것
}

function setTime() {
    setInterval(() => {
        const timer = document.querySelector(".timer")
        const timer0 = document.querySelector(".timer-wrapper0")
        const timercontent = document.querySelector(".timer-content")
        const data = new Date()
        let ttime = data.toLocaleTimeString().split(" ")[0];
        if (ttime === "오전") {
            ttime = "AM";
            timercontent.textContent = "Good Morning, Owen"
        }
        else if (ttime === "오후") {
            ttime = "PM";
            timercontent.textContent = "Beautiful evening, Owen"
        }
        timer.textContent = `${data.toLocaleTimeString().split(" ")[1]}`
        timer0.textContent = `${ttime}`

    }, 1000)
}

function getMemo(value) {
    const memo = document.querySelector(".memo")
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input")
    memoInput.addEventListener("keyup", function (e) {

        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value)
            getMemo(e.target.value);
            memoInput.value = "";
        }

    })
}

function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
}

function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

async function getWeather(lat, lon) {
    // console.log(lat, lon)

    if (lat && lon) {
        const data = axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e2f5d421764e18a1718bb2e3224e4536`)
        return data
    }

    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Gwangju&appid=e2f5d421764e18a1718bb2e3224e4536")
    return data
}

async function renderWeather() {
    let latitude = ""
    let longitude = "";

    try {
        const position = await getPosition();
        console.log(position)
        latitude = position.coords.latitude
        longitude = position.coords.longitude;
    }
    catch {

    }

    const result = await getWeather(latitude, longitude);
    const WeatherData = result.data;
    // console.log(WeatherData.list)
    // 배열이 너무 많아 오전 오후만 남길 수 있는 로직
    const Weatherlist = WeatherData.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) {
            acc.push(cur);
        }
        return acc;

    }, [])
    console.log(Weatherlist);
    const modalbody = document.querySelector(".modal-body")

    nowWeather(Weatherlist[0].weather[0].main);

    modalbody.innerHTML = Weatherlist.map((e) => {
        return weatherWraperComponet(e);
    }).join("")



}

function weatherWraperComponet(e) {
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1)
    return `
     <div class="card bg-transparent" style="width: 18rem;">
      <div class="card-header text-center">
        ${e.dt_txt.split(" ")[0]}
      </div>  
      <div class="card-body">
        <h5>${e.weather[0].main}</h5>
        <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
        <p class="card-text">${changeToCelsius(e.main.temp)}</p>
      </div>
    </div> 
    `
}

function nowWeather(e) {
    currentweather = document.querySelector(".modal-button")
    currentweather.style.backgroundImage = `url('${matchIcon(e)}')`
}

function matchIcon(WeatherData) {
    if (WeatherData === "Clear") return "./images/clear.png"
    if (WeatherData === "Clouds") return "./images/cloudy.png"
    if (WeatherData === "Rain") return "./images/rain.png"
    if (WeatherData === "Snow") return "./images/Snow.png"
    if (WeatherData === "Thunderstorm") return "./images/Thunderstorm.png"
    if (WeatherData === "Drizzle") return "./images/Drizzle.png"
    if (WeatherData === "Atomsphere") return "./images/043-warm.png"
}

renderWeather();
deleteMemo();
getMemo();
setMemo();
setTime();
setRenderBackground();
setInterval(() => {
    setRenderBackground();
}, 5000)






