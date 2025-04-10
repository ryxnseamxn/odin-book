const dataSource = require("../db/dataSource");
const User = require("../db/entities/User")
const userRepository = dataSource.getRepository(User);

exports.signUp = async (req, res) => {
    try {
        const { username, password } = req.body;

        let result = await userRepository
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(
                {
                    username: username,
                    password: password
                }
            )
            .execute();
        res.status(200).json({
            message: "sign up successful",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Sign up failed",
            error: error 
        })
    }
};