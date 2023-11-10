import { Router } from 'express';
const router = Router();

import passport from 'passport';
import getUser from '../controllers/user.controller';

import { signinRedirect } from '../controllers/auth.controller';
import { printRequest } from '../controllers/auth.controller';
import { getToken } from '../controllers/auth.controller';

router.get('/signin', signinRedirect);

router.get('/redirect', printRequest, getToken);

router.get('/redirect', function(req, res) {
    console.log("Received redirect.");
    console.log(req.query.code);
    res.status(200).end();
});

router.post('/redirect', function(req, res) {
    console.log("Received redirect.");
    console.log(req.query.code);
    res.status(200).end();
});

//router.get('/redirect', printResponse);

//The Microsoft Entra ID authorization will callback to this endpoint. 
// This includes middleware for validating the user (Creating a new one if it doesn't exist)
// Potentially updating tokens. Refresh or ID
// Then should render res.redirect('/user/:id')

// What makes it unique to the user is the req/res bodies. The response will render for the unique user.

// On the client side, the user authenticates with microsoft, then the page awaits the callback response.
// When the callback hits, the info is saved and the page redirects to /user


export default router;