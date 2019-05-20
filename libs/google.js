'use strict'

require('dotenv').config();
const { google } = require('googleapis');

const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
};

class googleApi {
    constructor() {
        const {
            client_id,
            client_secret,
            redirectUri
        } = credentials;

        this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri)
    }

    generateUrl(scopes){
        const url = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        })

        return url;
    }

    async getUserInfo(code){
        const credentials = await this.oAuth2Client.getToken(code);

        this.oAuth2Client.setCredentials(credentials.tokens);

        const plus = google.plus({
            version: 'v1',
            auth: this.oAuth2Client,
        });

        const data = await plus.people
            .get({ userId: 'me' });

        return data;
    }
}

module.exports = new googleApi();