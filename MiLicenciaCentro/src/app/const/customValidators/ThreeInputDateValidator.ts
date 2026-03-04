import { FormGroup, ValidatorFn } from '@angular/forms';
import moment from 'moment';

const obtenerDiasEnMes = (month: number, year: number) => {
    let date = moment([year]);
    if (month <= 1 && month >= 12) return;
    else {
        let verifyMonth = ([1, 3, 5, 7, 8, 10, 12].includes(+month))
        if (!verifyMonth) {  // except every other month
            if (month == 2) {  // and then there is februrary
                if (date.isLeapYear()) {
                    return 29; // which has 29 if it's a leap year
                } else {
                    return 28; // and 28 if it isn't.
                }
            } else {
                return 30;
            }
        } else {
            return 31;
        }
    }

}

export const FechaValidador: ValidatorFn = (fg: any) => {
    const year = fg.get("anio")!.value;
    const month = fg.get("mes")!.value;
    const day = fg.get("dia")!.value;
    let monthDays: any = obtenerDiasEnMes(month, year);
    return year !== null && month !== null && monthDays >= day
        ? null
        : { range: true };
};