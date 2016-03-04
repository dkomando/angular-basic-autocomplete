var empSearch = angular.module('cpdv1',[
	'ngResource',
	'ngAnimate',
	'ngAria',
	'ngSanitize'
]);


empSearch
	.constant('ServerAPIConn','http://localhost:8080/_data.json')                             // API Resource ( # npm http-server )
	.constant('AutoMsg','{ "msgDefault":"Please search by employee name!", "noResults":"Sorry no employees found!" }');


empSearch
	.directive('employeeSelect', employeeSelect);
	employeeSelect.$inject = ['$filter','ServerAPIConn','AutoMsg','EmployeeAPIFactory'];
	function employeeSelect($filter,ServerAPIConn,AutoMsg,EmployeeAPIFactory){
		return {
			restrict: 'E',
			templateUrl: 'directive_employee-select.html',

			link: function(scope,elem,attrs){
				scope.nothingFoundMsg = AutoMsg.msgDefault; // Set default search instructions.
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


						scope.nothingFoundMsg = AutoMsg.noResults;
					}else{
						scope.usersResults = ''; // Reset results
						scope.nothingFoundMsg = AutoMsg.msgDefault;
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
					return $resource(ServerAPIConn, params, {
						get: {
							method: 'GET',
							headers: {

							}
						}
					});
				}
			};
		}




empSearch
	.filter('keepTrim',function(){
		return function(value){
			return (value) ? value.replace(/^\s|\s$/g,'') : '';
		};
	});
