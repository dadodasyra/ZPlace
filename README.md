# ZPlace Bot placer
Ce bot place automatiquement des pixels sur le site [ZEvent place](https://place.zevent.fr/) organisé par Zerator à l'occasion du ZEvent 2022.

## Installation
Pour installer le bot, il faut d'abord installer [node.js](https://nodejs.org/en/). Ensuite, il faut télécharger le code source du bot en cliquant sur le bouton "Code" en haut à droite de la page, puis sur "Download ZIP". Une fois le code source téléchargé, il faut le décompresser et ouvrir un terminal dans le dossier du bot. Ensuite, il faut installer les dépendances du bot en tapant la commande suivante :
```bash
npm install
```
Enfin il vous faut juste modifier le fichier `config.json` pour mettre votre token discord et votre token zevent place.

Vous lancez le bot en tapant la commande suivante :
```bash
node index.js
```

## Format image
L'image doit faire du 700x700 pixels sur fond transparent en format png. 
Pour vous aider à faire votre calque vous pouvez récupérer la "map" actuel du zPlace en cherchant le packet "full" envoyé lors du chargement de la page. 
Exemple : https://zevent-cdn.mog.gg/zplace/full/1662854964732.png (update le 11/09 à 02:10)
Les couleurs sont automatiquement adaptés à celles disponibles sur le zPlace (bêta).

## Bearer Token
Du mal à trouver le "Bearer token" ? Voici comment le trouver :

1. Tout d'abord il faut que vous soyez connecté sur le site [ZEvent place](https://place.zevent.fr/) à votre compte twitch
2. Ouvrez la console de développement de votre navigateur (F12)
3. Allez dans l'onglet "Application"
4. Dans l'onglet "Storage" ou "Appli", developpez "Stockage local"
5. Cherchez le cookie "token" et copiez son contenu
6. C'est votre bearer token

# Disclaimer
S'il vous plait n'utilisez pas ce bot pour détruire mais utilisez-le pour faire de jolis trucs. Merci.

## Utilisé pour :
Pour figurer dans cette catégorie ouvrez une issue avec un screen (en passant par l'image png transparente expliqué dans la partie ["Format image"](#format-image)) de la partie que vous avez créé avec le bot ainsi que le prix que ça vous a couté.

~350 pour le H (logo de [Histeria](https://histeria.fr))
![dadodasyra](https://cdn.discordapp.com/attachments/695242700995428392/1017897515955257354/1662754264371.png)

~100 pour le "histeria.fr" (de [Histeria](https://histeria.fr))
![dadodasyra](https://cdn.discordapp.com/attachments/695242700995428392/1017898456389521478/unknown.png)

~400 pour le H (logo de [Histeria](https://histeria.fr)) version plus gros et bonne couleur
![dadodasyra](https://cdn.discordapp.com/attachments/1018134205131145237/1018311768054960138/map.png)
