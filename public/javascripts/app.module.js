(function(){

    'use strict';

    //two ways to use angular module 1. creating a module 2. adding or using the module

    angular.module('app', ['ui.router', 'app.ui', 'ui.bootstrap'])
        .config(function($stateProvider, $urlRouterProvider){
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
                .state('login', {
                    url: '/login',
                    templateUrl: 'partials/login/index.html',
                    controller: 'LoginController',
                    controllerAs: 'loginController'
                })
                .state('projects', {
                   url: '/projects',
                    templateUrl: 'partials/projects/index.html',
                    controller: 'ProjectsController',
                    controllerAs: 'projectsController',
                    resolve:{
                        users: function (Users){
                            debugger;

                            return Users.get();
                        },
                        projects: function (Projects, users){

                            return Projects.get();
                        }
                    }
                })
                .state('users',{
                    url: '/users',
                    templateUrl: 'partials/projects/users.html',
                    controller: 'UsersController',
                    controllerAs: 'usersController',
                    resolve: {
                        users: function (Users){

                            return Users.get();

                        }
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
                        project: function (Projects, $stateParams, projects) {
                            return Projects.find($stateParams.projectId);
                        }
                    }
                })
                .state('projects.detail.edit', {
                    url:'/edit',
                    templateUrl: 'partials/projects/edit.html',
                    controller: 'EditProjectController',
                    controllerAs: 'editProjectController'
                });

        });

    //controllers are the things that link the view(html) with the data




}());