(function(){
   'use strict';

    angular.module('app')
        .controller('UsersController', function(Users, users){

            var vm = this;

            vm.users = users;

            return users;

        });

}());