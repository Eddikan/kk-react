import React, { useState } from "react";
import { useSanctum } from "react-sanctum";

const Login = () => {
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const { authenticated, user, signIn, twoFactorChallenge } = useSanctum();

  const handleLogin = () => {
    const email = "sanctum@example.org";
    const password = "password";
    const remember = true;

    signIn(email, password, remember)
      .then(({ twoFactor }) => {
        if (twoFactor) {
          setShowTwoFactorForm(true);
          return;
        }

        window.alert("Signed in without token!");
      })
      .catch(() => window.alert("Incorrect email or password"));
  };

  const handleTwoFactorChallenge = (recovery = false) => {
    twoFactorChallenge(recovery ? recoveryCode : code, recovery)
      .then(() => window.alert("Signed in with token!"))
      .catch(() => window.alert("Incorrect token"));
  };

  if (authenticated === true) {
    return <h1>Welcome, {user.name}</h1>;
  } else {
    if (showTwoFactorForm) {
      return (
        <div>
          <input
            type="text"
            onInput={(event) => setCode(event.currentTarget.value)}
          />
          <button onClick={() => handleTwoFactorChallenge()}>
            Sign in using OTAP-token
          </button>
          <hr />
          <input
            type="text"
            onInput={(event) => setRecoveryCode(event.currentTarget.value)}
          />
          <button onClick={() => handleTwoFactorChallenge(true)}>
            Sign in using recovery token
          </button>
        </div>
      );
    }

    return <button onClick={handleLogin}>Sign in</button>;
  }
};

export default Login;