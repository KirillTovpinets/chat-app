const express = require('express');
const { registerUser, loginUser, logout } = require('../controllers/account.controller');
const { getChatUsers } = require('../controllers/chat.controller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);

router.get('/chat-users', getChatUsers);


module.exports = router;