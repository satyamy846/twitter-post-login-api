import express from 'express';

import { Client, auth } from "twitter-api-sdk";

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Initialize auth client first
const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID,
    callback: "http://localhost:3000/callback", // your callback url should be added to your twitter developer settings
    scopes: ["tweet.read", "users.read", "tweet.write"], // scopes can be
});

// Pass auth credentials to the library client 
const client = new Client(authClient);


const STATE = "my-state";

/**
 * Home route
 */
app.get("/", (req, res) => {
    res.send(`<a href="/login" >Login to twitter</a>`)
})


/**
 * Login with Twitter route
 */
app.get("/login", async function (req, res) {
    const authUrl = authClient.generateAuthURL({
        state: STATE,
        code_challenge_method: "s256",
    });
    res.redirect(authUrl);
});

/**
 * Redirect to callback url route
 */

app.get("/callback", async function (req, res) {
    try {
        const { code, state } = req.query;

        if (state !== STATE) return res.status(500).send("State isn't matching");
        // request access token from twitter api for authenticating user
        const response = await authClient.requestAccessToken(code.toString());
        console.log(response);
        res.redirect("/success");
    } catch (error) {
        console.log(error);
    }
});


/**
 * Login success route
 */
app.get("/success", (req, res) => {
    res.send(`Login successfull <br/> <a href="/upload-tweet" >Upload your media</a>`);
})

/**
 * upload tweet route 
 */
app.get("/upload-tweet", async (req, res) => {
    // createTweet method used to make a tweet 
    // media _ids is an array of media ids which you want to add in the tweet afer uploading media at the twitter server
    const response = await client.tweets.createTweet({
        text: "Hi this is my first tweet",
    })
    console.log("tweet posted");
    res.send(response);
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port htttp://localhost:${process.env.PORT}`);
});

