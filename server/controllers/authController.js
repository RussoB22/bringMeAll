const qrcode = require("qrcode");
const passport = require("passport");
const { authenticator } = require("otplib");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res, next) => {
  passport.authenticate(
    "login",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      if (!user.twofaEnabled) {
        const token = jwt.sign(
          {
            user: {
              username: user.username,
              email: user.email,
              _id: user._id,
              session_id: Date.now(),
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);


        const sessionExpiresAt = new Date(decoded.user.session_id + Number(process.env.JWT_EXPIRES_IN_SMOL) * 1000);

        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              session_id: decoded.user.session_id,
              session_expires_at: sessionExpiresAt
            }
          }
        );

        res.cookie('token', token, {
          httpOnly: true,
          secure: 'false',
        });

        return res.json({
          message: "Login successful",
          twofaEnabled: false,
          token: token,
          userId: user._id,
        });
      } else {
        return res.json({
          message: "Please complete 2-factor authentication",
          twofaEnabled: true,
          loginStep2VerificationToken: jwt.sign(
            {
              loginStep2Verification: { email: user.email },
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          ),
          userId: user._id,
        });
      }
    }
  )(req, res, next);
};

const loginStep2 = async (req, res) => {
  let loginStep2VerificationToken = null;
  try {
    loginStep2VerificationToken = jwt.verify(
      req.body.loginStep2VerificationToken,
      process.env.JWT_SECRET
    );
  } catch (err) {
    return res.status(401).json({
      message: "You are not authorized to perform login step-2",
    });
  }

  const token = req.body.twofaToken.replaceAll(" ", "");
  const user = await User.findOne({
    email: loginStep2VerificationToken.loginStep2Verification.email,
  });
  if (!authenticator.check(token, user.twofaSecret)) {
    return res.status(400).json({
      message: "OTP verification failed: Invalid token",
    });
  } else {
    const token = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
          session_id: Date.now(),
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    const sessionExpiresAt = new Date(decoded.user.session_id + Number(process.env.JWT_EXPIRES_IN_SMOL) * 1000);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          session_id: decoded.user.session_id,
          session_expires_at: sessionExpiresAt
        }
      }
    );


    res.cookie('token', token, {
      httpOnly: true,
      secure: 'false',
    });

    return res.json({
      message: "OTP verification successful",
      token: token,
      userId: user._id,
    });
  }
};

const generate2faSecret = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  if (user.twofaEnabled) {
    return res.status(400).json({
      message: "2FA already verified and enabled",
      twofaEnabled: user.twofaEnabled,
    });
  }

  const secret = authenticator.generateSecret();
  user.twofaSecret = secret;
  await user.save();
  const appName = "Bring Me";

  const qrImageDataUrl = await qrcode.toDataURL(
    authenticator.keyuri(user.email, appName, secret)
  );

  return res.json({
    message: "2FA secret generation successful",
    secret: secret,
    qrImageDataUrl: qrImageDataUrl,
    twofaEnabled: user.twofaEnabled,
  });
};

const verifyOtp = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (user.twofaEnabled) {
    return res.json({
      message: "2FA already verified and enabled",
      twofaEnabled: user.twofaEnabled,
    });
  }

  const token = req.body.token.replaceAll(" ", "");
  if (!authenticator.check(token, user.twofaSecret)) {
    return res.status(400).json({
      message: "OTP verification failed: Invalid token",
      twofaEnabled: user.twofaEnabled,
    });
  } else {
    user.twofaEnabled = true;
    await user.save();

    return res.json({
      message: "OTP verification successful",
      twofaEnabled: user.twofaEnabled,
    });
  }
};

const disable2fa = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  user.twofaEnabled = false;
  user.twofaSecret = "";
  await user.save();

  return res.json({
    message: "2FA disabled successfully",
    twofaEnabled: user.twofaEnabled,
  });
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.updateOne(
      { _id: decoded.user._id },
      { $set:
         { session_id: null } }
    );

    res.json({
       message: "User logged out",
       token: '' });
  } catch (err) {
    res.status(500).json({ message: "Error occurred during logout" });
  }
};



module.exports = {
  login,
  loginStep2,
  generate2faSecret,
  verifyOtp,
  disable2fa,
  logout
};
