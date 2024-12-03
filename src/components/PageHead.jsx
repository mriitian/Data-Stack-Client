import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Users from "./Users";
import Teams from "./Teams";
import UserData from "./UserData";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";

export default function PageHead() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          setCurrentUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };
  return (
    <div>
      {profile ? (
        <div
          className="topbar"
          style={{
            display: "flex",
            margin: "20px",
            justifyContent: "space-evenly",
          }}
        >
          <h2
            style={{ color: "white", textAlign: "center", padding: "20px 5px" }}
          >
            Users Data
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={profile.picture}
              alt="user image"
              style={{ borderRadius: "50%" }}
            />
            <Button onClick={logOut} variant="danger">
              Log out
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="topbar"
          style={{
            display: "flex",
            margin: "20px",
            justifyContent: "space-evenly",
          }}
        >
          <h2
            style={{ color: "white", textAlign: "center", padding: "20px 5px" }}
          >
            Users Data
          </h2>
        </div>
      )}

      {profile ? (
        <div className="data-container">
          <Tabs
            defaultActiveKey="users"
            id="animated-tab-example"
            className="mb-3"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Tab eventKey="users" title="Home">
              <UserData />
            </Tab>
            <Tab eventKey="teams" title="Teams">
              <Teams />
            </Tab>
          </Tabs>
        </div>
      ) : (
        <div
          className=""
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "80%",
          }}
        >
          <Button onClick={() => login()} variant="success">
            Sign in with Google 🚀{" "}
          </Button>
        </div>
      )}
    </div>
  );
}
