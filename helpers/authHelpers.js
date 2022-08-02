import bcrypt from "bcrypt";
async function loginHelper(model, res, req) {
  try {
    const user = await model.findOne({ email: req.body.email });
    user
      ? compareHash(req.body.password, user.password, res)
      : res.status(400).send({
          message: "Invalid email or password",
        });
  } catch (err) {
    res.status(500).send({
      message: "Error logging in user " + err.message,
    });
  }
}
async function compareHash(requestPassword, dbPassword, res) {
  const response = await bcrypt.compare(requestPassword, dbPassword);
  response
    ? res.status(200).send({
        message: "User logged in successfully",
      })
    : res.status(401).send({
        message: "Invalid email or password",
      });
}

async function signUpHelper(model, res, req) {
  model.findOne({ email: req.body.email }, (err, user) => {
    err
      ? res.status(500).send({
          message: "Error creating user " + err.message,
        })
      : hashAndCreateUser(user, res, req, model);
  });
}
async function hashAndCreateUser(user, res, req, model) {
  user
    ? res.status(400).send({
        message: "Email already exists",
      })
    : bcrypt.hash(req.body.password, 10, function (error, hash) {
        const userInstance = new model({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });

        error
          ? res.status(500).send({
              message: "Error creating user " + error.message,
            })
          : userInstance.save((error, user) => {
              error
                ? res.status(500).send({
                    message: "Error registering user " + error.message,
                  })
                : res.status(200).send({
                    message: "User created successfully",
                  });
              console.log(user + " was created");
            });
      });
}

export { loginHelper, signUpHelper };
