document.addEventListener("DOMContentLoaded", function (event) {

    //Jeu
    class Jeu { //caractéristiques jeu
        constructor(_idSvg, _idPointage) { //constructeur objet
            this.s = Snap(_idSvg); //récupérer et garder svg avec snapsvg
            this.sortiePointage = document.querySelector(_idPointage); //sélectionner affichage pointage html
            this.tailleCarre = 20; //déterminer taille carré serpent
            this.tailleGrille = 15; //déterminer taille grille
        }

        nouvellePartie() { //commencer partie
            this.finPartie(); //appeller fin partie
            this.affichagePoints(1); //pointage au début
            this.pomme = new Pomme(this); //créer pomme
            this.serpent = new Serpent(this); //créer serpent
        }

        finPartie() { //terminer partie
            if (this.pomme !== undefined) { //si il y a une pomme
                this.pomme.supprimePomme(); //la supprimer (graphiquement)
                this.pomme = undefined; //mettre la valeur à indéfini (supprimer de la mémoire)
            }
            if (this.serpent !== undefined) { //si le serpent existe
                this.serpent.supprimeSerpent(); //le supprimer (graphiquement)
                this.serpent = undefined; //mettre la valeur à indéfini (supprimer de la mémoire)
            }
        }

        affichagePoints(_pointage) { //afficher points
            this.sortiePointage.innerHTML = _pointage; //afficher pointage sur la page web
        }


    }

    //Serpent
    class Serpent { //caractéristiques serpent
        constructor(_jeu) { //constructeur serpent
            this.jeu = _jeu; //garder paramètre en mémoire
            this.posCourantX = -1; //position X par défaut
            this.posCourantY = 0; //position Y par défaut
            this.prochainMouvementX = 1; //mouvement X par défaut au début du jeu
            this.prochainMouvementY = 0; //mouvement Y par défaut au début du jeu
            this.longueurSerpent = 1; //longueur serpent par défaut
            this.tblCarreSerpent = []; //carrés du serpent
            this.touche = false; //détecter collisions
            this.vitesse = 250; //vitesse du serpent
            this.intervalle = setInterval(this.controleSerpent.bind(this), this.vitesse); //mettre en place intervalle de calcul de déplacement/collision
            document.addEventListener("keydown", this.verifTouche.bind(this)); //détection de la touche pressée
            /**le ".bind" est utilisé pour que le "this" soit égal au parent souhaité (Serpent/constructeur) et non le parent technique (setInterval, addEventListener)*/
        }

        verifTouche(_evt) { //vérifier touche clavier pressée
            var evt = _evt; //variable pour la touche pressée
            this.deplacement(evt.keyCode); //appeller fonction déplacement avec direction
        }

        deplacement(dir) { //déterminer direction déplacement
            switch (dir) { //déterminer touche pressée
                case 37: //flèche gauche
                    this.prochainMouvementX = -1; //vers la gauche
                    this.prochainMouvementY = 0; //pas de mouvement
                    break;
                case 38: //flèche haut
                    this.prochainMouvementX = 0; //pas de mouvement
                    this.prochainMouvementY = -1; //vers le haut
                    break;
                case 39: //flèche droite
                    this.prochainMouvementX = 1; //vers la droite
                    this.prochainMouvementY = 0; //pas de mouvement
                    break;
                case 40: //flèche bas
                    this.prochainMouvementX = 0; //pas de mouvement
                    this.prochainMouvementY = 1; //vers le bas
                    break;
            }
        }

        controleSerpent() { //gestion collisions
            var prochainX = this.posCourantX + this.prochainMouvementX; //prochain X
            var prochainY = this.posCourantY + this.prochainMouvementY; //prochain Y
            this.tblCarreSerpent.forEach(function (element) { //pour chaque carré déjà dans le tableau
                if (prochainX === element[1] && prochainY === element[2]) { //si égal à un carré déjà placé
                    console.log("touche moi-même");
                    this.jeu.finPartie(); //fin de partie
                    this.touche = true; //entre en collision
                }
            }.bind(this));
            if (prochainY < 0 || prochainX < 0 || prochainY > this.jeu.tailleGrille - 1 || prochainX > this.jeu.tailleGrille - 1) { //limites zone de jeu
                console.log("touche limite");
                this.jeu.finPartie(); //fin de partie
                this.touche = true; //entre en collision
            }
            if (!this.touche) {
                if (this.posCourantX === this.jeu.pomme.pomme[1] && this.posCourantY === this.jeu.pomme.pomme[2]) {//si collision avec pomme
                    this.longueurSerpent++;
                    this.jeu.affichagePoints(this.longueurSerpent);
                    this.jeu.pomme.supprimePomme();
                    this.jeu.pomme.ajoutePomme();
                }
                this.dessineCarre(prochainX, prochainY); //dessine carré serpent
                this.posCourantX = prochainX; //avancer à la prochaine position
                this.posCourantY = prochainY; //avancer à la prochaine position
            }
        }

        dessineCarre(x, y) { //mise en place des carrés du serpent
            var unCarre = [this.jeu.s.rect(x * this.jeu.tailleCarre, y * this.jeu.tailleCarre, this.jeu.tailleCarre, this.jeu.tailleCarre), x, y]; //création carré serpent avec snapsvg; mise en tableau avec positions
            this.tblCarreSerpent.push(unCarre); //mettre carré dans tableau des carrés
            if (this.tblCarreSerpent.length > this.longueurSerpent) { //si tableau carrés > longueur
                this.tblCarreSerpent[0][0].remove(); //supprimer carré graphiquement
                this.tblCarreSerpent.shift(); //supprimer carré dans le tableau
            }
        }

        supprimeSerpent() { //supprimer serpent
            clearInterval(this.intervalle); //supprimer intervalle
            while (this.tblCarreSerpent.length > 0) { //tant que le tableau est plus grand que 0
                this.tblCarreSerpent[0][0].remove(); //supprimer carré graphiquement
                this.tblCarreSerpent.shift(); //supprimer carré dans le tableau
            }
        }

    }

    //Pomme
    class Pomme { //caractéristiques pomme
        constructor(_jeu) { //constructeur pomme
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