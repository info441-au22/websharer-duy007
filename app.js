import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'
// ymI8Q~viiCuICbSC32Nm55SFif0SOeynF7I8taVt
const appSettings = {
    appCredentials: {
        clientId:  "b13d17f1-6204-4114-93d1-36adb15367ab",
        tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret:  "ymI8Q~viiCuICbSC32Nm55SFif0SOeynF7I8taVt"
    },	
    authRoutes: {
        redirect: "https://info441.dhnguyen.me/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

import apiv1Router from './routes/v1/apiv1.js';
import apiv2Router from './routes/v2/apiv2.js';
import apiv3Router from './routes/v3/apiv3.js';
import models from './models.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.models = models;
    next();
});
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "#_#8dfDUYd7y0adyf-9a8ydf89dyf9ya-D",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

app.get('/signin', 
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized")
})

app.use('/api/v3', apiv3Router);
app.use('/api/v2', apiv2Router);
app.use('/api', apiv1Router);

export default app;
