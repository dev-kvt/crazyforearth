import { fetchSoilData } from '../services/soilgridsService.js';


export const getSoilData = async (req, res, next) => {
try {
const { lat, lon } = req.query;
if (!lat || !lon) {
return res.status(400).render('error', { message: 'Latitude and Longitude are required.' });
}


const soilData = await fetchSoilData(lat, lon);


res.render('pages/result', { title: 'Soil Data Result', soilData, lat, lon });
} catch (err) {
next(err);
}
};
