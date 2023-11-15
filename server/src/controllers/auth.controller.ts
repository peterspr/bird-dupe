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
        // const accessData = jwt.decode(response.accessToken);
        // console.log("IdData \n", tokenData);
        // console.log("AccessData \n", accessData);
        UserModel.findOne({
            email: { $eq: tokenData.email },
        }).then((existingUser) => {
            if (!existingUser) {
                return res.redirect(`/`);
            }
            const payload = {
                id: existingUser._id,
                email: existingUser.email,
            };

            const aToken = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "6h",
            });
          
            const rToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
                expiresIn: "7d",
            });
            
            const newTokenSet = new TokenModel({
                user: existingUser._id,
                refreshToken: rToken,
                accessToken: aToken,
            });

            newTokenSet.save().then(() => {
                const profileData = {
                    user: {
                        _id: existingUser._id,
                        name: existingUser.name,
                        email: existingUser.email,
                    },
                    accessToken: aToken,
                    refreshToken: rToken,
                }
                const encodedData = encodeURIComponent(JSON.stringify(profileData));
                res.redirect(`/token?data=${encodedData}`);
            });
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
        const idTokenData = jwt.decode(response.idToken);

        console.log(tokenData);
        console.log("idToken: \n", idTokenData)
        UserModel.findOne({
            email: { $eq: tokenData.email },
        }).then((existingUser) => {
            if (existingUser) {
                return res.redirect(`/`);
            } else {
                const newUser = new UserModel({
                    name: idTokenData.given_name + " " + idTokenData.family_name,
                    email: idTokenData.email,
                });
        
                newUser.save().then(() => {
                    UserModel.findOne({
                        email: { $eq: idTokenData.email },
                      }).then((existingUser) => {
                        return res.redirect('/');
                    });
                });
            }
        });
        
    }).catch((error) => {
        console.log(error);
    });
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
    
        const existingToken = await TokenModel.findOne({
            refreshToken: { $eq: refreshToken },
        });
        if (!existingToken) {
            return res.status(401).json({ message: "Invalid refresh token", });
        }
        const existingUser = await UserModel.findById(existingToken.user);
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid refresh token", });
        }
    
        const refreshTokenExpiresAt = jwt.decode(existingToken.refreshToken).exp * 1000;
        if (Date.now() >= refreshTokenExpiresAt) {
            await existingToken.deleteOne();
            return res.status(401).json({message: "Expired refresh token",});
        }
    
        const payload = {
            id: existingUser._id,
            email: existingUser.email,
        };
    
        const accessToken = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "6h",
        });
    
        res.status(200).json({
            accessToken,
            refreshToken: existingToken.refreshToken,
            accessTokenUpdatedAt: new Date().toLocaleString(),
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

// export function silentRefresh(req, res, next) {
//     cca.getTokenCache().getAllAccounts().then((accounts) => {
//         const account = accounts.filter((account) => {
//             // Replace the condition below with your own logic
//             const idTokenData = jwt.decode(account.idToken);
//             const email = idTokenData.email;
//             const accessToken = jwt.decode(req.body.accessToken);
//             return email === accessToken.email;
//         })[0];
//         const silentRequestConfig: msal.SilentFlowRequest = {
//             account: account,
//             authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
//             scopes: ["profile", "offline_access", "openid"],
//         };
//         cca.acquireTokenSilent(silentRequestConfig)
//                 .then((authResponse) => {
//                     res.status(200).json({accessToken: authResponse.accessToken});
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//         console.log(accounts);
//     });
// }

export function printRequest(req, res, next) {
    console.log("In printResponse");
    console.log(res);
    next();
}

