import './lib.scss';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
    subYears
} from 'date-fns';
import {DatePickerProps} from './interface.ts';


const DatePicker = ({
                        textColor,
                        backgroundColor,
                        mainColor,
                        labelText,
                        inputName,
                        isRequired,
                        returnFormat,
                        setDate
                    }: DatePickerProps) => {

    const dateInputRef = useRef<HTMLInputElement>(null); // ref to hidden input if used with useRef by parent
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']; // days of the week in french, think about custom language in future

    const [id, setId] = useState<string>(''); // use random Id so several datePicker can be used in DOM
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [openCloseStatus, setOpenCloseStatus] = useState(false); // set if calendar is opened or closed status
    const [hasShowAnimationClass, setHasShowAnimationClass] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [hiddenDateValue, setHiddenDateValue] = useState<any>(null);

    //generate a random id for the datepicker when component is rendered
    useEffect(() => {
        setId(getId())
    }, []);


    const getId = () => `${Date.now().toString()}${Math.floor((100 * Math.random())).toString()}`;

    const onDateClick = (day: Date) => {
        setSelectedDate(day);
        const utcDate = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())); // set date to UTC from user selection
        let returnValue: Date | string | number;
        switch (returnFormat) {
            case 'string':
                returnValue = format(utcDate, 'dd/MM/yyyy'); // send formatted string with only day date to parent
                break;
            case 'zuluDate':
                returnValue = utcDate.toISOString(); //send Zulu date in string format to parent
                break;
            case 'number':
                returnValue = utcDate.getTime(); // send timestamp to parent
                break;
            default:
                returnValue = utcDate; // send date object to parent
        }
        console.log('value sent from input', returnValue)
        setHiddenDateValue(returnValue);// si on a un type date, on le renvoie via l'input type date masqué avec la ref
        if (setDate) setDate(returnValue); // si on a un fn setDate, on l'applique
        moveCalendar(false);
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const prevYear = () => {
        setCurrentMonth(subYears(currentMonth, 1));
    }

    const nextYear = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    }

    const goToday = () => {
        setCurrentMonth(new Date());
    }

    const moveCalendar = (isToOpen: boolean) => {
        if (isToOpen) {
            setOpenCloseStatus(true);
            return setTimeout(() => {
                setHasShowAnimationClass(true);
            }, 50);
        }
        if (!isToOpen) {
            setHasShowAnimationClass(false)
            return setTimeout(() => {
                setOpenCloseStatus(false); // on ferme le calendrier pour remove du DOM apres l'animation
            }, 300);
        }
    }

    useEffect(() => {
        if (openCloseStatus) {
            setHasShowAnimationClass(true);
        } else {
            setHasShowAnimationClass(false);
        }
    }, [openCloseStatus]);

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                days.push(
                    <div
                        style={{color: textColor}}
                        className={`col cell ${!isSameMonth(day, monthStart) ? "disabled" : isSameDay(day, selectedDate!) ? "selected" : ""}`}
                        key={day.toString()}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className="number">{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="row body" style={{backgroundColor: backgroundColor}} key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };


    return ( id &&
        <div className="date-picker" id={`${id}`}>
            <label htmlFor={inputName}>{labelText}</label>
            <div className="content" onClick={() => moveCalendar(!openCloseStatus)}>
                <input
                    required={isRequired}
                    id={inputName}
                    name={inputName}
                    style={{display: 'none'}}
                    readOnly
                    ref={dateInputRef}
                    value={hiddenDateValue ? hiddenDateValue : ''}
                />
                <input
                    value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
                    readOnly
                />
                <i className="fa fa-calendar"></i>
            </div>
            {openCloseStatus && createPortal(
                <div style={{backgroundColor: '#FFF'}}>
                    <div id="calendarOverlay" onClick={() => moveCalendar(false)}></div>
                    <div className={`calendar ${hasShowAnimationClass ? 'show' : ''}`}
                         onClick={(e) => e.stopPropagation()}>
                        <div className="header row" style={{backgroundColor: backgroundColor}}>
                            <div>
                                <i style={{color: mainColor}} className="fa-solid fa-calendar-day icon"
                                   onClick={goToday}></i>
                            </div>
                            <div>
                                <span className={'capitalize'}
                                      style={{color: textColor}}>{currentMonth.toLocaleDateString('fr-FR', {
                                    month: 'long',
                                    year: 'numeric'
                                })}</span>
                            </div>
                            <div>
                                <i style={{color: mainColor}} className="fa-solid fa-angles-left icon"
                                   onClick={prevYear}></i>
                                <span>|</span>
                                <i style={{color: mainColor}} className="fa-solid fa-angle-left icon"
                                   onClick={prevMonth}></i>
                                <i style={{color: mainColor}} className="fa-solid fa-angle-right icon"
                                   onClick={nextMonth}></i>
                                <span>|</span>
                                <i style={{color: mainColor}} className="fa-solid fa-angles-right icon"
                                   onClick={nextYear}></i>
                            </div>
                        </div>
                        <div className={'spacer'}/>
                        <div style={{color: textColor, backgroundColor: backgroundColor}} className="row">
                            {days.map((d, i) => <span style={{color: textColor}} className={'col day'}
                                                      key={i}>{d}</span>)}
                        </div>
                        <div className={'spacer'}/>
                        {renderCells()}
                    </div>
                </div>
                ,
                document.getElementById(`${id}`) as HTMLElement
            )}
        </div>
    );
};

export default DatePicker;
