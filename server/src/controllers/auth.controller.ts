import jwt from "jsonwebtoken";

import UserModel from "../models/user.model";
import TokenModel from '../models/token.model';

import clientConfig from '../config/clientConfig';
import * as msal from "@azure/msal-node";
const cca = new msal.ConfidentialClientApplication(clientConfig);

const authCodeUrlParameters = {
  scopes: ["profile"],
  redirectUri: process.env.REDIRECT_URL,
};
var authCodeUrl;
cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
  authCodeUrl = response;
}).catch((error) => console.log(JSON.stringify(error)));

export function signinRedirect(req, res) {
    console.log("In signinRedirect.")
    res.redirect(authCodeUrl);
}

export function getToken(req, res, next) {
    const authCode = req.query.code;
    const tokenRequest = {
        code: authCode,
        redirectUri: process.env.REDIRECT_URL,
        scopes: ["profile"],
    };
    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
    }).catch((error) => {
        console.log(error);
    });
    res.status(200).end();
}

export function printRequest(req, res, next) {
    console.log("In printResponse");
    console.log(res);
    next();
}
