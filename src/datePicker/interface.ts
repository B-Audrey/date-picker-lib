export interface DatePickerProps {
    textColor: string,
    backgroundColor: string,
    mainColor: string,
    labelText: string,
    inputName: string,
    isRequired: boolean,
    returnFormat: 'string' | 'zuluDate' | 'number' | 'locale',
    setDate?: (date:any) => void
}
