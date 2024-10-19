const heading = document.getElementById("heading");
const desc = document.getElementById("description");
const temp = document.getElementById("temp");
const day = document.getElementById("day");
const condition = document.getElementById("condition")
const precipitation = document.getElementById("precipitation");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");


let convertTemp = (f => (f - 32) * 5 / 9)

function formatCurrentDateTime() {
    const now = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[now.getDay()];
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const modifier = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedDateTime = `${dayName}, ${hours}:${formattedMinutes} ${modifier}`;

    return formattedDateTime;
}
const userDayTime = formatCurrentDateTime();
day.innerText = userDayTime;

let userLatitude = null;
let UserLongitude = null;
let locationError = null;
const apikey = "4BAT67QVMGGRXNKWWKAUVSTKT";




let getUserData = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLatitude = position.coords.latitude;
            UserLongitude = position.coords.longitude;
            desc.innerText = "Please wait .......";
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLatitude}&lon=${UserLongitude}&format=json`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    heading.innerText = `${data.address.city}, ${data.address.state_district} ${data.address.state}`

                })
            fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userLatitude},${UserLongitude}?key=${apikey}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    desc.innerText = data.description;
                    temp.innerText = `${Math.floor(convertTemp(data.currentConditions.temp))}°C`;
                    condition.innerText = data.currentConditions.conditions;
                    humidity.innerText = data.currentConditions.humidity;
                    precipitation.innerText = data.currentConditions.precip;
                    wind.innerText = `${data.currentConditions.windspeed} Km/h`;
                    let sunr = data.currentConditions.sunrise.split(':');
                    sunrise.innerText = `${sunr[0]}:${sunr[1]} a.m.`;
                    let suns = data.currentConditions.sunset.split(':');
                    sunset.innerText = `${suns[0] % 12}:${suns[1]} p.m.`;
                    const xValues = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM']
                        ;
                    const yValues = [];

                    data.days[0].hours.forEach(hour => yValues.push(convertTemp(hour.temp)));
                    const minValue = Math.min(...yValues) - 1;

                    const xhumidValues = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
                    const yhumidValues = [];

                    for (let i = 0; i < 24; i += 3) {
                        let hum = data.days[0].hours[i].humidity;
                        yhumidValues.push(hum);
                    }
                    let barColors = "#7f69ff";

                    let hourlyChart = document.getElementById("hourlyChart").getContext('2d');
                    new Chart(hourlyChart, {
                        type: "line",
                        data: {
                            labels: xValues,
                            datasets: [{
                                label: "Temprature in Celsius",
                                fill: false,
                                lineTension: 0,
                                backgroundColor: "rgba(0,0,255,1.0)",
                                borderColor: "rgba(0,0,255,0.1)",
                                data: yValues
                            }]
                        },
                        options: {
                            legend: { display: false },
                            scales: {
                                min: minValue,

                            }
                        }
                    });
                    let humidityChart = document.getElementById("humdityChart").getContext('2d');
                    new Chart(humidityChart, {
                        type: "bar",
                        data: {
                            labels: xhumidValues,
                            datasets: [{
                                axis: 'y',
                                label: "Humidity",
                                data: yhumidValues,
                                backgroundColor: barColors,
                                borderWidth: 1,
                                borderRadius: "12px", // Set the border radius for the bars
                                barThickness: 15,
                            }]

                        },
                        options: {
                            indexAxis: 'y',
                        }
                    })
                })

            console.log(userLatitude, UserLongitude);
        },
            (error) => {
                locationError = "Unable to get your Location";
            })
    }
    else {
        locationError = "Your browser doesn't supports geolocation";
    }
}
console.log(userLatitude, UserLongitude);
console.log(locationError);

getUserData();

// console.log(getUserLocation());