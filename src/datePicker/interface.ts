import {Dispatch, SetStateAction} from 'react';

export interface DatePickerProps {
    textColor: string,
    backgroundColor: string,
    mainColor: string,
    labelText: string,
    inputName: string,
    isRequired: boolean,
    returnFormat: DatePickerReturnFormats,
    setDate?: Dispatch<SetStateAction<any>>
}

export enum DatePickerReturnFormats {
    string = 'string', // 'dd/MM/yyyy'
    zuluString = 'zuluString', // 'yyyy-MM-ddTHH:mm:ss.sssZ'
    number = 'number', // 1234567890
    localeUtc = 'localeUtc' // yyyy-MM-ddTHH:mm:ss.sssUTC+2
}
