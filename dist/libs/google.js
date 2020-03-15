'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();

var _require = require('googleapis'),
    google = _require.google;

var credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
};

var googleApi = function () {
    function googleApi() {
        _classCallCheck(this, googleApi);

        var client_id = credentials.client_id,
            client_secret = credentials.client_secret,
            redirectUri = credentials.redirectUri;


        this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
    }

    _createClass(googleApi, [{
        key: 'generateUrl',
        value: function generateUrl(scopes) {
            var url = this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });

            return url;
        }
    }, {
        key: 'getUserInfo',
        value: async function getUserInfo(code) {
            var credentials = await this.oAuth2Client.getToken(code);

            this.oAuth2Client.setCredentials(credentials.tokens);

            var plus = google.plus({
                version: 'v1',
                auth: this.oAuth2Client
            });

            var data = await plus.people.get({ userId: 'me' });

            return data;
        }
    }]);

    return googleApi;
}();

module.exports = new googleApi();