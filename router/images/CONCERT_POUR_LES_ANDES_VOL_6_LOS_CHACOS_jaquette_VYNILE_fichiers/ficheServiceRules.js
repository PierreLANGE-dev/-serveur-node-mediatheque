'use strict';

angular.module('mediathequeApp')
 .service('ficheServiceRules', ['$rootScope','$window',
  function($rootScope,$window){

    var ajouterProduction = function (array){
        var nVarPrenom = prompt("Quel prénom?", "");
        var nVarNom = prompt("Quel nom?", "");

        array.push({
          "prenom": nVarPrenom,
          "nom": nVarNom
        });
        return array;
    };
    var ajouterMusicien = function (array){
        var nVarPrenom = prompt("Quel prénom?", "");
        var nVarNom = prompt("Quel nom?", "");
        var nVarInstrument = prompt("Quel instrument?", "");

        var musicien = nVarPrenom + " " + nVarNom;
        array.push({
          "prenom": musicien,
          "instrument": nVarInstrument
        });
        return array;
    };
    var ajouterTitre = function (array){
        var num = array.length + 1;
        var nVarTitre = prompt("Quel titre?", "");
        var nVarAuteur = prompt("Quel auteur?", "");
        var nVarCompositeur = prompt("Quel compositeur?", "");
        var nVarInterprete = prompt("Quel interprète?", "");

        array.push({
          "n": num,
          "label": nVarTitre,
          "auteur": nVarAuteur,
          "conpositeur": nVarCompositeur,
          "interprete": nVarInterprete
        });
        return array;
    };

    var searchFiche = function (array){
        //var num = array.length + 1;
        
        //array = $scope.datas;

    };

    var changeChevron = function(id,$scope) {
      
      $("#Type").removeClass("check");
      $("#Artiste").removeClass("check");
      $("#Titre").removeClass("check");
      $("#Annee").removeClass("check");
      $("#Genre").removeClass("check");
      $("#Emplacement").removeClass("check");

      $scope.ongletDuMeme = id; 
      $window.localStorage.setItem('my-storage-ongletDuMeme', $scope.ongletDuMeme);     

      switch (id) {
        case "Type":
          $("#Type").addClass("check");
          $scope.search = { Type: $scope.dataFicheEnCours.Type };
          break;

        case "Artiste":
          $("#Artiste").addClass("check");
          $scope.search = { Artiste: $scope.dataFicheEnCours.Artiste };
          break;

        case "Titre":
          $("#Titre").addClass("check");
          $scope.search = { Titre: $scope.dataFicheEnCours.Titre };
          break;

        case "Annee":
          $("#Annee").addClass("check");
          $scope.search = { Annee: $scope.dataFicheEnCours.Annee };
          break;

        case "Genre":
          $("#Genre").addClass("check");
          $scope.search = { Genre: $scope.dataFicheEnCours.Genre };
          break;

        case "Emplacement":
          $("#Emplacement").addClass("check");
          $scope.search = { Emplacement: $scope.dataFicheEnCours.Emplacement };
          break;
      }
    };

    var lTruncate = function(chaine, nunTrun, id, index) {
      if (chaine.length > nunTrun) {

        var idmyIdText = "my" + id + "Text" + index;

        $("#" + idmyIdText).bind("mouseenter", function() {
          $(this).find("ul").removeClass("noVisible");
          $(this).find("ul").addClass("sousmenu");
        });

        $("#" + idmyIdText).bind("mouseleave", function() {
          $(this).find("ul").removeClass("sousmenu");
          $(this).find("ul").addClass("noVisible");
        });

        return _.truncate(chaine, {
          'length': nunTrun
        });
      } else {
        return chaine;
      }
    };
    var ficheEnCours =function (numfiche,$scope) {
      //console.log("passage fonction ficheEnCours ");

      if (_.isNil(numfiche)) {
        numfiche = { data: $scope.nbFiches - 1 };
      } else {
        $scope.nbFiches = numfiche.data + 1;
      }

      $scope.dataFicheEnCours = $scope.datas[numfiche.data];

      var lienrechercheJaquette = "";
      var lienImage = "";

      var titre_artiste = _.trim($scope.dataFicheEnCours.Titre) + " " + _.trim($scope.dataFicheEnCours.Artiste) + " jaquette " + _.trim($scope.dataFicheEnCours.Type);
      var titre_jaquette = "\""+_.trim($scope.dataFicheEnCours.Titre) + "\" \"" + _.trim($scope.dataFicheEnCours.Artiste) + "\" jaquette " + _.trim($scope.dataFicheEnCours.Type);

      console.clear();

      lienrechercheJaquette = _.replace(titre_jaquette, /([\s])/g, "+");
      
      lienImage = _.replace(titre_artiste, /([\s])/g, "_");
	  lienImage = _.replace(lienImage, "/", "_");	  
      lienImage = _.replace(lienImage, "`", "_");

      $scope.lienNomImageJaquette = lienImage + ".jpg";
      console.info("lienNomImageJaquette :" + $scope.lienNomImageJaquette);

      lienrechercheJaquette = _.replace(lienrechercheJaquette, "&", "%26");      

      /**
       * https://www.google.fr/search?q=SKAGGS+%26+RICE&biw=1920&bih=911&espv=2&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjJoJvJzKzNAhWJiRoKHZ2lAPgQ_AUIBygC
       */
      $scope.lienWebJaquette = "https://www.google.fr/search?q=" + lienrechercheJaquette + "&biw=1920&bih=911&espv=2&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjJoJvJzKzNAhWJiRoKHZ2lAPgQ_AUIBygC";

      $scope.image = "images/" + lienImage + ".jpg";
 
    }
    /*var prompt = function(scope,title,label){
          
    }*/

    return {
      ajouterProduction : ajouterProduction,
      ajouterMusicien : ajouterMusicien,
      ajouterTitre : ajouterTitre,
      searchFiche : searchFiche,
      changeChevron : changeChevron,
      lTruncate : lTruncate,
      ficheEnCours : ficheEnCours/*,
      prompt :prompt*/
    }
  }
]);
