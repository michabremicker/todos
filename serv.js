var express = require('express');
var router = express();

router.use(express.static('public'));

// get home
router.get('/', function(req, res) {
	res.sendFile('index');
});

router.listen(8080);
module.exports = router;

console.log('index loaded');