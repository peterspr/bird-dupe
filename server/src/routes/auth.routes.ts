import { Router } from 'express';
const router = Router();

import passport from 'passport';
import getUser from '../controllers/user.controller';

import { refreshToken, signinRedirect, signupRedirect } from '../controllers/auth.controller';
import { printRequest } from '../controllers/auth.controller';
import { returnSigninToken, returnSignupToken } from '../controllers/auth.controller';

router.get('/signin', signinRedirect);

router.get('/signup', signupRedirect);

router.get('/signin/redirect', printRequest, returnSigninToken);

router.get('/signup/redirect', returnSignupToken);

router.post('/refreshToken', refreshToken)

// router.post('/silentRefresh', silentRefresh)

// router.get('/redirect', function(req, res) {
//     console.log("Received redirect.");
//     console.log(req.query.code);
//     res.status(200).end();
// });


//router.get('/redirect', printResponse);

//The Microsoft Entra ID authorization will callback to this endpoint. 
// This includes middleware for validating the user (Creating a new one if it doesn't exist)
// Potentially updating tokens. Refresh or ID
// Then should render res.redirect('/user/:id')

// What makes it unique to the user is the req/res bodies. The response will render for the unique user.

// On the client side, the user authenticates with microsoft, then the page awaits the callback response.
// When the callback hits, the info is saved and the page redirects to /user


export default router;