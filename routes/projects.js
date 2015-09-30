var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project');


router.param('projectId', function(req, res, next, projectId){

    Project.findById(projectId).populate('user').exec(function (err, project){
        if (err) return res.sendStatus(404);
        req.project = project;
        next();
    });
});

/* GET users listing. */
router.get('/', function(req, res) {

    Project.find(function (err, projects){
         res.json(projects);
        });
});

router.post('/', function(req, res){

    var project = new Project(req.body);
    project.save(function(err){
        if (err) return res.status(400).json(err);
            res.json(project);

    });
});

router.put('/:projectId', function(req, res){

    req.project.update({$set: req.body}, {new: true}, function(err, project){
        res.sendStatus(200);
    });

});


router.get('/:projectId', function(req, res){
    res.render('projects/detail', {title: 'Projects', project: req.project});
});

router.delete('/:projectId', function (req, res) {
    Project.findByIdAndRemove(req.params.projectId, function (err) {
        if (err) return res.status(400).json(err);
        res.sendStatus(200);
    });
});


//
//router.get('/email', function(req, res) {
//
//});



module.exports = router;
