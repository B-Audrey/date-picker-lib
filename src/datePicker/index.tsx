import './date-picker.scss';
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
import {DatePickerProps, DatePickerReturnFormats} from './interface.ts';

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
            case DatePickerReturnFormats.string:
                returnValue = format(utcDate, 'dd/MM/yyyy');
                break;
            case DatePickerReturnFormats.zuluString:
                returnValue = utcDate.toISOString();
                break;
            case DatePickerReturnFormats.number:
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
        const startDate = startOfWeek(monthStart, {weekStartsOn: 1});
        const endDate = endOfWeek(monthEnd, {weekStartsOn: 1});

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
                <div className="calendar-icon icon">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path fill={mainColor}
                              d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"/>
                    </svg>
                </div>
            </div>
            {openCloseStatus && createPortal(
                <div style={{backgroundColor: '#FFF'}}>
                    <div id="calendarOverlay" onClick={() => moveCalendar(false)}></div>
                    <div className={`calendar ${hasShowAnimationClass ? 'show' : ''}`}
                         onClick={(e) => e.stopPropagation()}>
                        <div className="header row" style={{backgroundColor: backgroundColor}}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={goToday}
                                     viewBox="0 0 448 512">
                                    <path
                                        fill={mainColor}
                                        d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm80 64c-8.8 0-16 7.2-16 16l0 96c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16l-96 0z"/>
                                </svg>
                            </div>

                            <div>
                                {/*Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={prevTenYears}
                                     viewBox="0 0 448 512">
                                    <path
                                        fill={mainColor}
                                        d="M128 0c13.3 0 24 10.7 24 24l0 40 144 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 40 0c35.3 0 64 28.7 64 64l0 16 0 48 0 256c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 192l0-48 0-16C0 92.7 28.7 64 64 64l40 0 0-40c0-13.3 10.7-24 24-24zM400 192L48 192l0 256c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-256zM296 352l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24z"/>
                                </svg>
                                <span>|</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={prevYear}
                                     viewBox="0 0 512 512">
                                    <path
                                        fill={mainColor}
                                        d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"/>
                                </svg>
                                <span>|</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={prevMonth}
                                     viewBox="0 0 320 512">
                                    <path
                                        fill={mainColor}
                                        d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={nextMonth}
                                     viewBox="0 0 320 512">
                                    <path
                                        fill={mainColor}
                                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                </svg>
                                <span>|</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={nextYear}
                                     viewBox="0 0 512 512">
                                    <path
                                        fill={mainColor}
                                        d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/>
                                </svg>
                                <span>|</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="icon"
                                     onClick={nextTenYears}
                                     viewBox="0 0 448 512">
                                    <path
                                        fill={mainColor}
                                        d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256zm176 40c-13.3 0-24 10.7-24 24l0 48-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0 0 48c0 13.3 10.7 24 24 24s24-10.7 24-24l0-48 48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-48c0-13.3-10.7-24-24-24z"/>
                                </svg>

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
