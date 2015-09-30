(function(){

    'use strict';

    angular.module('app')
        .controller('EditProjectController', function(project, Projects, Users){
            var vm = this;
            vm.users = Users.users;
            vm.project = project;
            vm.projectCopy = _.clone(project);
            vm.update = Projects.put;
        });
}());
