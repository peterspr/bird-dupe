import * as dotenv from "dotenv";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as passport from "passport";
import { Model } from "mongoose";
import UserModel from "../models/user.model";
import TokenModel from "../models/token.model";
import * as jwt from "jsonwebtoken";

dotenv.config();

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use( new Strategy(opts, async function (jwt_payload, done) {
    try {
        const user = await UserModel.findOne({ email: jwt_payload.email });

        if (user) {
            const tokenFromDB = await TokenModel.findOne({ user: user._id, });

            if (!tokenFromDB) {
                return done(null, false);
            }

            const refreshPayload = jwt.verify(
                tokenFromDB.refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            if (refreshPayload.email !== jwt_payload.email) {
                return done(null, false);
            }

            const tokenExpiration = new Date(jwt_payload.exp * 1000);
            const now = new Date();
            const timeDifference = tokenExpiration.getTime() - now.getTime();

            if (timeDifference > 0 && timeDifference < 30 * 60 * 1000) {
                const payloadNew = {
                    _id: user._id,
                    email: user.email,
                };
                const newToken = jwt.sign(payloadNew, process.env.SECRET, {
                    expiresIn: "6h",
                });

                return done(null, { user, newToken });
            }
            return done(null, { user });
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));