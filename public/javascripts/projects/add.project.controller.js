(function(){

    'use strict';

    angular.module('app')
        .controller('AddProjectController', function(Projects){
            var vm = this;
            vm.project = {};
            vm.save = Projects.post;
        });
}());