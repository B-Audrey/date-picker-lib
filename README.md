# FRENCH DATE PICKER

This lib has been created to be used in french with a week starting on monday. \
Cette lib a été crée pour être utilisée en français avec une semaine commençant le lundi

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
      parent component.
- [x] Date return formats:
    - `ZuluString` in UTC+00 to ignore potential time zone offsets
    - `String` in 'yyyy-MM-dd' format for string fields
    - `LocaleUtc` for date fields with local time
    - `Number` for number fields with a timestamp

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
    - `ZuluString` string avec la date en Zulu pour ne pas tenir compte des potentiels décalages horaires
    - `String` string dans un format 'yyyy-MM-dd' pour les champs de type String
    - `LocaleUtc` objet de type date pour les champs de type date avec heure locale
    - `Number` nombre pour les champs de type nombre avec un timestamp


## Installation

```bash
npm install french-date-picker
```

## Usage

```tsx
const App = () => {
    const [date, setDate] = React.useState <any>(null);
    useEffect(() => {
        console.log(date, typeof date);
    }, [date]);
    return (
        <>
            <h1>Date Picker Works</h1>
            <DatePicker
                mainColor={'#e19f2e'}
                backgroundColor={'#731d48'}
                textColor={'#bbe0e3'}
                labelText={'Date'}
                inputName={'date'}
                isRequired={true}
                setDate={setDate}
                returnFormat={'zuluString'}
            />
        </>
    )
}
```

```tsx
const App = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    let formData = new FormData(formRef.current!);
    console.log(...formData);
  }
  return (
          <>
            <h1>Date Picker Works</h1>
            <form ref={formRef} onSubmit={handleSubmit}>
              <DatePicker
                      mainColor={'#110A47FF'}
                      backgroundColor={'#c0cac3'}
                      textColor={'#000'}
                      labelText={'Date'}
                      inputName={'date'}
                      isRequired={true}
                      returnFormat={'number'}
              />
              <button>Submit</button>
            </form>
          </>
  )
}
```

## Props

There is an interface for the props, you can use it to see the different props available : 
interface DatePickerProps contains :
- textColor: string, (hexadecimal color)
- backgroundColor: string, (hexadecimal color)
- mainColor: string, (hexadecimal color)
- labelText: string,
- inputName: string, (will be use to get the value in an uncontrolled form)
- isRequired: boolean,
- returnFormat: string, (this value is one of the following values : zuluString, string, localeUtc, number)
- setDate?: Dispatch<SetStateAction<any>> (this is the optionnal function if you want to use a controlled form)

-------------------------------------------------

Il y a une interface pour les props, vous pouvez l'utiliser pour voir les différentes props disponibles :
l'interface DatePickerProps contient :
- textColor: string, (couleur hexadécimale)
- backgroundColor: string, (couleur hexadécimale)
- mainColor: string, (couleur hexadécimale)
- labelText: string,
- inputName: string, (sera utilisé pour récupérer la valeur dans un formulaire non contrôlé)
- isRequired: boolean,
- returnFormat: string, (cette valeur est une doit contenir l'une des valeurs suivantes : zuluString, string, localeUtc, number)
- setDate?: Dispatch<SetStateAction<any>> (c'est la fonction optionnelle si vous voulez utiliser un formulaire contrôlé)


## Style

Style is wrapped in a block with the class .date-picker, you can use it to override it locally as needed.
You must use the css file provided in the lib to have the correct style
Font family is not included in the css file, you can use the one you want
input is displayed as a block and will take 100% of the width of its container

-------------------------------------------------

Le style est englobé dans un bloc ayant pour class .date-picker, vous pouvez l'utiliser pour le surcharger localement selon vos besoins
Vous devez utiliser le fichier css fourni dans la lib pour avoir le style correct
La famille de police n'est pas incluse dans le fichier css, vous pouvez utiliser celle que vous voulez
l'input est affiché en block et prendra 100% de la largeur de son conteneur


## Dependencies / Dépendances

- [react](https://www.npmjs.com/package/react)
- [date-fns](https://www.npmjs.com/package/date-fns)
