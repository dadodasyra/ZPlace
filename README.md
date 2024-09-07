# ZPlace Bot placer
Ce bot place automatiquement des pixels sur le site [ZEvent place](https://place.zevent.fr/) organisé par Zerator à l'occasion du ZEvent 2024.

## Installation
Pour installer le bot, il faut d'abord installer [node.js](https://nodejs.org/en/). Ensuite, il faut télécharger le code source du bot en cliquant sur le bouton "Code" en haut à droite de la page, puis sur "Download ZIP". Une fois le code source téléchargé, il faut le décompresser et ouvrir un terminal dans le dossier du bot. Ensuite, il faut installer les dépendances du bot en tapant la commande suivante :
```bash
npm install
```
Enfin il vous faut juste modifier le fichier `config.json` pour mettre votre token discord et votre token zevent place.

Si vous définissez placing à "false" aucun crédit ne sera utiliser mais on vous donnera l'estimation du prix en pixels

Vous lancez le bot en tapant la commande suivante :
```bash
node index.js
```

## Format image
L'image doit faire du 500x500 pixels (taille de la map) sur fond transparent en format png. 
Pour récupérer l'image de la map actuel en PNG le script vous donnera un lien pour la télécharger au démarrage.

Exemple : https://zevent-cdn.mog.gg/zplace-cdn.mog.gg/full/1725711406291.png (update le 07/09/24 à 14:15)

Les couleurs sont automatiquement adaptés à celles disponibles sur le zPlace (bêta).

## Bearer Token
Du mal à trouver le token d'authentification ? Voici comment le trouver :

1. Tout d'abord il faut que vous soyez connecté sur le site [ZEvent place](https://place.zevent.fr/) à votre compte twitch
2. Ouvrez la console de développement de votre navigateur (F12)
3. Allez dans l'onglet "Application"
4. Dans l'onglet "Storage" ou "Appli", developpez "Stockage local"
5. Cherchez le cookie "token" et copiez son contenu
6. Mettez le dans la config

# Disclaimer
S'il vous plait n'utilisez pas ce bot pour détruire mais utilisez-le pour faire de jolis trucs. Merci.

## Utilisé pour
Pour figurer dans cette catégorie ouvrez une issue avec un screen (en passant par l'image png transparente expliqué dans la partie ["Format image"](#format-image)) de la partie que vous avez créé avec le bot ainsi que le prix que ça vous a couté.

En 2022:
- ~350 pour le H (logo de [Histeria](https://histeria.fr))
- ~100 pour le "histeria.fr" (de [Histeria](https://histeria.fr))
- ~400 pour le H (logo de [Histeria](https://histeria.fr)) plus grosse version et bonne couleur

En 2024: 
- ~550 en 531 208 pour le logo H (logo de [Histeria](https://histeria.fr))