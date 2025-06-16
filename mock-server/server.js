const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-spec.json');

const app = express();
const port = 3001;
app.use(express.json());

const properties = require('./data/properties.json');
const lookupTree = require('./data/lookupTree.json');

const dateUtils = require('./dateUtils');

app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.get('/api/properties/:propertyId', (req, res) => {
  let property = properties.find((p) => p.id === req.params.propertyId);

  if (property === undefined) {
    res.status(404).json({
      errorMsg: 'Property not found with id: ' + req.params.propertyId,
      errorCode: 'PROPERTY_NOT_FOUND',
    });
  } else {
    res.json(property);
  }
});

const reservedDaysByProperty = {};
app.post('/api/properties/:propertyId/reserve', async (req, res) => {
  let { checkinDate, duration, guests } = req.body;

  if (typeof checkinDate !== 'string' || !dateUtils.isValidDateFormat(checkinDate)) {
    return res.status(422).json({
      errorMsg: 'Invalid Request. Field "checkinDate" of type "string" is invalid.',
      errorCode: 'INVALID_PARAM',
    });
  }

  if (typeof duration !== 'number' || duration < 1) {
    return res.status(422).json({
      errorMsg: 'Invalid Request. Field "duration" of type "number" is invalid.',
      errorCode: 'INVALID_PARAM',
    });
  }

  if (typeof guests !== 'number' || guests < 1) {
    return res.status(422).json({
      errorMsg: 'Invalid Request. Field "guests" of type "number" is invalid',
      errorCode: 'INVALID_PARAM',
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!reservedDaysByProperty[req.params.propertyId]) {
    reservedDaysByProperty[req.params.propertyId] = new Set();
  }

  const daysToReserve = dateUtils.getDatesToReserve(checkinDate, duration);

  let checkinIsInThePast = dateUtils.getDate(checkinDate) < new Date();
  if (
    checkinIsInThePast ||
    !dateUtils.canReserve(reservedDaysByProperty[req.params.propertyId], daysToReserve)
  ) {
    res.status(400).json({
      errorMsg: 'Property is not available for the specified dates',
      errorCode: 'PROPERTY_UNAVAILABLE',
    });
    return;
  }

  daysToReserve.forEach((date) => reservedDaysByProperty[req.params.propertyId].add(date));

  res.json();
});

app.post('/api/properties/:propertyId/checkAvailability', (req, res) => {
  const property = properties.find((p) => p.id === req.params.propertyId);
  const { checkinDate, duration } = req.body;

  if (typeof checkinDate !== 'string' || !dateUtils.isValidDateFormat(checkinDate)) {
    return res.status(422).json({
      errorMsg: 'Invalid Request. Field "checkinDate" of type "string" is invalid.',
      errorCode: 'INVALID_PARAM',
    });
  }

  if (typeof duration !== 'number' || duration < 1) {
    return res.status(422).json({
      errorMsg: 'Invalid Request. Field "duration" of type "number" is invalid.',
      errorCode: 'INVALID_PARAM',
    });
  }

  if (property === undefined) {
    return res.status(404).json({
      errorMsg: 'Property not found with id: ' + req.params.propertyId,
      errorCode: 'PROPERTY_NOT_FOUND',
    });
  }

  let checkinIsInTheFuture = dateUtils.getDate(checkinDate) > new Date();
  const reservedDays = reservedDaysByProperty[req.params.propertyId];
  const daysToReserve = dateUtils.getDatesToReserve(checkinDate, duration);
  const daysNotBooked = !reservedDays || dateUtils.canReserve(reservedDays, daysToReserve);
  const available = checkinIsInTheFuture && daysNotBooked;

  res.json({ available });
});

app.get('/api/propertyLookupTree', (req, res) => {
  res.json(lookupTree);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Mock API server listening`);
});
