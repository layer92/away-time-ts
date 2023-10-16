import { Box } from "away-core/Box";
import { Expect } from "away-core/Expect";
import { OnException } from "away-core/OnException";

export const LowercaseThreeLetterMonthStrings = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"] as const;
export const ThreeLetterMonthStrings = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"] as const;


export type LowercaseThreeLetterMonthString = typeof LowercaseThreeLetterMonthStrings[number];

export const EnglishMonthNameStrings = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
] as const;

export type EnglishMonthNameString = typeof EnglishMonthNameStrings[number];

/** 1-12 */
export class MonthNumberBox extends Box<number>{
    private __MonthNumberBox__:undefined;

    constructor(
        monthNumberData:number,
        onValidationFail:OnException
    ){
        Expect( monthNumberData>=1 && monthNumberData<=12, `data: out of range`, onValidationFail );
        Expect(!isNaN(monthNumberData), `data: not a number`, onValidationFail);
        super(monthNumberData);
    }

    static MakeFromDate(date: Date) {
        const index = date.getUTCMonth();
        return new MonthNumberBox(index+1,()=>{});
    }


    static FromString(MM: string,onBadData:OnException) {
        const data = parseInt(MM);
        Expect(!isNaN(data),`MM: not a number`,onBadData);
        return new MonthNumberBox(data,onBadData);
    }

    static MakeFromThreeLetterEnglishMonthString(month3:string,onBadData:OnException){
        const index = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ].indexOf(month3.toLowerCase());
        Expect(index!==1,`unrecognized month3 value: `+month3,onBadData);
        return new MonthNumberBox(1+index,onBadData);
    }

    
    /** 0-11 */
    getMonthIndex(){
        return this._data-1;
    }

    /* use length=2 to get a value like 02 for February */
    toPaddedString(length:number=2){
        const zeroes = new Array(length).fill("0").join("");
        return (zeroes+this._data).slice(-length);
    }

}