import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const containerStyle = {
  width: "100%",
  height: "85vh",
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567,
};

export default function MapComponent({user}) {

const [places, setPlaces] = useState([]);
const [filters, setFilters] = useState({
ramp:false,
lift:false,
toilet:false,
wheelchair:false,
});

const [listening,setListening] = useState(false);
const [currentLocation,setCurrentLocation] = useState(null);
const [selectedPlace,setSelectedPlace] = useState(null);
const [directionText,setDirectionText] = useState("");
const [distance,setDistance] = useState(null);
const [directions,setDirections] = useState(null); 
const [steps,setSteps] = useState([]);
const [showForm, setShowForm] = useState(false);
const [newPlace,setNewPlace] = useState({

name:"",
ramp:false,
lift:false,
toilet:false,
wheelchair:false,
});

useEffect(()=>{
fetchPlaces();
},[]);

useEffect(()=>{

navigator.geolocation.watchPosition(
(position)=>{

const lat = position.coords.latitude;
const lng = position.coords.longitude;

setCurrentLocation({lat,lng});

},
(error)=>{
console.log(error);
},
{
enableHighAccuracy:true,
maximumAge:0,
timeout:5000
}
);

},[]);
useEffect(()=>{

if(selectedPlace && currentLocation){

const bearing = getBearing(
currentLocation.lat,
currentLocation.lng,
selectedPlace.lat,
selectedPlace.lng
);

setDirectionText(getDirection(bearing));

}

},[currentLocation,selectedPlace]);
const fetchPlaces = async ()=>{

const snap = await getDocs(collection(db,"places"));

const data = snap.docs.map((d)=>({
id:d.id,
...d.data()
}));

setPlaces(data);

};

function getBearing(startLat,startLng,endLat,endLng){

const toRad = (deg)=>deg*Math.PI/180;

const toDeg = (rad)=>rad*180/Math.PI;

const dLng = toRad(endLng-startLng);

const y = Math.sin(dLng)*Math.cos(toRad(endLat));

const x =
Math.cos(toRad(startLat))*Math.sin(toRad(endLat))
-
Math.sin(toRad(startLat))
*Math.cos(toRad(endLat))
*Math.cos(dLng);

let bearing = toDeg(Math.atan2(y,x));

return (bearing+360)%360;

}

function getDirection(bearing){

if(bearing>=315 || bearing<45)
return "Go Straight";

if(bearing>=45 && bearing<135)
return "Turn Right";

if(bearing>=135 && bearing<225)
return "Go Back";

if(bearing>=225 && bearing<315)
return "Turn Left";

}

// 🎤 Voice assistant
const startListening = ()=>{

if(!("webkitSpeechRecognition" in window)){
alert("Voice not supported");
return;
}

const recognition = new window.webkitSpeechRecognition();

recognition.start();

setListening(true);

recognition.onresult = async(event)=>{

const text = event.results[0][0].transcript.toLowerCase();

if(text.includes("location")){

const place = text.replace("set location to","").trim();

const res = await fetch(
`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyBj3tvcN3mSTCxPnDYxOxsLGq6l0w5yzd4`
);

const data = await res.json();

if(data.results.length>0){

const loc = data.results[0].geometry.location;

setCurrentLocation({
lat:loc.lat,
lng:loc.lng
});

}

}
else{

setFilters({
ramp:text.includes("ramp"),
lift:text.includes("lift"),
toilet:text.includes("toilet"),
wheelchair:text.includes("wheelchair"),
});

}
setListening(false);
};
};

function getAccessibilityScore(place){

let score = 0;

if(place.ramp) score += 0.25;
if(place.lift) score += 0.25;
if(place.toilet) score += 0.25;
if(place.wheelchair) score += 0.25;

return score;

}

const toRad=(deg)=>deg*Math.PI/180;


const recommendBestPlace = ()=>{

if(!currentLocation || places.length===0){
alert("Location needed");
return;
}

let best=null;
let bestScore=-999;

places.forEach(p=>{

const score = getAccessibilityScore(p);

const dLat = toRad(p.lat-currentLocation.lat);
const dLon = toRad(p.lng-currentLocation.lng);

const a =
Math.sin(dLat/2)**2 +
Math.cos(toRad(currentLocation.lat))
*
Math.cos(toRad(p.lat))
*
Math.sin(dLon/2)**2;

const distance =
6371*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));

const finalScore =
score - (distance*0.05);

if(finalScore > bestScore){

bestScore = finalScore;
best = p;
}

});

if(best){

alert(
`Recommended Place: ${best.name}

AI Score: ${getAccessibilityScore(best)}

Reason: Best accessibility + near distance`
);
}
};

const findNearestPlace = ()=>{

if(!currentLocation){
alert("Set location first!");
return;
}

let nearest=null;
let minDistance=Infinity;

places
.filter(p => getAccessibilityScore(p) > 0)
.forEach((p)=>{
  
const dLat = toRad(p.lat-currentLocation.lat);
const dLon = toRad(p.lng-currentLocation.lng);

const a =
Math.sin(dLat/2)**2 +
Math.cos(toRad(currentLocation.lat))
*
Math.cos(toRad(p.lat))
*
Math.sin(dLon/2)**2;

const distance =
6371*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));

if(distance<minDistance){

minDistance=distance;
nearest=p;

}

});

