document.addEventListener("DOMContentLoaded", function (event) {

    //Jeu
    class Jeu { //caractéristiques jeu
        constructor(_idSvg, _idPointage) { //constructeur objet
            console.log("création jeu");
            this.s = Snap(_idSvg); //récupérer et garder svg avec snapsvg
            this.sortiePointage = document.querySelector(_idPointage); //sélectionner affichage pointage html
            this.tailleCarre = 20; //déterminer taille carré serpent
            this.tailleGrille = 15; //déterminer taille grille
        }

        nouvellePartie() { //commencer partie
            this.finPartie(); //appeller fin partie
            this.affichagePoints(1); //pointage au début
            this.pomme = new Pomme(this); //créer pomme
            this.serpent = new Serpent(); //créer serpent
        }

        finPartie() { //terminer partie
            if(this.pomme) //TODO 1h
            this.pomme.supprimePomme();
        }

        affichagePoints(_pointage) { //afficher points
            this.sortiePointage.innerHTML = _pointage; //afficher pointage sur la page web
        }


    }

    //Serpent
    class Serpent { //caractéristiques serpent
        constructor() { //constructeur serpent
            console.log("création serpent");
        }
    }

    //Pomme
    class Pomme { //caractéristiques pomme
        constructor(_jeu) { //constructeur pomme
            console.log("création pomme");
            this.jeu = _jeu; //garder paramètre en mémoire
            this.pomme = []; //garder pomme en mémoire
            this.ajoutePomme(); //appel fonction ajout
        }

        ajoutePomme() { //ajouter pomme
            var posX = Math.floor(Math.random() * this.jeu.tailleGrille); //créer position x aléatoire
            var posY = Math.floor(Math.random() * this.jeu.tailleGrille); //créer position y aléatoire
            this.pomme = [this.jeu.s.rect(posX * this.jeu.tailleCarre, posY * this.jeu.tailleCarre, this.jeu.tailleCarre, this.jeu.tailleCarre).attr({fill: "red"}), posX, posY]; //création pomme avec snapsvg; attribut couleur; mise en tableau avec positions
        }

        supprimePomme() { //supprimer pomme
            this.pomme[0].remove(); //supprimer pomme
        }
    }


    var partie = new Jeu("#jeu", "#pointage"); //créer jeu
    var btnJouer = document.querySelector("#btnJouer"); //créer variable liée au bouton
    btnJouer.addEventListener("click", nouvellePartie); //fonction liée au clic

    function nouvellePartie() {
        partie.nouvellePartie();
    }
});