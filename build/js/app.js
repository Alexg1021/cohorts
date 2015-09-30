(function(){

    'use strict';

    //two ways to use angular module 1. creating a module 2. adding or using the module

    angular.module('app', ['ui.router', 'app.ui', 'ui.bootstrap'])
        .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
            /**
             *
             * Default Route
             *
             */
            $urlRouterProvider.otherwise('/projects');

            /**
             *
             * Define our states.
             *
             */

            $stateProvider
                .state('projects', {
                   url: '/projects',
                    templateUrl: 'partials/projects/index.html',
                    controller: 'ProjectsController',
                    controllerAs: 'projectsController',
                    resolve:{
                        users: ["Users", function (Users){
                            debugger;

                            return Users.get();
                        }],
                        projects: ["Projects", "users", function (Projects, users){

                            return Projects.get();
                        }]
                    }
                })
                .state('users',{
                    url: '/users',
                    templateUrl: 'partials/projects/users.html',
                    controller: 'UsersController',
                    controllerAs: 'usersController',
                    resolve: {
                        users: ["Users", function (Users){

                            return Users.get();

                        }]
                    }

                })
                .state('projects.add', {
                    url: '/add',
                    templateUrl: 'partials/projects/add.html',
                    controller: 'AddProjectController',
                    controllerAs: 'addProjectController'
                })
                .state('users.add', {
                    url: '/add-user',
                    templateUrl: 'partials/projects/add-user.html',
                    controller: 'AddUserController',
                    controllerAs: 'addUserController'
                })
                .state('projects.detail',{
                    url: '/:projectId',
                    templateUrl: 'partials/projects/detail.html',
                    controller: 'ProjectController',
                    controllerAs: 'projectController',
                    resolve: {
                        project: ["Projects", "$stateParams", "projects", function (Projects, $stateParams, projects) {
                            return Projects.find($stateParams.projectId);
                        }]
                    }
                })
                .state('projects.detail.edit', {
                    url:'/edit',
                    templateUrl: 'partials/projects/edit.html',
                    controller: 'EditProjectController',
                    controllerAs: 'editProjectController'
                });

        }]);

    //controllers are the things that link the view(html) with the data




}());
(function(){

   'use strict';

    angular.module('app.ui', []);



}());
(function(){

   'use strict';

    //when two arguments (paramaters) it defines the module, when one it is using it
    angular.module('app')
        .controller('BodyController', ["$http", "Projects", function($http, Projects){
           var vm = this;

            vm.welcome = 'Hello there!';


            Projects.get()
                .then(function(projects){
                    //debugger;
                    vm.projects = Projects.projects;
                });

        }]);

}());
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
(function(){
   'use strict';

    angular.module('app')
        .factory('User', function(){
            function User(data){

                //lodash function that attaches 'this' to properties
                _.merge(this, {
                    first_name: '',
                    last_name: '',
                    email: ''
                }, data || {});
            }

            User.prototype = {
                fullName: function fullName(){

                    return this.first_name + ' ' + this.last_name;
                }
            };

            return User;
        });
}());
(function(){

    'use strict';

    angular.module('app.ui')
        .filter('niceDate', function(){
            return function(timeStamp, format){

                format = format || 'MMMM Do, YYYY';
                var m = moment(timeStamp);
                return m.format(format);


            };
        });


}());
(function(){

    'use strict';

    angular.module('app')
        .controller('AddProjectController', ["Projects", function(Projects){
            var vm = this;
            vm.project = {};
            vm.save = Projects.post;
        }]);
}());
(function(){

    'use strict';

    angular.module('app')
        .controller('EditProjectController', ["project", "Projects", "Users", function(project, Projects, Users){
            var vm = this;
            vm.users = Users.users;
            vm.project = project;
            vm.projectCopy = _.clone(project);
            vm.update = Projects.put;
        }]);
}());

