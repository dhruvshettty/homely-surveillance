const ejsMate = require('ejs-mate');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const PassportLocalStrategy = require('passport-local');
const session = require('express-session');
const socketIO = require('socket.io');
const http = require('http');
const ExpressError = require('./utils/ExpressError');
const { isLoggedIn } = require('./middlewares/isLoggedIn');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const verificationRoutes = require('./routes/verification');

// Mongoose congifuration
mongoose.connect('mongodb://localhost:27017/homely', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected.');
});

// Express configuration
const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Session configuration
const sessionConfig = {
    secret: 'willchangeinproduction',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7),
    },
};
app.use(session(sessionConfig));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Server configuration
const server = http.createServer(app);
const io = socketIO(server);

// Required in implementation of isLoggedIn middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/verification', verificationRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 400));
});

app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = 'Oh no, something went wrong :(';
    res.status(err.statusCode).render('error', { err });
});

io.sockets.on('connection', (socket) => {
    socket.on('message', (message) => {
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
    });

    socket.on('create or join', (room) => {
        console.log(`Received request to create or join room '${room}'`);

        const clientsInRoom = io.sockets.adapter.rooms[room];
        const numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        console.log(`Room ${room} now has ${numClients} client(s)`);

        if (numClients === 0) {
            socket.join(room);
            console.log(`Client ID ${socket.id} created room ${room}`);
            socket.emit('created', room, socket.id);
        } else if (numClients === 1) {
            console.log(`Client ID ${socket.id} joined room ${room}`);
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready');
        } else { // Allowing max two clients
            socket.emit('full', room);
        }
    });

    socket.on('bye', () => {
        console.log('received bye');
    });
});

server.listen(3000, () => {
    console.log('Serving on Port 3000');
});
