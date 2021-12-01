import jwt from "jsonwebtoken"

export const auth = (request, response, next) => {
    try {
        //console.log(request.header)
        const key = process.env.SECRET_KEY||"token"
        const token = request.header("x-auth-token");
        jwt.verify(token, process.env.SECRET_KEY);
        next();
    }
    catch(err) {
        response.status(400).send( err)
    }
}