"use strict";

/**
 * @ngdoc function
 * @name mediathequeApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the mediathequeApp
 */

angular.module('mediathequeApp')

.controller('mainCtrl', ['$window', '$rootScope', '$scope', '$http', '$resource', 'ficheService', 'ficheServicePopin', '_', 'ficheServiceRules', 
  function($window, $rootScope, $scope, $http, $resource, ficheService, ficheServicePopin, _, ficheServiceRules) {
    /*$scope.spinnerService = spinnerService;*/
     
    this._ = _;    
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $( document ).ready(function() {
        $('#blocMusicien').slimscroll({
          height: '265px'
        });
        $('#blocTitres').slimscroll({
          height: '380px'
        });
        $('#blocDuMeme').slimscroll({
          height: '284px'
        }); 
        $("#search.html").on('show.bs.modal', function(){
          $('#duMemePop').slimscroll({
            height: 'auto'
          });
        });     
    });

    $scope.datas = [];

    $scope.datas = ficheService.getListFiches.query(function() {

      $scope.nbFiche = 0;
      $scope.nbFiches = 1; //$scope.nbMaxFiches;
      initArrays();

      $scope.nbMaxFiches = 0;
      $scope.nbMaxFiches = _.size($scope.datas) || 0;

      console.log("Fiches N° " + $scope.nbFiches + " sur " + $scope.nbMaxFiches + " Fiches");      

      var data = $window.localStorage.getItem('my-storage');      

      if(_.isNil(data)){
        ficheEnCours();
      }else{
        ficheEnCours({ "data": _.parseInt(data) - 1 });
      }
      
      bindToScope();
    }, function errorCallback(response) {
      alert("Serveur pas démarré");
    });

    $(document).keypress(function (e){ 
        if(e.keyCode == 40){
            
            $('#btntop').click();

        }else if(e.keyCode == 37){ 
            
            $('#btnleft').click();

        }else if(e.keyCode == 39){ 
            
            $('#btnright').click();

        }else if(e.keyCode == 38){ 

            $('#btnbottom').click();

        }else if(e.keyCode == 13){ 

            $('#btnOuiNon').click();
        }
    });

    /**
     * Sauvegarde
     */
    function saveFiches() {
      $scope.confirmPop(
        $scope.saveFichesRetourPop,
        [],
        "Vous désirez vraiment sauvegarder les fiches ?",
        "tplSave"
      );  

    }
    function saveFichesRetourPop() {     

      var res = ficheService.getSavedFiches.update(JSON.stringify($scope.datas), function() {
        $rootScope.loading = false;
        console.log("sauvegarde Fiches");

      }, function errorCallback(response) {
        alert("Fiches pas sauvegardées");
      });
      
      ficheEnCours({ "data": _.parseInt($scope.nbFiches) - 1 });
    }

    function supprimerFiches(index) {
      var text = "Vous désirez vraiment supprimer cette fiche N°" + $scope.nbFiches + "?";
      $scope.confirmPop(
        $scope.supprimerFichesRetourPop,
        [],
        text,
        index
      );
    }
    function supprimerFichesRetourPop(index) {  

      $scope.datas.splice(($scope.nbFiches - 1), 1);
      $scope.nbFiches = $scope.nbFiches - 1;
      $scope.nbMaxFiches = $scope.nbMaxFiches - 1;

      ficheEnCours({ "data": _.parseInt($scope.nbFiches) - 1 });
    }

    function ConsoleAffichageRulesCircuFiche() {
      console.log("Fiches N° " + $scope.nbFiches + " sur " + $scope.nbMaxFiches + " Fiches");
    }

    function initArrays() {
      $scope.prodArray = [];
      $scope.musArray = [];
      $scope.titreArray = [];
      $scope.searchFicheArray = [];
    }

    function ficheEnCours(numfiche) {
      //console.log("passage fonction ficheEnCours ");
      ficheServiceRules.ficheEnCours(numfiche,$scope);
      
      valoriseArrays();

      $scope.ongletDuMeme = $window.localStorage.getItem('my-storage-ongletDuMeme');
      
      if(_.isNull($scope.ongletDuMeme)){
        $scope.ongletDuMeme = "Artiste";     
        console.log("$scope.ongletDuMeme isNull: " + $scope.ongletDuMeme);   
      }
      
      changeChevron($scope.ongletDuMeme);
      $window.localStorage.setItem('my-storage-ongletDuMeme', $scope.ongletDuMeme);
      
      $window.localStorage.setItem('my-storage', $scope.nbFiches);
      
    }

    function copyToClipboard() {
      window.prompt("Pour le nom de l'image de la jaquette: Ctrl+C", $scope.lienNomImageJaquette.toString());
    }

    function valoriseArrays() {
      $scope.prodArray = $scope.dataFicheEnCours.listeDesProductions || [];
      $scope.musArray = $scope.dataFicheEnCours.listeDesMusiciens || [];
      $scope.titreArray = $scope.dataFicheEnCours.listeDesTitres || [];
      $scope.searchFicheArray = $scope.datas || [];
    }

    function changeChevron(id) {
      ficheServiceRules.changeChevron(id,$scope);
    }

    function lTruncate(chaine, nunTrun, id, index) {
      return ficheServiceRules.lTruncate(chaine, nunTrun, id, index);             
    }

    /**
     * ***************************************************************************************************
     * SUPPRESION LIGNE TABLEAU MUSICIENS / PRODUCTIONS / TITRES
     * ***************************************************************************************************
     */
    function supprimeDeLaListe(array, index) {
      console.log("index : " + index);
      $scope.confirmPop(
        $scope.supprimeDeLaListePopRetour,
        array,
        "Vous désirez vraiment supprimer?",
        index
      );
    }
    //Fonctions de retour de popin supression
    function supprimeDeLaListePopRetour(array, index){
      array.splice(index, 1);
    }

    /**
     * ***************************************************************************************************
     * CREATION FICHE
     * ***************************************************************************************************
     */
    function ajouterFiche() {
      if (confirm("Vous désirez vraiment ajouter une fiche ?")) {
        var boucle = true;

        var nVarType = prompt("Quel Type?", "");
        var nVarTitre = prompt("Quel Titre?", "");
        var nVarArtiste = prompt("Quel Artiste?", "");
        var nVarAnnee = prompt("Quel Annnée?", "");
        var nVarEmplacement = prompt("Quel Emplacement?", "");
        var nVarGenre = prompt("Quel Genre?", "");

        var testSiFicheExiste = $scope.datas.find(function(o){           
          return o.Type == _.upperCase(nVarType) &&
          o.Titre == _.upperCase(nVarTitre) &&
          o.Artiste == _.upperCase(nVarArtiste) &&
          o.Annee == _.upperCase(nVarAnnee);
        }); 

        if(testSiFicheExiste == -1 || _.isUndefined(testSiFicheExiste)){

          var nVarPrenom = "";
          var nVarNom = "";
          var musicien = "";
          var nVarInstrument = "";
          var listeDesMusiciens = [];

          boucle = true;
          do {
            if (confirm("Vous désirez ajouter un ou plusieur musicien?")) {
              nVarPrenom = prompt("Quel prénom?", "");
              nVarNom = prompt("Quel nom?", "");
              nVarInstrument = prompt("Quel instrument?", "");

              musicien = nVarPrenom + " " + nVarNom;

              listeDesMusiciens.push({
                "prenom": musicien,
                "instrument": nVarInstrument
              });

            } else {
              boucle = false;
            }
          } while (boucle === true);

          var num = 1;
          nVarTitre = "";
          var nVarAuteur = "";
          var nVarCompositeur = "";
          var nVarInterprete = "";
          var listeDesTitres = [];
          boucle = true;
          do {
            if (confirm("Vous désirez ajouter un ou plusieur titre ?")) {
              num = num + 1;
              nVarTitre = prompt("Quel titre?", "");
              nVarAuteur = prompt("Quel auteur?", "");
              nVarCompositeur = prompt("Quel compositeur?", "");
              nVarInterprete = prompt("Quel interprète?", "");

              listeDesTitres.push({
                "n": num,
                "label": nVarTitre,
                "auteur": nVarAuteur,
                "conpositeur": nVarCompositeur,
                "interprete": nVarInterprete
              });

            } else {
              boucle = false;
            }
          } while (boucle === true);

          nVarPrenom = "";
          nVarNom = "";
          var listeDesProductions = [];
          boucle = true;
          do {
            if (confirm("Vous désirez ajouter une ou plusieur production?")) {
              nVarPrenom = prompt("Quel prénom?", "");
              nVarNom = prompt("Quel nom?", "");

              listeDesProductions.push({
                "prenom": nVarPrenom,
                "nom": nVarNom
              });

            } else {
              boucle = false;
            }
          } while (boucle === true);

          $scope.datas.push({
            "Type": nVarType,
            "Titre": nVarTitre,
            "Artiste": nVarArtiste,
            "Annee": nVarAnnee,
            "Emplacement": nVarEmplacement,
            "Genre": nVarGenre,
            "listeDesMusiciens": listeDesMusiciens,
            "listeDesTitres": listeDesTitres,
            "listeDesProductions": listeDesProductions
          });

          $scope.nbFiches = _.size($scope.datas);
          $scope.dataFicheEnCours = $scope.datas[$scope.nbFiches - 1];
          $scope.nbMaxFiches = $scope.nbMaxFiches + 1;

        }else{
          alert("Fiche existante");
        }

      }
    }

    /**
     * ***************************************************************************************************
     * AJOUT FICHE / MUSICIEN / PRODUCTION / TITRES
     * ***************************************************************************************************
     */
    function ajouterMusicienPop() {
      $scope.confirmPop(
        $scope.ajouterMusicien,
        $scope.musArray,
        "Ajouter un musicien ?"
      );
    }    
    function ajouterMusicien(array) {
      $scope.musArray = ficheServiceRules.ajouterMusicien(array);
    }

    function ajouterTitrePop(){
      $scope.confirmPop(
        $scope.ajouterTitre,
        $scope.titreArray,
        "Ajouter un titre ?"
      );
    }
    function ajouterTitre(array) {
      $scope.titreArray = ficheServiceRules.ajouterTitre(array);
    }

    function ajouterProductionPop() {
      $scope.confirmPop(
        $scope.ajouterProduction,
        $scope.prodArray,
        "Ajouter une production ?"
      );
    }
    function ajouterProduction(array) {
      $scope.prodArray = ficheServiceRules.ajouterProduction(array);
    }
    /**
     * ***************************************************************************************************
     * MODIFICATION FICHE / MUSICIEN / PRODUCTION / TITRES
     * ***************************************************************************************************
     */
    function modifierFiche(array, index) {
      $scope.confirmPop(
        $scope.modifierFichePopRetour,
        array,
        "Vous désirez vraiment modifier la fiche ?",
        index
      );
    }
    function modifierFichePopRetour(array, index) {      
      var nVarType = prompt("Quel Type?", array.Type);
      var nVarTitre = prompt("Quel Titre?", array.Titre);
      var nVarArtiste = prompt("Quel Artiste?", array.Artiste);
      var nVarAnnee = prompt("Quel annnée?", array.Annee);
      var nVarEmplacement = prompt("Quel Emplacement?", array.Emplacement);
      var nVarGenre = prompt("Quel Genre?", array.Genre);

      if (!_.isNull(nVarType)) { array.Type = nVarType; }
      if (!_.isNull(nVarType)) { array.Titre = nVarTitre; }
      if (!_.isNull(nVarArtiste)) { array.Artiste = nVarTitre; }
      if (!_.isNull(nVarAnnee)) { array.Annee = nVarAnnee; }
      if (!_.isNull(nVarEmplacement)) { array.Emplacement = nVarEmplacement; }
      if (!_.isNull(nVarGenre)) { array.Genre = nVarGenre; }
    }

    function modifierMusicien(array, index) {
      $scope.confirmPop(
        $scope.modifierMusicienPopRetour,
        array,
        "Vous désirez vraiment modifier le musicien?",
        index
      );
    }
    function modifierMusicienPopRetour(array, index) {

      var arrayNomPrenom =  array[index].prenom.split(' ');

      var nVarPrenom = prompt("Quel prénom?", arrayNomPrenom[0]);
      var nVarNom = prompt("Quel nom?", arrayNomPrenom[1]);
      var nVarInstrument = prompt("Quel instrument?", array[index].instrument);

      var musicien = nVarPrenom + " " + nVarNom;

      if (!_.isNull(nVarPrenom) && !_.isNull(nVarNom)) array[index].prenom = musicien;
      if (!_.isNull(nVarInstrument)) array[index].instrument = nVarInstrument;
    }

    function modifierProduction(array, index) {
      $scope.confirmPop(
        $scope.modifierProductionPopRetour,
        array,
        "Vous désirez vraiment modifier la production?",
        index
      );
    }
    function modifierProductionPopRetour(array, index) { 

      var nVarPrenom = prompt("Quel prénom?", array[index].prenom);
      var nVarNom = prompt("Quel nom?", array[index].nom);
      
      if (!_.isNull(nVarPrenom)) array[index].prenom = nVarPrenom;
      if (!_.isNull(nVarNom)) array[index].nom = nVarNom;
    }

    function modifierTitre(array, index) {
      $scope.confirmPop(
        $scope.modifierTitrePopRetour,
        array,
        "Vous désirez vraiment modifier le titre?",
        index
      );
    }
    function modifierTitrePopRetour(array, index) {
      var nVarTitre = prompt("Quel titre?", array[index].label);
      var nVarAuteur = prompt("Quel auteur?", array[index].auteur);
      var nVarCompositeur = prompt("Quel compositeur?", array[index].conpositeur);
      var nVarInterprete = prompt("Quel interprète?", array[index].interprete);

      if (!_.isNull(index)) array[index].n = index;
      if (!_.isNull(nVarTitre)) array[index].label = nVarTitre;
      if (!_.isNull(nVarAuteur)) array[index].auteur = nVarAuteur;
      if (!_.isNull(nVarCompositeur)) array[index].conpositeur = nVarCompositeur;
      if (!_.isNull(nVarInterprete)) array[index].interprete = nVarInterprete;
    }

    /**
     * CHERCHER FICHE
     */
    function chercherFiche() {
        var titrePopin = "Recherche";
        var titreLabel = "Que cherches-tu?<br>" +
        "Pour le N° d'une fiche, tape 'Fiche:N°'<br>" +
        "Pour un type de support, tape 'Type:chaine'<br>" +
        "Pour un artiste tape, 'Artiste:chaine'<br>" +
        "Pour un titre d'album, tape 'Titre:chaine'<br>" +
        "Pour une année d'album, tape 'Annee:chaine'<br>" +
        "Pour un genre de musique, tape 'Genre:chaine'<br>" +
        "Pour un emplacement, tape 'Emplacement:chaine'<br>"+
        "Pour une recherche strict met ':true' a la fin";
        $scope.chainePrompt ="",
        $scope.ajouterPop($scope.searchFichePopRetour, $scope, titrePopin, titreLabel);
        $( document ).load(function() {
            $('#duMemePop').slimscroll({
              height: 'auto'
            });        
        });
    }
    function searchFichePopRetour(chaine){
      
      if (!_.isNull(chaine) && !_.isNil(chaine) && chaine!="") {

        if (chaine.indexOf("Fiche") > -1 || chaine.indexOf("fiche") > -1) {
          var numFiche = chaine.substring(6, chaine.length);
          console.log('numFiche: ' + numFiche);

          if (_.parseInt(numFiche) <= _.size($scope.datas)) {

            $scope.ficheEnCours({ "data": _.parseInt(numFiche) - 1 });

          } else {

            alert("le numéro ou la recherche est érroné");
          }

        } else {
          $scope.searchFilter = chaine;
          $scope.searchFichePop();  
        }
      }
    }
 
    function affichageRulesCircuFiche(test) {

      switch (test) {
        case 'check':
          return $scope.nbFiches === $scope.nbMaxFiches;
          break;

        case 'next':
          return ($scope.nbFiches + 1) <= $scope.nbMaxFiches;
          break;

        case 'back':
          return (($scope.nbFiches - 1) <= $scope.nbMaxFiches) && ($scope.nbFiches - 1 !== 0);
          break;

        case 'fastnext':
          return ($scope.nbFiches + 10) <= $scope.nbMaxFiches;
          break;

        case 'fastback':
          return (($scope.nbFiches - 10) <= $scope.nbFiches) && ($scope.nbFiches - 10 > 0);
          break;

        default:
          return false;
      }

    }

    function circuFiche(direction) {
      switch (direction) {
        case 'next':
          $scope.nbFiches = $scope.nbFiches + 1;
          $scope.dataFicheEnCours = $scope.datas[$scope.nbFiches - 1];
          $scope.ConsoleAffichageRulesCircuFiche();
          break;

        case 'fastnext':
          $scope.nbFiches = $scope.nbFiches + 10;
          $scope.dataFicheEnCours = $scope.datas[$scope.nbFiches - 1];
          $scope.ConsoleAffichageRulesCircuFiche();
          break;

        case 'back':
          $scope.nbFiches = $scope.nbFiches - 1;
          $scope.dataFicheEnCours = $scope.datas[$scope.nbFiches - 1];
          $scope.ConsoleAffichageRulesCircuFiche();
          break;

        case 'fastback':
          $scope.nbFiches = $scope.nbFiches - 10;
          $scope.dataFicheEnCours = $scope.datas[$scope.nbFiches - 1];
          $scope.ConsoleAffichageRulesCircuFiche();
          break;
        default:
          return true;
      }
      ficheEnCours();
      //$scope.search = { Artiste: $scope.dataFicheEnCours.Artiste };
      $scope.ConsoleAffichageRulesCircuFiche();

    }

    /**
     * ***************************************************************************************************
     * BIND TO SCOPE
     * ***************************************************************************************************
     */
    function bindToScope() {

      $scope.affichageRulesCircuFiche = affichageRulesCircuFiche;
      $scope.circuFiche = circuFiche;

      $scope.ficheEnCours = ficheEnCours;

      $scope.ConsoleAffichageRulesCircuFiche = ConsoleAffichageRulesCircuFiche;

      $scope.changeChevron = changeChevron;
      $scope.lTruncate = lTruncate;
      $scope.supprimeDeLaListe = supprimeDeLaListe;
      $scope.supprimeDeLaListePopRetour = supprimeDeLaListePopRetour;

      $scope.ajouterMusicien = ajouterMusicien;
      $scope.ajouterProduction = ajouterProduction;

      $scope.ajouterProductionPop = ajouterProductionPop;
      $scope.ajouterMusicienPop = ajouterMusicienPop;
      $scope.ajouterTitrePop = ajouterTitrePop;

      $scope.ajouterTitre = ajouterTitre;
      $scope.ajouterFiche = ajouterFiche;

      $scope.modifierMusicien = modifierMusicien;
      $scope.modifierProduction = modifierProduction;
      $scope.modifierTitre = modifierTitre;
      $scope.modifierFiche = modifierFiche;
      $scope.chercherFiche = chercherFiche;
      
      //fonctions de retour de poppin
      $scope.modifierFichePopRetour = modifierFichePopRetour;
      $scope.modifierMusicienPopRetour = modifierMusicienPopRetour;
      $scope.modifierProductionPopRetour = modifierProductionPopRetour;
      $scope.modifierTitrePopRetour = modifierTitrePopRetour;
      $scope.searchFichePopRetour = searchFichePopRetour;


      //$scope.afficheSpinner = afficheSpinner;
      $scope.saveFiches = saveFiches;
      $scope.saveFichesRetourPop = saveFichesRetourPop;

      $scope.supprimerFiches = supprimerFiches;
      $scope.supprimerFichesRetourPop =supprimerFichesRetourPop;

      $scope.copyToClipboard = copyToClipboard;

      $scope.ajouterPop = function(fonction, scope, titrePopin, titreLabel, size) {
        ficheServicePopin.ajouterPop(
          fonction,
          scope,         
          titrePopin,
          titreLabel,
          size
        );
      };

      $scope.confirmPop = function(fonction, usedArray, titrePopin, index, size) {
        ficheServicePopin.confirmPop(
          fonction,
          usedArray,
          titrePopin,
          index,
          size
        );
      };
  
      $scope.searchFichePop = function(size) {
        ficheServicePopin.searchFichePop(
          $scope.searchFicheTitre,
          $scope.searchFicheArray,
          $scope,
          $scope.searchFilter,
          "Recherche",
          "lg"
        );
      };
    }
  }
]).directive('focus',
    function($timeout) {
       return {
       scope : {
         trigger : '@focus'
       },
       link : function(scope, element) {
          scope.$watch('trigger', function(value) {
            if (value === "true") {
                $timeout(function() {
                  element[0].focus();
                });
             }
         });
       }
    };
});

/*.config(['spinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('bigBlue', {color: 'blue', radius: 20});
}])*/

/*.controller('MyController', ['$scope', 'usSpinnerService', function($scope, usSpinnerService){
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }
    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }
}]);*/
