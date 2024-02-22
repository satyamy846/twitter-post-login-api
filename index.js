import express from 'express';

import { Client, auth } from "twitter-api-sdk";

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Initialize auth client first
const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID,
  callback: "http://localhost:3000/callback",
  scopes: ["tweet.read", "users.read", "tweet.write"],
});

 // Pass auth credentials to the library client 
 const client = new Client(authClient);


 const STATE = "my-state";

 app.get("/", (req, res) =>{
  res.send(`<a href="/login" >Login to twitter</a>`)
 })

 app.get("/success", (req, res)=>{
  res.send(`Login successfull <br/> <a href="/upload-media" >Upload your media</a>`);
 })


let access_token = "";
 app.get("/upload-media", async (req, res) =>{
  const response = await client.tweets.createTweet({
    text: "Hi this is my first tweet",
})
  console.log("tweet posted");
  res.send(response);
 })

 app.get("/callback", async function (req, res) {
   try {
     const { code, state } = req.query;

     if (state !== STATE) return res.status(500).send("State isn't matching");
     const response = await authClient.requestAccessToken(code.toString());
     console.log(response);
     res.redirect("/success");
   } catch (error) {
     console.log(error);
   }
 });
 


 app.get("/login", async function (req, res) {
   const authUrl = authClient.generateAuthURL({
     state: STATE,
     code_challenge_method: "s256",
   });
   res.redirect(authUrl);
 });
 


app.listen(3000, () =>{
    console.log(`Server is running on port ${3000}`);
});

 