(function(){
    'use strict';

    angular.module('app')
        .controller('NewProjectCtrl', ["$scope", "$modalInstance", "Users", function($scope, $modalInstance, Users){
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

        }]);

}());
(function(){

    'use strict';

    angular.module('app')
        .controller('ProjectController', ["project", "Projects", function(project, Projects){

            var vm = this;
            vm.project = project;
            vm.del = Projects.del;

        }]);

}());
(function(){

    'use strict';

    angular.module('app')
        .controller('ProjectsController', ["users", "projects", "Projects", "$modal", "$state", "$rootScope", function(users, projects, Projects, $modal, $state, $rootScope){
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
        }]);
}());
(function(){
   'use strict';

    angular.module('app')
        .controller('UsersController', ["Users", "users", function(Users, users){

            var vm = this;

            vm.users = users;

            return users;

        }]);

}());
(function(){
    'use strict';

    angular.module('app')
        .service('Projects', ["$http", "$state", "Users", function($http, $state, Users){

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

        }]);

}());


//vm.post = function post(project){
//    return $http.post('/projects/')
//        .then(function(res){
//            vm.projects.push(res.data);
//
//        });
//};
(function(){
    'use strict';

    angular.module('app')
        .service('Users', ["$http", "User", function($http, User){
                var vm = this;

                vm.users = [];

            vm.find = function find(userId){
                return _.find(vm.users, {_id: userId});
            };

                vm.get = function get() {
                    return $http.get('/users')
                        .then(function (res) {
                            vm.users.splice(0);

                            res.data.forEach(function (user) {
                                vm.users.push(new User(user));
                            });

                            return vm.users;
                        });
                };



            /**
             *
             * Get all users from the database
             */

        }]);
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJ1aS5tb2R1bGUuanMiLCJib2R5LmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL3Byb2plY3RzLXRhYmxlLmRpcmVjdGl2ZS5qcyIsImZhY3Rvcmllcy91c2VyLmZhY3RvcnkuanMiLCJmaWx0ZXJzL2RhdGUuZmlsdGVyLmpzIiwicHJvamVjdHMvYWRkLnByb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL2VkaXQucHJvamVjdC5jb250cm9sbGVyLmpzIiwicHJvamVjdHMvbmV3LXByb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL3Byb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL3Byb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy91c2Vycy5jb250cm9sbGVyLmpzIiwic2VydmljZXMvcHJvamVjdHMuc2VydmljZS5qcyIsInNlcnZpY2VzL3VzZXJzLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBOztJQUVBOzs7O0lBSUEsUUFBQSxPQUFBLE9BQUEsQ0FBQSxhQUFBLFVBQUE7U0FDQSxnREFBQSxTQUFBLGdCQUFBLG1CQUFBOzs7Ozs7WUFNQSxtQkFBQSxVQUFBOzs7Ozs7OztZQVFBO2lCQUNBLE1BQUEsWUFBQTttQkFDQSxLQUFBO29CQUNBLGFBQUE7b0JBQ0EsWUFBQTtvQkFDQSxjQUFBO29CQUNBLFFBQUE7d0JBQ0EsaUJBQUEsVUFBQSxNQUFBOzRCQUNBOzs0QkFFQSxPQUFBLE1BQUE7O3dCQUVBLGdDQUFBLFVBQUEsVUFBQSxNQUFBOzs0QkFFQSxPQUFBLFNBQUE7Ozs7aUJBSUEsTUFBQSxRQUFBO29CQUNBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7b0JBQ0EsU0FBQTt3QkFDQSxpQkFBQSxVQUFBLE1BQUE7OzRCQUVBLE9BQUEsTUFBQTs7Ozs7O2lCQU1BLE1BQUEsZ0JBQUE7b0JBQ0EsS0FBQTtvQkFDQSxhQUFBO29CQUNBLFlBQUE7b0JBQ0EsY0FBQTs7aUJBRUEsTUFBQSxhQUFBO29CQUNBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7O2lCQUVBLE1BQUEsa0JBQUE7b0JBQ0EsS0FBQTtvQkFDQSxhQUFBO29CQUNBLFlBQUE7b0JBQ0EsY0FBQTtvQkFDQSxTQUFBO3dCQUNBLGtEQUFBLFVBQUEsVUFBQSxjQUFBLFVBQUE7NEJBQ0EsT0FBQSxTQUFBLEtBQUEsYUFBQTs7OztpQkFJQSxNQUFBLHdCQUFBO29CQUNBLElBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7Ozs7Ozs7Ozs7O0FDaEZBLENBQUEsVUFBQTs7R0FFQTs7SUFFQSxRQUFBLE9BQUEsVUFBQTs7Ozs7QUNKQSxDQUFBLFVBQUE7O0dBRUE7OztJQUdBLFFBQUEsT0FBQTtTQUNBLFdBQUEsd0NBQUEsU0FBQSxPQUFBLFNBQUE7V0FDQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxVQUFBOzs7WUFHQSxTQUFBO2lCQUNBLEtBQUEsU0FBQSxTQUFBOztvQkFFQSxHQUFBLFdBQUEsU0FBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBOztHQUVBOzs7O0lBSUEsUUFBQSxPQUFBO1NBQ0EsVUFBQSxnQkFBQSxVQUFBOzs7OztZQUtBLE1BQUE7O2dCQUVBLFVBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxPQUFBO29CQUNBLFVBQUE7b0JBQ0EsUUFBQTs7Ozs7Ozs7QUNsQkEsQ0FBQSxVQUFBO0dBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsUUFBQSxRQUFBLFVBQUE7WUFDQSxTQUFBLEtBQUEsS0FBQTs7O2dCQUdBLEVBQUEsTUFBQSxNQUFBO29CQUNBLFlBQUE7b0JBQ0EsV0FBQTtvQkFDQSxPQUFBO21CQUNBLFFBQUE7OztZQUdBLEtBQUEsWUFBQTtnQkFDQSxVQUFBLFNBQUEsVUFBQTs7b0JBRUEsT0FBQSxLQUFBLGFBQUEsTUFBQSxLQUFBOzs7O1lBSUEsT0FBQTs7O0FDdEJBLENBQUEsVUFBQTs7SUFFQTs7SUFFQSxRQUFBLE9BQUE7U0FDQSxPQUFBLFlBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQSxXQUFBLE9BQUE7O2dCQUVBLFNBQUEsVUFBQTtnQkFDQSxJQUFBLElBQUEsT0FBQTtnQkFDQSxPQUFBLEVBQUEsT0FBQTs7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7O0lBRUE7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsV0FBQSxxQ0FBQSxTQUFBLFNBQUE7WUFDQSxJQUFBLEtBQUE7WUFDQSxHQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsU0FBQTs7O0FDUkEsQ0FBQSxVQUFBOztJQUVBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFdBQUEsMERBQUEsU0FBQSxTQUFBLFVBQUEsTUFBQTtZQUNBLElBQUEsS0FBQTtZQUNBLEdBQUEsUUFBQSxNQUFBO1lBQ0EsR0FBQSxVQUFBO1lBQ0EsR0FBQSxjQUFBLEVBQUEsTUFBQTtZQUNBLEdBQUEsU0FBQSxTQUFBOzs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsV0FBQSx3REFBQSxTQUFBLFFBQUEsZ0JBQUEsTUFBQTtZQUNBLElBQUEsS0FBQTtZQUNBLEdBQUEsUUFBQSxNQUFBO1lBQ0EsR0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsR0FBQSxPQUFBOzs7WUFHQSxHQUFBLFFBQUEsU0FBQSxPQUFBOztnQkFFQSxlQUFBLE1BQUEsR0FBQTs7O1lBR0EsR0FBQSxVQUFBLFNBQUEsU0FBQTs7Z0JBRUEsZUFBQTs7Ozs7O0FDakJBLENBQUEsVUFBQTs7SUFFQTs7SUFFQSxRQUFBLE9BQUE7U0FDQSxXQUFBLDZDQUFBLFNBQUEsU0FBQSxTQUFBOztZQUVBLElBQUEsS0FBQTtZQUNBLEdBQUEsVUFBQTtZQUNBLEdBQUEsTUFBQSxTQUFBOzs7OztBQ1RBLENBQUEsVUFBQTs7SUFFQTs7SUFFQSxRQUFBLE9BQUE7U0FDQSxXQUFBLDBGQUFBLFNBQUEsT0FBQSxVQUFBLFVBQUEsUUFBQSxRQUFBLFdBQUE7V0FDQSxJQUFBLEtBQUE7WUFDQSxHQUFBLFdBQUE7WUFDQTtZQUNBLEdBQUEsYUFBQSxTQUFBLFdBQUEsU0FBQTs7ZUFFQSxJQUFBLGlCQUFBLE9BQUEsS0FBQTtvQkFDQSxhQUFBO29CQUNBLFlBQUE7b0JBQ0EsY0FBQTtvQkFDQSxNQUFBO21CQUNBLE9BQUEsS0FBQSxVQUFBLElBQUE7O3VCQUVBLFNBQUEsS0FBQTs0QkFDQSxLQUFBLFNBQUEsSUFBQTsrQkFDQSxPQUFBLEdBQUE7Ozs7OztZQU1BLEdBQUEsU0FBQSxTQUFBOzs7QUMxQkEsQ0FBQSxVQUFBO0dBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsV0FBQSxzQ0FBQSxTQUFBLE9BQUEsTUFBQTs7WUFFQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxRQUFBOztZQUVBLE9BQUE7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsUUFBQSx5Q0FBQSxTQUFBLE9BQUEsUUFBQSxNQUFBOztZQUVBLElBQUEsS0FBQTs7WUFFQSxHQUFBLFdBQUE7Ozs7Ozs7O1lBUUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxVQUFBO2dCQUNBLE9BQUEsRUFBQSxLQUFBLEdBQUEsVUFBQSxDQUFBLEtBQUE7OztZQUdBLEdBQUEsTUFBQSxTQUFBLEtBQUE7Z0JBQ0EsT0FBQSxNQUFBLElBQUE7cUJBQ0EsS0FBQSxVQUFBLElBQUE7d0JBQ0EsR0FBQSxTQUFBLE9BQUE7d0JBQ0EsSUFBQSxLQUFBLFFBQUEsU0FBQSxRQUFBOzRCQUNBLFFBQUEsT0FBQSxNQUFBLEtBQUEsUUFBQTs0QkFDQSxHQUFBLFNBQUEsS0FBQTs7d0JBRUEsT0FBQSxHQUFBOzs7OztZQUtBLEdBQUEsT0FBQSxTQUFBLEtBQUEsUUFBQTs7Z0JBRUEsT0FBQSxNQUFBLEtBQUEsY0FBQTtxQkFDQSxLQUFBLFNBQUEsSUFBQTt3QkFDQSxJQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBOzt3QkFFQSxHQUFBLFNBQUEsS0FBQSxJQUFBOzt3QkFFQSxPQUFBLEdBQUEsWUFBQSxDQUFBLFdBQUEsUUFBQTttQkFDQSxTQUFBLElBQUE7Ozs7Ozs7WUFPQSxHQUFBLE1BQUEsU0FBQSxJQUFBLFlBQUE7O2dCQUVBLElBQUEsT0FBQTt3QkFDQSxPQUFBLFlBQUE7d0JBQ0EsTUFBQSxZQUFBLEtBQUE7O2dCQUVBLE9BQUEsTUFBQSxJQUFBLGVBQUEsWUFBQSxLQUFBO3FCQUNBLEtBQUEsU0FBQSxJQUFBOzt3QkFFQSxJQUFBLElBQUEsR0FBQSxLQUFBLFlBQUE7d0JBQ0EsRUFBQSxNQUFBLEdBQUE7d0JBQ0EsT0FBQSxHQUFBLG1CQUFBLENBQUEsV0FBQSxZQUFBOzttQkFFQSxTQUFBLElBQUE7Ozs7O1lBS0EsR0FBQSxTQUFBLFNBQUEsT0FBQSxVQUFBO2dCQUNBLEVBQUEsT0FBQSxHQUFBLFVBQUEsQ0FBQSxLQUFBOzs7WUFHQSxHQUFBLE1BQUEsU0FBQSxJQUFBLFdBQUE7Z0JBQ0EsT0FBQSxNQUFBLE9BQUEsZUFBQTtxQkFDQSxLQUFBLFVBQUEsS0FBQTt3QkFDQSxHQUFBLE9BQUE7d0JBQ0EsT0FBQSxHQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0VBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFFBQUEsMkJBQUEsU0FBQSxPQUFBLEtBQUE7Z0JBQ0EsSUFBQSxLQUFBOztnQkFFQSxHQUFBLFFBQUE7O1lBRUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBO2dCQUNBLE9BQUEsRUFBQSxLQUFBLEdBQUEsT0FBQSxDQUFBLEtBQUE7OztnQkFHQSxHQUFBLE1BQUEsU0FBQSxNQUFBO29CQUNBLE9BQUEsTUFBQSxJQUFBO3lCQUNBLEtBQUEsVUFBQSxLQUFBOzRCQUNBLEdBQUEsTUFBQSxPQUFBOzs0QkFFQSxJQUFBLEtBQUEsUUFBQSxVQUFBLE1BQUE7Z0NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBOzs7NEJBR0EsT0FBQSxHQUFBOzs7Ozs7Ozs7Ozs7S0FZQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vdHdvIHdheXMgdG8gdXNlIGFuZ3VsYXIgbW9kdWxlIDEuIGNyZWF0aW5nIGEgbW9kdWxlIDIuIGFkZGluZyBvciB1c2luZyB0aGUgbW9kdWxlXG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInLCAnYXBwLnVpJywgJ3VpLmJvb3RzdHJhcCddKVxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogRGVmYXVsdCBSb3V0ZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3Byb2plY3RzJyk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIERlZmluZSBvdXIgc3RhdGVzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC5zdGF0ZSgncHJvamVjdHMnLCB7XG4gICAgICAgICAgICAgICAgICAgdXJsOiAnL3Byb2plY3RzJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9pbmRleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RzQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3Byb2plY3RzQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6e1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnM6IGZ1bmN0aW9uIChVc2Vycyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlcnMuZ2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdHM6IGZ1bmN0aW9uIChQcm9qZWN0cywgdXNlcnMpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb2plY3RzLmdldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3VzZXJzJyx7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy91c2VycycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvdXNlcnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc2Vyc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd1c2Vyc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyczogZnVuY3Rpb24gKFVzZXJzKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2Vycy5nZXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgncHJvamVjdHMuYWRkJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYWRkJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9hZGQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRQcm9qZWN0Q29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2FkZFByb2plY3RDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCd1c2Vycy5hZGQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hZGQtdXNlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvYWRkLXVzZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRVc2VyQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2FkZFVzZXJDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwnLHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLzpwcm9qZWN0SWQnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb2plY3RzL2RldGFpbC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncHJvamVjdENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoUHJvamVjdHMsICRzdGF0ZVBhcmFtcywgcHJvamVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvamVjdHMuZmluZCgkc3RhdGVQYXJhbXMucHJvamVjdElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwuZWRpdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOicvZWRpdCcsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvZWRpdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9qZWN0Q29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2VkaXRQcm9qZWN0Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIC8vY29udHJvbGxlcnMgYXJlIHRoZSB0aGluZ3MgdGhhdCBsaW5rIHRoZSB2aWV3KGh0bWwpIHdpdGggdGhlIGRhdGFcblxuXG5cblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC51aScsIFtdKTtcblxuXG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vd2hlbiB0d28gYXJndW1lbnRzIChwYXJhbWF0ZXJzKSBpdCBkZWZpbmVzIHRoZSBtb2R1bGUsIHdoZW4gb25lIGl0IGlzIHVzaW5nIGl0XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdCb2R5Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRodHRwLCBQcm9qZWN0cyl7XG4gICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZtLndlbGNvbWUgPSAnSGVsbG8gdGhlcmUhJztcblxuXG4gICAgICAgICAgICBQcm9qZWN0cy5nZXQoKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2plY3RzKXtcbiAgICAgICAgICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJvamVjdHMgPSBQcm9qZWN0cy5wcm9qZWN0cztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgJ3VzZSBzdHJpY3QnO1xuLy9EaXJlY3RpdmVzIGFyZSBhbHdheXMgZGFzaCBzeW50YXggKGFuZ3VsYXItZGFzaCkgb24gdGhlIGh0bWwsIGJ1dCBpdCBpcyBjYW1lbCBjYXNpbmcgaW5zaWRlIHRoZSBkaXJlY3RpdmVcbiAgICAvL1NvLCBwcm9qZWN0LXRhYmxlIG9uIGh0bWwgYW5kIHByb2plY3RUYWJsZSBpbiBkaXJlY3RpdmVcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAudWknKVxuICAgICAgICAuZGlyZWN0aXZlKCdwcm9qZWN0VGFibGUnLCBmdW5jdGlvbigpe1xuXG5cblxuICAgICAgICAgICAgLy9DUkVBVEUgVEhFIERETyAoRGlyZWN0aXZlIERlZmluaXRpb24gT2JqZWN0KVxuICAgICAgICAgICAgcmV0dXJue1xuXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2RpcmVjdGl2ZXMvcHJvamVjdC10YWJsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0czogJz0nLFxuICAgICAgICAgICAgICAgICAgICByZW1vdmU6ICc9J1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZmFjdG9yeSgnVXNlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBmdW5jdGlvbiBVc2VyKGRhdGEpe1xuXG4gICAgICAgICAgICAgICAgLy9sb2Rhc2ggZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyAndGhpcycgdG8gcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIF8ubWVyZ2UodGhpcywge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6ICcnXG4gICAgICAgICAgICAgICAgfSwgZGF0YSB8fCB7fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFVzZXIucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiBmdW5jdGlvbiBmdWxsTmFtZSgpe1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcnN0X25hbWUgKyAnICcgKyB0aGlzLmxhc3RfbmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gVXNlcjtcbiAgICAgICAgfSk7XG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC51aScpXG4gICAgICAgIC5maWx0ZXIoJ25pY2VEYXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0aW1lU3RhbXAsIGZvcm1hdCl7XG5cbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJ01NTU0gRG8sIFlZWVknO1xuICAgICAgICAgICAgICAgIHZhciBtID0gbW9tZW50KHRpbWVTdGFtcCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0uZm9ybWF0KGZvcm1hdCk7XG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQWRkUHJvamVjdENvbnRyb2xsZXInLCBmdW5jdGlvbihQcm9qZWN0cyl7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0ucHJvamVjdCA9IHt9O1xuICAgICAgICAgICAgdm0uc2F2ZSA9IFByb2plY3RzLnBvc3Q7XG4gICAgICAgIH0pO1xufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdFByb2plY3RDb250cm9sbGVyJywgZnVuY3Rpb24ocHJvamVjdCwgUHJvamVjdHMsIFVzZXJzKXtcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICB2bS51c2VycyA9IFVzZXJzLnVzZXJzO1xuICAgICAgICAgICAgdm0ucHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgICAgICB2bS5wcm9qZWN0Q29weSA9IF8uY2xvbmUocHJvamVjdCk7XG4gICAgICAgICAgICB2bS51cGRhdGUgPSBQcm9qZWN0cy5wdXQ7XG4gICAgICAgIH0pO1xufSgpKTtcbiIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignTmV3UHJvamVjdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBVc2Vycyl7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0udXNlcnMgPSBVc2Vycy51c2VycztcbiAgICAgICAgICAgIHZtLnByb2plY3QgPSB7dXNlcjogXy5maXJzdCh2bS51c2VycykuX2lkfTtcblxuXG4gICAgICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCl7XG4gICAgICAgICAgICAgICAgLy90aGlzIGZ1bmN0aW9uIGNsb3NlcyBhbmQgc2F2ZXMgdGhlIGlucHV0dGVkIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2Uodm0ucHJvamVjdCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5kaXNtaXNzID0gZnVuY3Rpb24gZGlzbWlzcygpe1xuICAgICAgICAgICAgICAgIC8vdGhpcyBmdW5jdGlvbiB2b2lkcyBhbnkgZnVydGhlciBhY3Rpb24gYW5kIHJldHVybnMgdG8gcHJldmlvdXMgc3RhdGVcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xuXG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9qZWN0Q29udHJvbGxlcicsIGZ1bmN0aW9uKHByb2plY3QsIFByb2plY3RzKXtcblxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLnByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICAgICAgdm0uZGVsID0gUHJvamVjdHMuZGVsO1xuXG4gICAgICAgIH0pO1xuXG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBmdW5jdGlvbih1c2VycywgcHJvamVjdHMsIFByb2plY3RzLCAkbW9kYWwsICRzdGF0ZSwgJHJvb3RTY29wZSl7XG4gICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICB2bS5wcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICB2bS5hZGRQcm9qZWN0ID0gZnVuY3Rpb24gYWRkUHJvamVjdChwcm9qZWN0KSB7XG5cbiAgICAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9uZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdQcm9qZWN0Q3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ25ld1Byb2plY3QnLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiAnbWQnXG4gICAgICAgICAgICAgICAgfSkucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHJlcyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgUHJvamVjdHMucG9zdChyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvamVjdHMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICB2bS5yZW1vdmUgPSBQcm9qZWN0cy5kZWw7XG4gICAgICAgIH0pO1xufSgpKTsiLCIoZnVuY3Rpb24oKXtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignVXNlcnNDb250cm9sbGVyJywgZnVuY3Rpb24oVXNlcnMsIHVzZXJzKXtcblxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgdm0udXNlcnMgPSB1c2VycztcblxuICAgICAgICAgICAgcmV0dXJuIHVzZXJzO1xuXG4gICAgICAgIH0pO1xuXG59KCkpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuc2VydmljZSgnUHJvamVjdHMnLCBmdW5jdGlvbigkaHR0cCwgJHN0YXRlLCBVc2Vycyl7XG5cbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZtLnByb2plY3RzID0gW107XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE91ciBtYWluIHByb2plY3RzIHN0b3JhZ2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7YXJyYXl9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHZtLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHByb2plY3RJZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh2bS5wcm9qZWN0cywge19pZDogcHJvamVjdElkfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXQgPSBmdW5jdGlvbiBnZXQoKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvcHJvamVjdHMnKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3RzLnNwbGljZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhLmZvckVhY2goZnVuY3Rpb24ocHJvamVjdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdC51c2VyID0gVXNlcnMuZmluZChwcm9qZWN0LnVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3RzLnB1c2gocHJvamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5wcm9qZWN0cztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIHZtLnBvc3QgPSBmdW5jdGlvbiBwb3N0KHByb2plY3Qpe1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9wcm9qZWN0cy8nLCBwcm9qZWN0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEudXNlciA9IFVzZXJzLmZpbmQocmVzLmRhdGEudXNlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3RzLnB1c2gocmVzLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzJywge3Byb2plY3RJZDogcHJvamVjdC5faWR9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9O1xuXG5cblxuICAgICAgICAgICAgdm0ucHV0ID0gZnVuY3Rpb24gcHV0KHByb2plY3RDb3B5KXtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHByb2plY3RDb3B5LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogcHJvamVjdENvcHkudXNlci5faWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9wcm9qZWN0cy8nICsgcHJvamVjdENvcHkuX2lkLCBkYXRhKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IHZtLmZpbmQocHJvamVjdENvcHkuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ubWVyZ2UocCwgcHJvamVjdENvcHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdwcm9qZWN0cy5kZXRhaWwnLCB7cHJvamVjdElkOiBwcm9qZWN0Q29weS5faWR9KTtcblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShwcm9qZWN0SWQpe1xuICAgICAgICAgICAgICAgIF8ucmVtb3ZlKHZtLnByb2plY3RzLCB7X2lkOiBwcm9qZWN0SWR9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmRlbCA9IGZ1bmN0aW9uIGRlbChwcm9qZWN0SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvcHJvamVjdHMvJyArIHByb2plY3RJZClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0ucmVtb3ZlKHByb2plY3RJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcblxufSgpKTtcblxuXG4vL3ZtLnBvc3QgPSBmdW5jdGlvbiBwb3N0KHByb2plY3Qpe1xuLy8gICAgcmV0dXJuICRodHRwLnBvc3QoJy9wcm9qZWN0cy8nKVxuLy8gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4vLyAgICAgICAgICAgIHZtLnByb2plY3RzLnB1c2gocmVzLmRhdGEpO1xuLy9cbi8vICAgICAgICB9KTtcbi8vfTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLnNlcnZpY2UoJ1VzZXJzJywgZnVuY3Rpb24oJGh0dHAsIFVzZXIpe1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB2bS51c2VycyA9IFtdO1xuXG4gICAgICAgICAgICB2bS5maW5kID0gZnVuY3Rpb24gZmluZCh1c2VySWQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbmQodm0udXNlcnMsIHtfaWQ6IHVzZXJJZH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3VzZXJzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51c2Vycy5zcGxpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVzZXJzLnB1c2gobmV3IFVzZXIodXNlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnVzZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEdldCBhbGwgdXNlcnMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgIH0pO1xufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
