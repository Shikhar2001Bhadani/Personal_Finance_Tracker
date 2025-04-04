import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { doc, setDoc } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginform, setloginform] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("user>>", user);
            toast.success("user created");
            setLoading(false);
            setConfirmPassword("");
            setName("");
            setEmail("");
            setPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      }
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }
  function LoginWithEmail() {
    console.log("Email", email);
    console.log("password", password);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged in");
          console.log("user logged in", user);
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("DOC Created");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("users", user);
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");
          toast.success("user Authincated");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <>
      {loginform ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johnDoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"apple@123"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={LoginWithEmail}
            />

            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login using Google"}
              blue={true}
            />
          </form>
          <p className="p-login" onClick={() => setloginform(!loginform)}>
            Don't have an account? Click Here
          </p>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Signup On <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"john Doe"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johnDoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"apple@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"retype Password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "SignUp Using Email and Password"}
              onClick={signupWithEmail}
            />

            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "SignUp using Google"}
              blue={true}
            />
            <p className="p-login" onClick={() => setloginform(!loginform)}>
              Already have an account? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignIn;
