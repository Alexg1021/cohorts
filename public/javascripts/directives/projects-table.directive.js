(function(){

   'use strict';
//Directives are always dash syntax (angular-dash) on the html, but it is camel casing inside the directive
    //So, project-table on html and projectTable in directive

    angular.module('app.ui')
        .directive('projectTable', function(){



            //CREATE THE DDO (Directive Definition Object)
            return{

                restrict: 'E',
                templateUrl: 'partials/directives/project-table.html',
                scope: {
                    projects: '=',
                    remove: '='
                }

            };
        });


}());