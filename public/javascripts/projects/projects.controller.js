(function(){

    'use strict';

    angular.module('app')
        .controller('ProjectsController', function(users, projects, Projects, $modal, $state, $rootScope){
           var vm = this;
            vm.projects = projects;
            debugger;
            vm.addProject = function addProject(project) {

               var modalInstance =  $modal.open({
                    templateUrl: 'partials/projects/new.html',
                    controller: 'NewProjectCtrl',
                    controllerAs: 'newProject',
                    size: 'md'
                }).result.then(function (res){

                       Projects.post(res)
                           .then(function(res){
                               $state.go('projects');
                           });
                   });
            };


            vm.remove = Projects.del;
        });
}());