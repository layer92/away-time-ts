import { Box } from "away-core/Box";
import { Expect } from "away-core/Expect";
import { OnException } from "away-core/OnException";

export class DayOfMonthNumberBox extends Box<number>{
    private __DayOfMonthNumberBox__:undefined;
    
    constructor(
        data:number,
        onValidationFail:OnException
    ){
        super(data);
        Expect(!isNaN(data),`data: not a number.`,onValidationFail);
    }

    static MakeFromDate(date: Date) {
        const dayOfMonth = date.getDate();
        return new DayOfMonthNumberBox(dayOfMonth,()=>{});
    }

    /* use length=2 to get a value like 09 for the 9th day of the month */
    toPaddedString(length:number=2){
        const zeroes = new Array(length).fill("0").join("");
        return (zeroes+this._data).slice(-length);
    }

    static FromString(DD: string, onInvalidData:OnException) {
        const data = parseInt(DD);
        Expect(!isNaN(data),`DD: not a number`,onInvalidData);
        return new DayOfMonthNumberBox(data,onInvalidData);
    }
}