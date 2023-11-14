import jwt from "jsonwebtoken";

import UserModel from "../models/user.model";
import TokenModel from '../models/token.model';

import clientConfig from '../config/clientConfig';
import * as msal from "@azure/msal-node";
const cca = new msal.ConfidentialClientApplication(clientConfig);



export function signinRedirect(req, res) {
    const authCodeUrlParameters = {
        scopes: ["profile", "offline_access", "openid"],
        redirectUri: process.env.SIGNIN_REDIRECT_URL,
      };
      var authCodeUrl;
      cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        authCodeUrl = response;
        console.log("In signinRedirect.")
        res.json({authURL: authCodeUrl});
      }).catch((error) => console.log(JSON.stringify(error)));
}

export function signupRedirect(req, res) {
    const authCodeUrlParameters = {
        scopes: ["profile", "offline_access", "openid"],
        redirectUri: process.env.SIGNUP_REDIRECT_URL,
      };
      var authCodeUrl;
      cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        authCodeUrl = response;
        console.log("In signupRedirect.")
        res.json({authURL: authCodeUrl});
      }).catch((error) => console.log(JSON.stringify(error)));
}

export function returnSigninToken(req, res, next) {
    const authCode = req.query.code;
    const tokenRequest = {
        code: authCode,
        redirectUri: process.env.SIGNIN_REDIRECT_URL,
        scopes: ["profile", "offline_access", "openid"],
    };
    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        const tokenData = jwt.decode(response.idToken);
        UserModel.findOne({
            email: { $eq: tokenData.email },
          }).then((existingUser) => {
            if (!existingUser) {
                return res.redirect(`/`);
            }
            const profileData = {
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                },
                accessToken: response.accessToken,
                // refreshToken: response.refreshToken,
            }
            const encodedData = encodeURIComponent(JSON.stringify(profileData));
            res.redirect(`/token?data=${encodedData}`);
          });
    }).catch((error) => {
        console.log(error);
    });
}

export function returnSignupToken(req, res, next) {
    const authCode = req.query.code;
    const tokenRequest = {
        code: authCode,
        redirectUri: process.env.SIGNUP_REDIRECT_URL,
        scopes: ["profile", "offline_access", "openid"],
    };
    cca.acquireTokenByCode(tokenRequest).then((response) => {

        console.log("\nResponse: \n:", response);
        const tokenData = jwt.decode(response.accessToken);

        UserModel.findOne({
            email: { $eq: tokenData.email },
        }).then((existingUser) => {
            if (existingUser) {
                return res.redirect(`/`);
            }
        });
        const newUser = new UserModel({
            sub: tokenData.sub,
            name: tokenData.name,
            email: tokenData.email,
        });

        newUser.save();
        UserModel.findOne({
            email: { $eq: tokenData.email },
          }).then((existingUser) => {
            if (!existingUser) {
                return res.redirect(`/`);
            }
            const profileData = {
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                },
                accessToken: response.accessToken,
                // refreshToken: response.refreshToken,
            }
            const encodedData = encodeURIComponent(JSON.stringify(profileData));
            res.redirect(`/token?data=${encodedData}`);
        });
    }).catch((error) => {
        console.log(error);
    });
}

export function printRequest(req, res, next) {
    console.log("In printResponse");
    console.log(res);
    next();
}
