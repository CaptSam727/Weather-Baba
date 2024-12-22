document.getElementById('#location').addEventListener('keydown', (event) => {
    if(event.code == 'Enter'){
        event.preventDefault();
        document.querySelector('form').submit();
    }
});

// !!! Current location feature has not been implemented yet !!!
function onSuccess(position){
    const {latitude, longitude} = position.coords;
    console.log(latitude);
}
function onError(){
    document.getElementsByClassName('.infoTxt').innerText = "There seems an error :(";
}
document.getElementById('#formBtn').addEventListener('click', (event) => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser does not support geolocation api.");
    }
    document.querySelector('form').submit(position.coords);
});
