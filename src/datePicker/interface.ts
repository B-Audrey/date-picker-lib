import {Dispatch, SetStateAction} from 'react';

export interface DatePickerProps {
    textColor: string,
    backgroundColor: string,
    mainColor: string,
    labelText: string,
    inputName: string,
    isRequired: boolean,
    returnFormat: 'string' | 'zuluString' | 'number' | 'localeUtc',
    setDate?: Dispatch<SetStateAction<any>>
}
