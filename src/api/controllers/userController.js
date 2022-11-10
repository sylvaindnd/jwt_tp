const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

exports.userRegister = (req, res) => {
    const body = req.body;

    let newUser = new User({
        email: body.email,
        role: body.role,
        password: bcrypt.hashSync(body.password, 10)
    });

    newUser.save((error, user) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Reqûete invalide." });
        }
        else {
            res.status(201);
            res.json({ message: `Utilisateur crée : ${user.email}` });
        }
    })


}

exports.loginRegister = (req, res) => {
    // Find user
    User.findOne({ email: req.body.email }, (error, user) => {
        // If user not found
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "Utilisateur non trouvé" });
        }
        else {
            // User found
            const hash = bcrypt.hashSync(req.body.password, 10);
            if (user.email == req.body.email && bcrypt.compareSync(req.body.password, hash)) {
                // Password correct
                let userData = {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
                jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "30 days" }, (error, token) => {
                    if(error) {
                        res.status(500);
                        console.log(error);
                        res.json({message: "Impossible de générer le token"});

                    }
                    else {
                        res.status(200);
                        res.json({token});
                    }
                })
            }
            else {
                // Password don't match
                res.status(401);
                console.log(error);
                res.json({ message: "Email ou Mot de passe incorrect" });

            }
        }
    })
}