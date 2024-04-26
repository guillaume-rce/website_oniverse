const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = './img';
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        callback(null, fileName);
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use('/img', express.static('img'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const content = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'content',
});

const internal = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_data',
});

content.connect(err => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err);
    } else {
        console.log('Connexion à MySQL pour la base de données "content" réussie !');
    }
});

internal.connect(err => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err);
    } else {
        console.log('Connexion à MySQL pour la base de données "internal_data" réussie !');
    }
});

app.get('/games/', (req, res, next) => {
    const query = `
        SELECT 
            games.id, games.name, games.description, games.price, games.url,
            images.id AS image_id, images.path AS image_path, 
            images.isLight AS image_isLight, images.uploadDateTime AS image_uploadDateTime
        FROM games
        JOIN images ON games.image = images.id`;

    content.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur requête SELECT.' });
        } else {
            const formattedResults = results.map(game => ({
                id: game.id,
                name: game.name,
                description: game.description,
                image: {
                    id: game.image_id,
                    path: game.image_path,
                    isLight: game.image_isLight,
                    uploadDateTime: game.image_uploadDateTime
                },
                price: game.price,
                url: game.url
            }));
            res.status(200).json(formattedResults);
        }
    });
});



app.get('/images/', (req, res, next) => {
    content.query('SELECT * FROM images', (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur requête SELECT.' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/games/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
    }

    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;
    const gameId = req.body.gameId;
    const isLight = req.body.isLight === 'true' ? 1 : 0;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Erreur lors de l\'initialisation de la transaction :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de la transaction.' });
        }

        try {
            const insertImageQuery = 'INSERT INTO images (path, isLight) VALUES (?, ?)';
            const [imageResults] = await content.promise().query(insertImageQuery, [imageUrl, isLight]);

            const imageId = imageResults.insertId;
            const updateGameQuery = 'UPDATE games SET image = ? WHERE id = ?';
            await content.promise().query(updateGameQuery, [imageId, gameId]);

            content.commit((err) => {
                if (err) {
                    console.error('Erreur lors de la validation de la transaction :', err);
                    return res.status(500).json({ error: 'Erreur serveur lors de la validation de la transaction.' });
                }
                res.status(200).json({ imageUrl: imageUrl, imageId: imageId });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Erreur lors de la mise à jour des données :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des données.' });
            });
        }
    });
});

app.post('/signup/', (req, res, next) => {
    console.log("req.body:", req.body);
    const { email, password, pseudo } = req.body;
    console.log("email:", email, ";password:", password, ";pseudo:", pseudo);
    if (email && password && pseudo) {
        bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) {
                console.error('Erreur lors du hachage du mot de passe :', hashError);
                res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur.' });
            } else {
                const query = 'INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)';
                const values = [pseudo, email, hashedPassword || null];
                internal.query(query, values, (error, results) => {
                    if (error) {
                        console.error('Erreur lors de l\'insertion de l\'utilisateur dans la base de données :', error);
                        res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur.' });
                    } else {
                        const userId = results.insertId;
                        res.status(201).json({
                            message: 'Utilisateur créé avec succès.',
                            userId: userId
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).json({ error: 'Email, mot de passe et pseudo sont requis pour l\'inscription.' });
    }
});

app.post('/login/', (req, res, next) => {
    const { email, password } = req.body;
    internal.query('SELECT id, password FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', error);
            res.status(500).json({ error: 'Erreur serveur lors de l\'authentification.' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                const hashedPasswordFromDB = user.password;
                // Comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données
                bcrypt.compare(password, hashedPasswordFromDB, (compareError, match) => {
                    if (compareError) {
                        console.error('Erreur lors de la comparaison des mots de passe :', compareError);
                        res.status(500).json({ error: 'Erreur serveur lors de l\'authentification.' });
                    } else if (match) {
                        const userId = user.id;
                        const token = jwt.sign({ userId }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                        res.status(200).json({ userId: userId, token: token });
                    } else {
                        res.status(401).json({ error: 'Identifiants incorrects.' });
                    }
                });
            } else {
                res.status(401).json({ error: 'Identifiants incorrects.' });
            }
        }
    });
});

// Upload profile image
app.post('/user/uploadProfileImage', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
    }

    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;
    const userId = req.headers.userid;
    const token = req.headers.token;

    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
        if (err || decodedToken.userId !== parseInt(userId)) {
            return res.status(401).json({ error: 'Requête non autorisée.' });
        }

        const query = 'UPDATE users SET image = ? WHERE id = ?';
        internal.query(query, [imageUrl, userId], (error) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de l\'image de profil :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'image de profil.' });
            } else {
                res.status(200).json({ profileImage: imageUrl });
            }
        });
    });
});

app.get('/user/:id', (req, res, next) => {
    const userId = req.params.id;
    internal.query('SELECT id, pseudo, email, banner, image, bio, registrationDateTime FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la recherche de l\'utilisateur.' });
        } else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet ID.' });
            }
        }
    });
});

app.get('/games/:id', (req, res, next) => {
    const gameId = req.params.id;
    const query = `
        SELECT games.*, images.id as image_id, images.path as image_path, 
               images.isLight as image_isLight, images.uploadDateTime as image_uploadDateTime
        FROM games
        LEFT JOIN images ON games.image = images.id
        WHERE games.id = ?`;

    content.query(query, [gameId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            if (results.length > 0) {
                const game = results[0];
                const formattedResult = {
                    id: game.id,
                    name: game.name,
                    description: game.description,
                    image: {
                        id: game.image_id,
                        path: game.image_path,
                        isLight: game.image_isLight,
                        uploadDateTime: game.image_uploadDateTime
                    },
                    price: game.price,
                    url: game.url
                };
                res.status(200).json(formattedResult);
            } else {
                res.status(404).json({ error: 'Aucun jeu trouvé avec cet ID.' });
            }
        }
    });
});


app.get('/images/:id', (req, res, next) => {
    const vetementId = req.params.id;
    content.query('SELECT * FROM images WHERE id = ?', [vetementId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Aucune image trouvé avec cet ID.' });
            }
        }
    });
});

module.exports = app;
