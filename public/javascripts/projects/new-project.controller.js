(function(){
    'use strict';

    angular.module('app')
        .controller('NewProjectCtrl', function($scope, $modalInstance, Users){
            var vm = this;
            vm.users = Users.users;
            vm.project = {user: _.first(vm.users)._id};


            vm.close = function close(){
                //this function closes and saves the inputted information
                $modalInstance.close(vm.project);
            };

            vm.dismiss = function dismiss(){
                //this function voids any further action and returns to previous state
                $modalInstance.dismiss();
            };

        });

}());