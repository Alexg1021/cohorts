(function(){
    'use strict';

    angular.module('app')
        .service('Projects', function($http, $state, Users){

            var vm = this;

            vm.projects = [];
            /**
             * Our main projects storage
             *
             * @type {array}
             *
             */

            vm.find = function find(projectId){
                return _.find(vm.projects, {_id: projectId});
            };

            vm.get = function get(){
                return $http.get('/projects')
                    .then(function (res){
                        vm.projects.splice(0);
                        res.data.forEach(function(project){
                            project.user = Users.find(project.user);
                            vm.projects.push(project);
                        });
                        return vm.projects;
                    });
            };


            vm.post = function post(project){

                return $http.post('/projects/', project)
                    .then(function(res){
                        res.data.user = Users.find(res.data.user);

                        vm.projects.push(res.data);

                        $state.go('projects', {projectId: project._id});
                }, function(err){
                });

            };



            vm.put = function put(projectCopy){

                var data = {
                        title: projectCopy.title,
                        user: projectCopy.user._id
                };
                return $http.put('/projects/' + projectCopy._id, data)
                    .then(function(res){

                        var p = vm.find(projectCopy._id);
                        _.merge(p, projectCopy);
                        $state.go('projects.detail', {projectId: projectCopy._id});

                }, function(err){

                });
            };

            vm.remove = function remove(projectId){
                _.remove(vm.projects, {_id: projectId});
            };

            vm.del = function del(projectId) {
                return $http.delete('/projects/' + projectId)
                    .then(function (res) {
                        vm.remove(projectId);
                        $state.go('projects');
                    });
            };

        });

}());


//vm.post = function post(project){
//    return $http.post('/projects/')
//        .then(function(res){
//            vm.projects.push(res.data);
//
//        });
//};