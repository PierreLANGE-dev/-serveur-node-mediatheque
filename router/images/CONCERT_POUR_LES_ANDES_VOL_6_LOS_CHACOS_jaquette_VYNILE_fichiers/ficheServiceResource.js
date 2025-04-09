'use strict';

angular.module('mediathequeApp')
 .factory('ficheService', ['$resource',
  function($resource){

      var getListFiches = $resource('http://localhost:8081/listFiches',null,{
    //var getListFiches = $resource('http://localhost:8081/listFiches',null,{
      'update': {method:'PUT',headers: {
        'Content-Type':'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*' }},
        'query':  {method:'GET',headers: {
          'Content-Type':'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*' }, isArray:true}
        });

    //var getSavedFiches = $resource('http://127.0.0.1:8081/saveFiches/:fiches',{fiches:'@fiches'},{
    var getSavedFiches = $resource('http://localhost:8081/update',{fiches:'@fiches'},{
      'update': {method:'put',headers: {
        'Content-Type':'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*' }},
        'query':  {method:'GET'}
        });

    return{
      getListFiches :getListFiches,
      getSavedFiches :getSavedFiches
    }
  }
])
 /*.controller('FicheServiceCtrl', ['$scope', '$routeParams', 'ficheService',
                                   function($scope, $routeParams, Notes) {
// First get a note object from the factory
var fiches = ficheService.get({ id:$routeParams.id });
$id = fiches;

// Now call update passing in the ID first then the object you are updating
ficheService.update({ fiches:$id }, fiches);

// This will PUT /notes/ID with the note object in the request payload
}])*/;
