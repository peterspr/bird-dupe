import UserModel from "../models/user.model";

const getUser = async (req, res, next) => {
    console.log("getUser");
    try {
        const user = await UserModel.findById(req.parmas.id);
        console.log("Issue?");
        res.status(200).json(JSON.stringify({name: user.name, email: user.email, sub:user.sub}));
    } catch (error) {
        next(error);
    }
}

export default getUser;