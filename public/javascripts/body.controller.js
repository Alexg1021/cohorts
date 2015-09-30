(function(){

   'use strict';

    //when two arguments (paramaters) it defines the module, when one it is using it
    angular.module('app')
        .controller('BodyController', function($http, Projects){
           var vm = this;

            vm.welcome = 'Hello there!';


            Projects.get()
                .then(function(projects){
                    //debugger;
                    vm.projects = Projects.projects;
                });

        });

}());