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

const DatePicker = ({textColor, backgroundColor, mainColor}: {
    textColor: string,
    backgroundColor: string,
    mainColor: string
}) => {
    const [openCloseStatus, setOpenCloseStatus] = useState(false);
    const [hasShowAnimationClass, setHasShowAnimationClass] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const dateInputRef = useRef<HTMLInputElement>(null);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const onDateClick = (day: Date) => {
        setSelectedDate(day);
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
        console.log('je suis dans move calendar avec', isToOpen, 'la class show est', hasShowAnimationClass, 'le calendrier est', openCloseStatus)
        if (isToOpen) {
            console.log('je suis dans le if move calendar avec is open a false donc fermé, je dois l ouvrir')
            setOpenCloseStatus(true);
            return setTimeout(() => {
                setHasShowAnimationClass(true);
                console.log('je bouge la class')
            }, 50);

        }
        if (!isToOpen) {
            console.log('je suis dans le else is calendar true donc ouvert, je dois le fermer')
            setHasShowAnimationClass(false)
            console.log('j enleve la classe show')
            return setTimeout(() => {
                setOpenCloseStatus(false); // on ferme le calendrier pour remove du DOM apres l'animation
                console.log('time out écoulé, je ferme le calendrier')
            }, 300);
        }
        console.log(isToOpen)
        console.log(hasShowAnimationClass)
        console.log(openCloseStatus)
        console.log('je suis à la fin de move calendar')
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


    return (
        <div className="date-picker" id={'portal-root'}>
            <div className="content" onClick={() => moveCalendar(!openCloseStatus)}>
                <input
                    type="text"
                    value={selectedDate ? selectedDate.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }) : ''}
                    readOnly
                    ref={dateInputRef}
                />
                <i className="fa fa-calendar"></i>
            </div>
            {openCloseStatus && createPortal(
                <div style={{backgroundColor: '#FFF'}}>
                    <div className={`calendar ${hasShowAnimationClass ? 'show' : ''}`}>
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
                </div>,
                document.getElementById('portal-root') as HTMLElement
            )}
        </div>
    );
};

export default DatePicker;
