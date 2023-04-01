window.onload = () => {
    getData('vancouver');
    document.querySelector('.toggleUnit').addEventListener('click',(()=>toggleUnit()));
    const search = document.querySelector('#search');
    document.querySelector('.searchButton').addEventListener('click',(()=>getData(search.value)));
}

const month = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

async function getData(city){
    try {
        const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d0e7be966690eee02e94ba24b5e31ab3`;
        console.log('fetching');
        const response = await fetch(query);
        console.log('parsing');
        const data = await response.json();
        console.log('displaying data now')
        display(data);
    } catch(err) {
        console.log(err);
    }
}

function display(info){
    localStorage.temperature = JSON.stringify(info.main);
    document.querySelector('.mainWeather').textContent = info.weather[0].description;
    changeUnits();
    const time = new Date();
    document.querySelector('.mainDate').textContent = `${time.getFullYear()} ${month[time.getMonth()]} ${time.getDate()}`;
    document.querySelector('.mainTime').textContent = `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`;
    document.querySelector('.location').textContent = `${info.name}, ${info.sys.country}`;

    const moreInfo = document.querySelectorAll('.details');
    moreInfo[1].textContent = `${info.main.humidity} %`;
    moreInfo[2].textContent = `${info.clouds.all} %`;
    moreInfo[3].textContent = `${info.wind.speed} m/s ${getDirection(info.wind.deg)}`;
}

function changeUnits(){
    const info = JSON.parse(localStorage.temperature);
    const unit = getUnit();
    document.querySelector('.mainTemperature').textContent = convert(info.temp,unit);
    document.querySelector('.details').textContent = convert(info.feels_like,unit);
}

function convert(temperature,unit) {
    return (unit==='c') ? `${(+temperature-273.15).toFixed(2)} °C` : `${((+temperature-273.15)*(9/5)+32).toFixed(2)} °F`;
}

function getUnit() {
    return (document.querySelector('.toggleUnit').getAttribute('data-unit') === "c") ? 'c' : 'f';
}

function toggleUnit(){
    const unit = document.querySelector('.toggleUnit');
    (getUnit()==='c') ? unit.setAttribute('data-unit','f') : unit.setAttribute('data-unit','c');
    changeUnits();
}

function getDirection(degree) {
    const direction = degree/90;
    return (direction === 0) ? 'N' :
    (direction === 1) ? 'E' :
    (direction === 2) ? 'S' :
    (direction === 3) ? 'W' :
    (direction > 3) ? 'NW' :
    (direction > 2 && direction < 3) ? 'SW' :
    (direction > 1 && direction < 2) ? 'SE' : 'NE'
}