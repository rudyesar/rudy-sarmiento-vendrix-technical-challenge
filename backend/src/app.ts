import express, { NextFunction, Response, Request } from 'express';
import { createClient } from 'redis';
import fetch from 'cross-fetch';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// -------------------------------------------------------------
// -------------------------------------------------------------

const app = express();

// Body Parser
app.use(express.json());
let redisClient: any;

(async () => {
  redisClient = createClient();

  redisClient.on('error', (error: unknown) =>
    console.error(`Error : ${error}`)
  );

  await redisClient.connect();
})();

app.use('/users', async (req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');
  // res.set('Access-Control-Allow-Methods', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  } else if (req.method === 'GET') {
    const cacheResults = await redisClient.get('users');
    if (cacheResults) {
      console.log('cached users', { data: JSON.parse(cacheResults) });
      return res.status(200).json({
        data: JSON.parse(cacheResults),
      });
    } else {
      console.log('no cached users');
      return res.status(200).json({
        data: [],
      });
    }
  } else {
    const cacheResults = await redisClient.get('users');
    if (cacheResults) {
      await redisClient.set(
        'users',
        JSON.stringify([...JSON.parse(cacheResults), req.body])
      );
      const updatedData = await redisClient.get('users');

      console.log('updated cached users', { data: req.body });
      return res.status(200).json({
        data: JSON.parse(updatedData),
      });
    } else {
      await redisClient.set('users', JSON.stringify([req.body]));
      const updatedData = await redisClient.get('users');

      console.log('initiated users', { data: JSON.parse(updatedData) });
      return res.status(200).json({
        data: JSON.parse(updatedData),
      });
    }
  }
  next();
});

/**
 * Second Phase Stub Out
 *
 * TODO: implement endpoint
 */
app.use('/cards/:cardId', async (req: Request, res: Response, next: NextFunction) => {
  console.log('cardId', req.params.cardId)
  console.log('API Key', process.env.HIGHNOTE_API_KEY)
  if (req.method === 'POST') {
    fetch('https://api.us.test.highnoteplatform.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                  // 'Accept': 'application/json',
                 'Authorization': `${process.env.HIGHNOTE_API_KEY}`
                },
      body: JSON.stringify({ query:
        `query GetPaymentCardById($paymentCardId: ID!) {
          node(id: ${req.params.cardId}) {
            ... on PaymentCard {
              id
              bin
              last4
              expirationDate
              network
              status
              formFactor
              restrictedDetails {
                ... on PaymentCardRestrictedDetails {
                  number
                  cvv
                }
                ... on AccessDeniedError {
                  message
                }
              }
              physicalPaymentCardOrders {
                id
                paymentCardShipment {
                  courier {
                    method
                    signatureRequiredOnDelivery
                    tracking {
                      trackingNumber
                      actualShipDateLocal
                    }
                  }
                  requestedShipDate
                  deliveryDetails {
                    name {
                      middleName
                      givenName
                      familyName
                      suffix
                      title
                    }
                    companyName
                    address {
                      streetAddress
                      extendedAddress
                      postalCode
                      region
                      locality
                      countryCodeAlpha3
                    }
                  }
                  senderDetails {
                    name {
                      givenName
                      middleName
                      familyName
                      suffix
                      title
                    }
                    companyName
                    address {
                      streetAddress
                      extendedAddress
                      postalCode
                      region
                      locality
                      countryCodeAlpha3
                    }
                  }
                }
                orderState {
                  status
                }
                cardPersonalization {
                  textLines {
                    line1
                    line2
                  }
                }
                createdAt
                updatedAt
                stateHistory {
                  previousStatus
                  newStatus
                  createdAt
                }
              }
            }
          }
        }
      `}),
    })
    .then(r => r.json())
    .then((data) => {
      console.log('data returned:', data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err)
    })
  }

  // next();
});

export default app;
