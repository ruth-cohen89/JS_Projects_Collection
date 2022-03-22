/* eslint-disable */
import axios from 'axios'
const Stripe = require('stripe');
import { showAlert, hideAlert } from './alerts'

export const bookTour = async (tourId) => {
  try {

    const stripe = window.Stripe("pk_test_51Kc3R6GVbNtop8FTTLJXyCoKliw3LhASX2BNQgwlobX90nrqSInOlZick4AFB8iqcnEJeYYFc1W34UMDTpLUw8aC00M3XsCxro");

    // 1) Get checkout session from the API (bookingController)
    const session = await axios(
        `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    //console.log(session);

    // 2) Create checkout form + charge credit card
    // If the credit card is charged then stripe creates a req:
    // '/?tour=...&user=...&price=...
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    });

  } catch (err) {
      console.log(err);
      showAlert('error', err);
  }
}