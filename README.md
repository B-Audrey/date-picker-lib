# FRENCH DATE PICKER

This lib has been created to be used in french with a week starting on monday
Cette lib a été créee pour être utilisée en français avec une semaine commencant le lundi

## Features / Fonctionnalités

- [x] Date selection with a calendar display
- [x] Navigation
    - To the current day
    - Between months
    - Between years
    - Between decades
- [x] Customization of colors
    - Background color
    - Text color
    - Icon color
- [x] Usage in all forms
    - Controlled Form: returns the value via a setDateState() function
    - Uncontrolled Form: returns the value via the input's name and a useRef associated with a form in your
      parent component
- [x] Date return formats:
    - ISOString in UTC+00 to ignore potential time zone offsets
    - String in 'yyyy-MM-dd' format for string fields
    - DateUtc for date fields with local time
    - Number for number fields with a timestamp

-----------------------------------

- [x] Sélection de la date sur un affichage calendaire
- [x] Navigation
    - au jour J
    - entre les mois
    - entre les années
    - entre les décennies
- [x] Personnalisation des couleurs
    - Couleur de fond
    - Couleur de texte
    - Couleur des icônes
- [x] Utilisation dans tous les formulaires
    - Controlled Form : renvoie de la valeur via une fonction setDateState()
    - Uncontrolled Form : renvoie de la valeur via le name de l'input un useRef associé à un form dans votre composant
      parent
- [x] Renvoi de la date au format :
    - `ISOString` en UCT00 pour ne pas tenir compte des potentiels décalages horaires
    - `String` dans un format 'yyyy-MM-dd' pour les champs de type String
    - `DateUtc` pour les champs de type date avec heure locale
    - `Number` pour les champs de type nombre avec un timestamp


## Installation

```bash
npm install french-react-date-picker
```


## Dependencies / Dépendances

- [react](https://www.npmjs.com/package/react)
- [date-fns](https://www.npmjs.com/package/date-fns)
