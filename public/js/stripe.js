/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H7hYRDCovAArinj1FTPJt5YiKw06xwRvAqXAQHcoQzLsdUSY6m1WldHOtaoBiCDFNyXbrusiLDnLFHWX6TSUV9q00rBDxKaor'
);

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from server/API
        const session = await axios(
          `http://localhost:8080/api/v1/booking/checkout-session/${tourId}`
        );
        console.log(session);
    
        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err.message);
    }
}