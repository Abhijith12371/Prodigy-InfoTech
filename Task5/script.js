async function whetherData(city){

    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6cf0332343b098d4f43241220b91f9e2&units=metric`)
    nData=await response.json()
    console.log(nData)
    let temp=document.querySelector(".temp")
    let cityName=document.querySelector(".cityname")
    let Humidity=document.querySelector(".hum")
    let WindSpeed=document.querySelector(".wind")
    let WhetherImg=document.querySelector(".whetherImg")
    let Contents=document.querySelector(".whetherContainer")
    temp.innerHTML=`${nData.main.temp}°C`
    cityName.innerHTML=nData.name
    Humidity.innerHTML=nData.main.humidity
    WindSpeed.innerHTML=nData.wind.speed

    if(nData.weather[0].main=="Mist"){
        console.log("mist")
        WhetherImg.src="images/mist.png"
        Contents.style=`
        background-color: rgba(0, 149, 255, 1); 
        transition: background-color 2s ease-in-out; 
        `
    }
    else if(nData.weather[0].main=="Haze"){
        console.log("Haze")
        WhetherImg.src="images/snow.png"
        Contents.style=`
        background-color: rgba(126, 126, 126, 0.5);
        transition: background-color 2s ease-in-out;
        `
    }
    else if(nData.weather[0].main=="Clouds"){
        console.log("Clouds")
        WhetherImg.src="images/clouds.png"
        Contents.style=`
        background-color: rgba(255, 255, 255, 0.664);
        transition: background-color 2s ease-in-out;
        `
        
    }
    else if(nData.weather[0].main=="Rains"){
        console.log("Rains")
        Contents.style=`
        background-color: rgba(128, 117, 117, 0.5);
        transition: background-color 2s ease-in-out;
        `
    }
    else if(nData.weather[0].main=="Drizzle"){
        console.log("Drizzle")
        WhetherImg.src="images/drizzle.png"
        Contents.style=`
        background-color: rgba(50, 50, 255, 0.5);
        transition: background-color 2s ease-in-out;
        `
    }
    else{
        console.log("Clear")
        WhetherImg.src="images/clear.png"
        Contents.style=`
        background-color: rgb(0, 149, 255);
        transition: background-color 2s ease-in-out;
        `
    }


}
let seaarchInput=document.querySelector(".searchbox input")
let seaarch=document.querySelector(".searchicon")
seaarch.addEventListener("click",()=>{
    city=seaarchInput.value
    whetherData(`${city}`)
})



