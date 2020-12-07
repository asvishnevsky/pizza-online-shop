const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express()
const port = 3002

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); 

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
let local_ip_address = '127.0.0.1'
// let local_ip_address = results['ens33'][0];
// console.log(local_ip_address)

const ALLOWED_ORIGINS = [
    'http://' + local_ip_address + ':3000',
    'http://' + local_ip_address + ':80',
    'http://' + local_ip_address,
    'http://localhost:3000'
]

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(ALLOWED_ORIGINS.indexOf(origin) === -1){
            let msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload());

app.use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];
    next();
});

let users = [];

fs.access('data/users.conf', function (err) {
    if (!err) {
        fs.readFile('data/users.conf', 'utf8', function (err, data) {
            if (err) throw err;
            users = JSON.parse(data);
        });
    }
});

const authTokens = {};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
};

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

app.post('/register', (req, res) => {

    if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
        console.log(req.headers.origin + " is allowed origin");
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Origin', req.headers.origin)
    } else {
        console.log(req.headers.origin + " is unknown origin");
        res.set('Access-Control-Allow-Origin', '*');
    }

    const { name, email, password} = req.body;

    console.log(name, email, password);

    if (email === '' || email === undefined || email === null) {
        res.status('404').send({
            'msg': 'Email cannot be empty'
        });
        return;
    }
    const regexpEmail = /^[\w\.]{1,40}\w@[\w]{1,30}\.[\w]{2,10}/;
    let match = email.match(regexpEmail);
    if (!match) {
        res.status('403').send({
            'msg': 'Email is incorrect'
        });
        return;
    }

    if (users.find(user => user.email === email)) {
        console.log(email + ' is already registered.')
        res.status(300).send({
            message: 'User already registered.',
            messageClass: 'alert-danger'
        });
        return;
    }

    console.log("[*] Creating a folder for new user " + email);
    if (!fs.existsSync('data/user-data/'))
        fs.mkdirSync('data/user-data/');

    if (!fs.existsSync('data/user-data/' + email))
        fs.mkdirSync('data/user-data/' + email);

    let info = {
        name: name
    };
    if (!fs.existsSync('data/user-data/' + email + '/info.json')) {
        fs.writeFile('data/user-data/' + email + '/info.json',
            JSON.stringify(info, null, 4),  function (err, data) {
                if (err) throw err;
            });
    }

    console.log("[*] Adding user's password to security config");
    let securityConfig = [];
    const hashedPassword = getHashedPassword(password);

    fs.access('data/users.conf', function (err)  {
        if (!err) {
            console.log('[*] File data/users.conf exists');
            fs.copyFile('data/users.conf', 'data/users.conf.backup', function (err) {
                if (err) throw err;
                console.log('[*] Reserve copy of config saved to "users.conf.backup"');
                fs.readFile('data/users.conf', 'utf8', function (err, data) {
                    if (err) throw err;
                    securityConfig = JSON.parse(data);
                    let lastId = 0;
                    if (Object.keys(securityConfig).length > 0)
                        lastId = parseInt(Object.keys(securityConfig)[Object.keys(securityConfig).length - 1]);

                    securityConfig.push({
                        id: lastId + 2,
                        firstName: name,
                        lastName: name,
                        email: email,
                        password: hashedPassword
                    });
                    console.log(securityConfig.map((i) => i.email));
                    fs.writeFile('data/users.conf',
                        JSON.stringify(securityConfig, null, 4),  function (err, data) {
                            if (err) throw err;
                            users = securityConfig;
                            console.log('[*] New users list:');
                            console.log(users);
                            res.status(201).send({
                                message: 'Registration Complete. Please login to continue.',
                                messageClass: 'alert-success'
                            });
                        });
                })
            });
        } else {
            console.log('[*] File data/users.conf doesn`t exist');
            securityConfig.push({
                firstName: name,
                lastName: name,
                email: email,
                password: hashedPassword
            });
            console.log(securityConfig.map((i) => i.email));
            fs.writeFileSync('ata/users.conf',
                JSON.stringify(securityConfig, null, 4),  function (err, data) {
                    if (err) throw err;
                    users = securityConfig;
                });
        }
    });
});

app.post('/login', (req, res) => {
    console.log (req.headers.origin);
    if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
        console.log('/login ' + req.headers.origin + " is allowed origin");
        res.set('Access-Control-Allow-Credentials', 'true')
        res.set('Access-Control-Allow-Origin', req.headers.origin)
    } else {
        console.log('/login ' + req.headers.origin + " is unknown origin");
        res.set('Access-Control-Allow-Origin', '*')
    }

    console.log('login server method POST');
    const { email, password } = req.body;
    console.log(email, password)

    const hashedPassword = getHashedPassword(password);

    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    console.log(user)

    if (user) {
        console.log("Authenticated as user = " + user.email);
        const authToken = generateAuthToken();
        console.log('correct authToken = ' + authToken);
        authTokens[authToken] = user;
        res.cookie('AuthToken', authToken);
        res.send({'authenticated': true, 'user_id': user.email});
    } else {
        res.status(500).send({'authenticated': false});
    }
});

app.get('/protected', (req, res) => {
    if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
        console.log('/protected ' + req.headers.origin + " is allowed origin");
        res.set('Access-Control-Allow-Credentials', 'true')
        res.set('Access-Control-Allow-Origin', req.headers.origin)
    } else {
        console.log('/protected ' + req.headers.origin + " is unknown origin");
        res.set('Access-Control-Allow-Origin', '*')
    }

    console.log('protected server method GET');
    if (req.user) {
        res.send({'authenticated': true, 'user_id': req.user.email});
    } else {
        res.send({'authenticated': false});
    }
});

app.get('/quit', (req, res) => {
    if (req.user) {
        console.log(req.user.email + " escaped");
        delete authTokens[req.cookies['AuthToken']];
    } else {
        console.log("Unauthorized user tried to escape");
    }
});

app.get('/assortment', (req, res) => {
    if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
        console.log(req.headers.origin + " is allowed origin");
        res.set('Access-Control-Allow-Credentials', 'true')
        res.set('Access-Control-Allow-Origin', req.headers.origin)
    } else {
        console.log(req.headers.origin + " is unknown origin");
        res.set('Access-Control-Allow-Origin', '*')
    }

    fs.readFile('data/pizzas.json', 'utf8', function (err, data) {
        if (err) throw err;
        let info = JSON.parse(data);
        res.send(info);
    });
    
});

app.get('/person', (req, res) => {
    if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
        console.log(req.headers.origin + " is allowed origin");
        res.set('Access-Control-Allow-Credentials', 'true')
        res.set('Access-Control-Allow-Origin', req.headers.origin)
    } else {
        console.log(req.headers.origin + " is unknown origin");
        res.set('Access-Control-Allow-Origin', '*')
    }

    if (req.user) {
        fs.readFile('data/user-data/' + req.user.email + '/info.json', 'utf8', function (err, data) {
            if (err) throw err;
            let info = JSON.parse(data);
            res.send(info);
        });
    } else {
        console.log("Unauthorized user tried to get user information");
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


