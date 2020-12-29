'use strict';

angular.module('mediathequeApp')
.service('ficheServicePopin', ['$rootScope','$uibModal','$filter', '$sce', '_','$q',
  function($rootScope, $uibModal, $filter, $sce, _,$q){

    this._ = _;
    $rootScope.animationsEnabled = true;
    $rootScope.searchTerm = "";
    $rootScope.loading = false;

    $rootScope.$on('LOAD',function(){$rootScope.loading = true;});

    $rootScope.$on('UNLOAD',function(){$rootScope.loading = false;});

    var confirmPop = function (fonction, usedArray, titrePopin, index, size) {
      $rootScope.titrePopin = titrePopin;
      var modalInstance;

      if(!_.isUndefined(index) && index=="tplSave"){

        modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'popinOuiNonTplSave.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            prodArray: function () {          
              return usedArray;
            }
          }
        });

      }else{

        modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'popinOuiNon.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            prodArray: function () {          
              return usedArray;
            }
          }
        });

      }
    
      modalInstance.result.then(function () {   
        console.log('Modal index: ' + index);
        console.log('Modal usedArray: ' + usedArray);

        if(index > -1 || !_.isUndefined(index)){

          if(_.isEmpty(usedArray)){

            if(index!="tplSave"){

              fonction(index);

            }else{

              fonction();
            }

          }else{

            fonction(usedArray,index);
          }

        }else{        

            fonction(usedArray);
              
        }
        
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    var ajouterPop = function (fonction, scope, titrePopin, titreLabel, size) {

      $rootScope.titrePopin = titrePopin;
      $rootScope.titreLabel = titreLabel;
      $rootScope.searchTerm = "";
      

      /*$rootScope.searchTerm = scope.chainePrompt;*/

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'prompt.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          arrayValue: function () {          
            return $rootScope.searchTerm;
          }
        }
      });

      modalInstance.result.then(function () {
        
        scope.chainePrompt = $rootScope.searchTerm;               
        if(_.isFunction(fonction))fonction($rootScope.searchTerm);

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    var searchFichePop = function (fonction, usedArray, scope, usedFilter,  titrePopin, size) {      

      $rootScope.titrePopin = titrePopin;       

      $rootScope.selected = 0;
      
      $rootScope.searchFicheArrayModal = $.map(usedArray, function(el) { return el });

      $rootScope.searchFilterModalTypeText =  usedFilter.split(':')[0];
      $rootScope.searchFilterModalText =  usedFilter.split(':')[1]; 
      $rootScope.searchFilterModalCond =  usedFilter.split(':')[2];
      
      var templateUrl="";

      var str = "{" + $rootScope.searchFilterModalTypeText + ":'"+ $rootScope.searchFilterModalText + "'}";

      $rootScope.searchFilterModal = angular.fromJson(eval("(" + str + ")"));   

      if(_.isNil($rootScope.searchFilterModalCond)){ 

        $rootScope.searchFilterModalCond = false;

      }else{

          $rootScope.searchFilterModalCond = true;

      }  

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'search.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          index: function () {          
            return $rootScope.selected;
          }
        }
      });

      modalInstance.result.then(function () {
        
        console.log('$rootScope.selected: ' + $rootScope.selected);
        scope.ficheEnCours({"data" : _.parseInt($rootScope.selected)-1});

      }, function () {
        //console.log('Modal dismissed at: ' + new Date());
      });  

      modalInstance.rendered.then(function(){
        console.log('duMemePop: pop');
        /*$(window).on('load',function(){*/
          $('#duMemePop').slimscroll({
            height: '580px'
          });
       /* });*/
      })    
    }

    var doLoop = function (fonction, scope, titrePopin, arrayModif) {
      // creation d'une promise
      var deferred = $q.defer();
      var arrayRetour = [];

      for (var i = 0; i < arrayModif.length; i++) {

        arrayRetour[i] = ajouterPop(fonction, scope, titrePopin, arrayModif[i]);

      }
      
      // resolution de la promise
      // il est aussi possible de la rejeter avec .reject()
      deferred.resolve(arrayRetour);

      // on renvoie la promise
      return deferred.promise;
    }

    return {
      confirmPop : confirmPop,
      ajouterPop : ajouterPop,
      searchFichePop : searchFichePop,
      doLoop : doLoop
    }
  }
  ]).controller('ModalInstanceCtrl', ['$rootScope','$uibModalInstance', 'ficheServicePopin','$timeout','_',  
  function ($rootScope, $uibModalInstance, ficheServicePopin,$timeout,_) {

    $rootScope.selected = 0; 

    $rootScope.ok = function (selectedItem) {     

      $rootScope.selected = selectedItem;
      $uibModalInstance.close();
         
    };

    $rootScope.okSave = function (selectedItem) {      

      $rootScope.loading = true;
      $timeout(function () {
          $rootScope.selected = selectedItem;
          $uibModalInstance.close(); 
      }, 100);
         
    };

    $rootScope.okPrompt = function(searchTerm) {
  
      console.log('searchTerm: ' + searchTerm);  
      $rootScope.searchTerm = searchTerm;
      $uibModalInstance.close();
  };

    $rootScope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $rootScope.changeChevronM = function(id){

      $("#TypeM").removeClass("check");
      $("#ArtisteM").removeClass("check");
      $("#TitreM").removeClass("check");
      $("#AnneeM").removeClass("check");
      $("#GenreM").removeClass("check");
      $("#EmplacementM").removeClass("check");

      switch (id) {
        case "TypeM":
        $("#TypeM").addClass("check");
        $rootScope.searchFilterModal =  {Type : $rootScope.searchFilterModalText};
        break;

        case "ArtisteM":
        $("#ArtisteM").addClass("check");
        $rootScope.searchFilterModal = {Artiste : $rootScope.searchFilterModalText};
        break;

        case "TitreM":
        $("#TitreM").addClass("check");
        $rootScope.searchFilterModal = {Titre : $rootScope.searchFilterModalText};
        break;

        case "AnneeM":
        $("#AnneeM").addClass("check");
        $rootScope.searchFilterModal = {Annee : $rootScope.searchFilterModalText};
        break;

        case "GenreM":
        $("#GenreM").addClass("check");
        $rootScope.searchFilterModal = {Genre : $rootScope.searchFilterModalText};
        break;

        case "EmplacementM":
        $("#EmplacementM").addClass("check");
        $rootScope.searchFilterModal = {Emplacement : $rootScope.searchFilterModalText};
        break;

        default:
        break;
      }       
    }
    $rootScope.selectFicheSortie = function(index){
      console.log('clic sur fiche n°:' + index);
      $rootScope.selected = index;          
    }

  }]).filter('startsWithLetter', function () {
  return function (items, letter) {
    var filtered = [];
    var letterMatch = new RegExp(letter, 'i');

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (letterMatch.test(item.name.substring(0, 1))) {
        filtered.push(item);
      }
    }
    return filtered;
  };
});