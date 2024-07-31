import './lib.scss';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
    addDays,
    addMonths,
    addYears,
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

    const dateInputRef = useRef<HTMLInputElement>(null);
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const [id, setId] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [openCloseStatus, setOpenCloseStatus] = useState(false);
    const [hasShowAnimationClass, setHasShowAnimationClass] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [hiddenDateValue, setHiddenDateValue] = useState<any>(null);


    useEffect(() => {
        setId(getId());
    }, []);

    const getId = () => `${Date.now().toString()}${Math.floor((100 * Math.random())).toString()}`;

    const onDateClick = (day: Date) => {
        setSelectedDate(day);
        const utcDate = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
        let returnValue: Date | string | number;
        switch (returnFormat) {
            case 'string':
                returnValue = format(utcDate, 'dd/MM/yyyy');
                break;
            case 'zuluDate':
                returnValue = utcDate.toISOString();
                break;
            case 'number':
                returnValue = utcDate.getTime();
                break;
            default:
                returnValue = utcDate;
        }
        setHiddenDateValue(returnValue);
        if (setDate) setDate(returnValue);
        moveCalendar(false);
    };

    const nextMonth = () => {
        const newMonth = addMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
    };

    const prevMonth = () => {
        const newMonth = subMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
    };

    const prevYear = () => {
        const newMonth = subYears(currentMonth, 1);
        setCurrentMonth(newMonth);
    };

    const nextYear = () => {
        const newMonth = addYears(currentMonth, 1);
        setCurrentMonth(newMonth);
    };
    const nextTenYears = () => {
        const newMonth = addYears(currentMonth, 10);
        setCurrentMonth(newMonth);
    };

    const prevTenYears = () => {
        const newMonth = subYears(currentMonth, 10);
        setCurrentMonth(newMonth);
    }

    const goToday = () => {
        setCurrentMonth(new Date());
    };

    const moveCalendar = (isToOpen: boolean) => {
        if (isToOpen) {
            setOpenCloseStatus(true);
            return setTimeout(() => {
                setHasShowAnimationClass(true);
            }, 50);
        }
        if (!isToOpen) {
            setHasShowAnimationClass(false);
            return setTimeout(() => {
                setOpenCloseStatus(false);
            }, 300);
        }
    };

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
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

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

    return (id &&
        <div className="date-picker" id={`${id}`}>
            <label htmlFor={inputName}>{labelText}</label>
            <div className="content" onClick={() => moveCalendar(!openCloseStatus)}>
                <input
                    value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
                    readOnly
                />
                <input
                    required={isRequired}
                    id={inputName}
                    name={inputName}
                    style={{display: 'none'}}
                    readOnly
                    ref={dateInputRef}
                    value={hiddenDateValue ? hiddenDateValue : ''}
                />
                <i style={{color: mainColor}} className="fa fa-calendar"></i>
            </div>
            {openCloseStatus && createPortal(
                <div style={{backgroundColor: '#FFF'}}>
                    <div id="calendarOverlay" onClick={() => moveCalendar(false)}></div>
                    <div className={`calendar ${hasShowAnimationClass ? 'show' : ''}`}
                         onClick={(e) => e.stopPropagation()}>
                        <div className="header row" style={{backgroundColor: backgroundColor}}>
                            <div>
                                <i style={{color: mainColor}} className="fa-solid fa-calendar-day icon"
                                   onClick={goToday} title={"Aujourd'hui"}></i>
                            </div>

                            <div>
                                <i style={{color: mainColor}} className="fa-regular fa-calendar-minus icon"
                                   onClick={prevTenYears} title={'-10 ans'}></i>
                                <span>|</span>
                                <i style={{color: mainColor}} className="fa-solid fa-angles-left icon"
                                   onClick={prevYear} title={'-1 an'}></i>
                                <span>|</span>
                                <i style={{color: mainColor}} className="fa-solid fa-angle-left icon"
                                   onClick={prevMonth} title={'-1 mois'}></i>
                                <i style={{color: mainColor}} className="fa-solid fa-angle-right icon"
                                   onClick={nextMonth} title={'+1 mois'}></i>
                                <span>|</span>
                                <i style={{color: mainColor}} className="fa-solid fa-angles-right icon"
                                   onClick={nextYear} title={'+1 an'}></i>
                                <span>|</span>
                                <i style={{color: mainColor}} className="fa-regular fa-calendar-plus icon"
                                   onClick={nextTenYears} title={'+10 ans'}></i>

                            </div>
                        </div>
                        <span className={'current-date'}
                              style={{
                                  color: textColor,
                                  backgroundColor: backgroundColor
                              }}>{currentMonth.toLocaleDateString('fr-FR', {
                            month: 'long',
                            year: 'numeric'
                        })}</span>
                        <div className={'spacer'}/>
                        <div style={{color: textColor, backgroundColor: backgroundColor}} className="row">
                            {days.map((d, i) => <span style={{color: textColor}} className={'col day'}
                                                      key={i}>{d}</span>)}
                        </div>
                        <div className={'spacer'}/>
                        {renderCells()}
                    </div>
                </div>,
                document.getElementById(`${id}`) as HTMLElement
            )}
        </div>
    );
};

export default DatePicker;
