var empSearch = angular.module('cpdv1',[
	'ngResource',
	'ngAnimate',
	'ngAria',
	'ngSanitize'
]);

empSearch
	.constant('ServerAPIConn','http://localhost:8080/_data.json');                             // API Resource





empSearch
	.directive('employeeSelect', employeeSelect);
	employeeSelect.$inject = ['$filter','ServerAPIConn','EmployeeAPIFactory'];
	function employeeSelect($filter,ServerAPIConn,EmployeeAPIFactory){
		return {
			restrict: 'E',
			templateUrl: 'directive_employee-select.html',

			link: function(scope,elem,attrs){
				scope.nothingFoundMsg = 'Please search by employee name!'; // Set default search instructions.
				//console.log('Scope:',scope,'  Elements:',elem,'  Attributes:',attrs); // DEBUG


				scope.clearInput = function(){ scope.user_selected_emp = ''; scope.usersResults = ''; };                // Clear Input
				scope.setSelected = function(fname,lname){ scope.user_selected_emp = fname+' '+lname; };   // Set Input
				scope.displayName = function(fname,lname){ return fname+' '+lname; };
				scope.checkAPI = function(emp){
					if($filter('keepTrim')(emp).length > 2){ // Make sure search length is greater than 2 characters!
						console.log('Current Search:',$filter('keepTrim')(emp)); // DEBUG
						// We are not currently sending the user typed input to the API!!!!

						// API Call
						var UserAPIList = new EmployeeAPIFactory.EmployeeAPI(ServerAPIConn).get();
						UserAPIList.$promise.then(function(dataReturned){
							//console.log(dataReturned); // DEBUG
							scope.usersResults = dataReturned.results;
						}, function(result){ console.log('Error: No users returned.'); }); // Show if any errors encountered.


						scope.nothingFoundMsg = 'Sorry no employees found!';
					}else{
						scope.usersResults = ''; // Reset results
						scope.nothingFoundMsg = 'Please search by employee name!';
					}
				};
			}
		};
	}





empSearch
		.factory('EmployeeAPIFactory', EmployeeAPIFactory);
		EmployeeAPIFactory.$inject = ['$resource', 'ServerAPIConn'];
		function EmployeeAPIFactory($resource, ServerAPIConn) {
			return {
				EmployeeAPI: function(ServerAPIConn, params) {
					params = params || {};
					var token = params.token;
					params.format = 'json';
					// For Testing Infinite Scroll Only, Otherwise Comment Out!
					params.per_page = '10';
					var use_params = angular.copy(params);
					//console.log(token); // DEBUG
					// Make sure token doesn't appear in the URL
					delete use_params.token;
					return $resource(ServerAPIConn, use_params, {
						get: {
							method: 'GET',
							headers: {
								'Authorization': 'Token ' + token
							}
						}
					});
				}
			};
		}




empSearch
	.filter('keepTrim',function(){
		return function(value){
			return (!value) ? '' : value.replace(/^\s|\s$/g,'');
		};
	});
