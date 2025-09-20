import fetch from 'node-fetch';


const BASE_URL = process.env.SOILGRIDS_API || 'https://rest.isric.org/soilgrids/v2.0/properties/query';


export const fetchSoilData = async (lat, lon) => {
const url = `${BASE_URL}?lat=${lat}&lon=${lon}&property=phh2o,ocd,cec,clay,sand,silt&depth=0-5cm,5-15cm,15-30cm`;


const response = await fetch(url, {
headers: {
'Content-Type': 'application/json'
}
});


if (!response.ok) {
throw new Error('Failed to fetch SoilGrids data');
}


const data = await response.json();
return data;
};