if(nearest){

alert(`Nearest Place: ${nearest.name}`);

}

};
const handleAddPlace = async (e) => {
  e.preventDefault();

  if (!newPlace.name.trim()) {
    alert("Enter place name");
    return;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        newPlace.name
      )}&key=AIzaSyBj3tvcN3mSTCxPnDYxOxsLGq6l0w5yzd4`
    );

    const data = await response.json();

    if (data.results.length === 0) {
      alert("Place not found");
      return;
    }

    const loc = data.results[0].geometry.location;

    const placeData = {
      ...newPlace,
      lat: loc.lat,
      lng: loc.lng,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, "places"), placeData);

    setPlaces((prev) => [...prev, { id: docRef.id, ...placeData }]);

    setShowForm(false);

    setNewPlace({
      name: "",
      ramp: false,
      lift: false,
      toilet: false,
      wheelchair: false,
    });

    alert("Place added successfully!");
  } catch (error) {
    console.error(error);
    alert("Error adding place");
  }
};

const filteredPlaces =
places.filter((p)=>{

return(

(!filters.ramp || p.ramp)
&&
(!filters.lift || p.lift)
&&
(!filters.toilet || p.toilet)
&&
(!filters.wheelchair || p.wheelchair)

);

});

return(

<div>

<div style={{
padding:"10px",
background:"#f0f0f0",
display:"flex",
justifyContent:"space-between"
}}>

<div>

<strong>Accessibility Filters:</strong>

{["ramp","lift","toilet","wheelchair"].map((f)=>(
<label key={f}>

<input
type="checkbox"
checked={filters[f]}
onChange={(e)=>
setFilters({
...filters,
[f]:e.target.checked
})
}
/>

{f}

</label>
))}

<button onClick={startListening}>
{listening?"Listening...":"🎤 Speak"}
</button>

</div>

<div>

<button onClick={findNearestPlace}>
📍 Nearest Accessible Place
</button>

<button onClick={recommendBestPlace}>
🤖 AI Recommended Place
</button>

</div>

</div>

<LoadScript googleMapsApiKey="AIzaSyBj3tvcN3mSTCxPnDYxOxsLGq6l0w5yzd4">

<GoogleMap
mapContainerStyle={containerStyle}
center={currentLocation || defaultCenter}
zoom={13}
>

{currentLocation &&(

<Marker
position={currentLocation}
icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
/>

)}

{filteredPlaces.map((p)=>(

<Marker
key={p.id}
position={{lat:p.lat,lng:p.lng}}

onClick={()=>{

setSelectedPlace(p);

if(currentLocation){

const bearing =
getBearing(
currentLocation.lat,
currentLocation.lng,
p.lat,
p.lng
);

setDirectionText(
getDirection(bearing)
);
const directionsService =
new window.google.maps.DirectionsService();

directionsService.route(

{
origin:currentLocation,

destination:{
lat:p.lat,
lng:p.lng
},

travelMode:
window.google.maps.TravelMode.WALKING
},

(result,status)=>{

if(status==="OK"){

setDirections(result);

const routeSteps =
result.routes[0]
.legs[0]
.steps
.map(step => step.instructions);

setSteps(routeSteps);

const km =
result.routes[0]
.legs[0]
.distance
.text;

setDistance(km);

}

}

);
}

}}

 />

))}
{/* ROUTE LINE */}
{directions && (

<DirectionsRenderer
directions={directions}
/>

)}
{selectedPlace &&(

<InfoWindow
position={{
lat:selectedPlace.lat,
lng:selectedPlace.lng
}}

onCloseClick={()=>
setSelectedPlace(null)
}

>

<div>

<h3>{directionText}</h3>
<p><b>Distance:</b> {distance}</p>
<strong>{selectedPlace.name}</strong>
<p>AI Score: {getAccessibilityScore(selectedPlace).toFixed(2)}</p>
<br/>

♿ {selectedPlace.wheelchair?"Yes":"No"}

<br/>

🛗 {selectedPlace.lift?"Yes":"No"}

<br/>

🛝 {selectedPlace.ramp?"Yes":"No"}

<br/>

🚻 {selectedPlace.toilet?"Yes":"No"}

</div>

</InfoWindow>

)}
<div>

<b>Navigation Steps:</b>

<ul>

{steps.map((step,i)=>(
<li key={i}
dangerouslySetInnerHTML={{__html:step}}>
</li>
))}

</ul>

</div>
</GoogleMap>

{/* ADD PLACE BUTTON */}
<button onClick={() => setShowForm(true)}>
  Add Place
</button>

{/* POPUP FORM */}
{showForm && (
  <div style={{ background: "white", padding: "10px", position: "absolute", top: 50, right: 20, zIndex: 1000 }}>
    
    <input
      placeholder="Place Name"
      value={newPlace.name}
      onChange={(e) =>
        setNewPlace({ ...newPlace, name: e.target.value })
      }
    />

    <br />

    {["wheelchair", "ramp", "lift", "toilet"].map((f) => (
      <label key={f}>
        <input
          type="checkbox"
          checked={newPlace[f]}
          onChange={(e) =>
            setNewPlace({ ...newPlace, [f]: e.target.checked })
          }
        />
        {f}
      </label>
    ))}

    <br />

    <button onClick={handleAddPlace}>Save</button>
    <button onClick={() => setShowForm(false)}>Cancel</button>

  </div>
)}

</LoadScript>

</div>
);
}


