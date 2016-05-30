var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MVNO ROOM' });
});

/* GET list page. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection_rooms = db.get('rooms');
    collection_rooms.find({},{}, function(e, docs) {
        res.render('list', { "roomlist" : docs });
    });
});

// set routes
router.get('/rooms', function(req, res) {
    Room.find({}, function(err, rooms) {
        if(err) return res.json({success:false, message:err});
        res.json({success:true, data:rooms});
    });
});

router.post('/login', function(req, res) {
    Room.create(req.body.post, function(err, room) {
        if(err) return res.json({success:false, message:err});
        res.json({success:true, data:room});
        });
});

router.get('/rooms/:id', function(req, res) {
    Room.findById(req.params.id, function(err, room) {
        if(err) return res.json({success:false, message:err});
        res.json({success:true, data:room});
    });
});

router.put('/rooms/:id', function(req, res) {
    req.body.post.updatedAt=Date.now();
    Room.findByIdAndUpdate(req.params.id, req.body.room, function(err, room) {
        if(err) return res.json({success:false, message:err});
        res.json({success:true, message:room._id+" updated"});
    });
});
router.delete('/rooms/:id', function(req, res) {
    Room.findByIdAndRemove(req.params.id, function(err, room) {
        if(err) return res.json({success:false, message:err});
        res.json({success:true, message:room._id+" deleted"});
    });
});



module.exports = router;
