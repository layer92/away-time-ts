import { OnException } from "away-core/OnException";
import { Box } from "away-core/Box";
import { Expect } from "away-core/Expect";
import { Strings } from "away-strings/Strings";
import { NumericCharset } from "away-strings/Charsets";
import { YearBox } from "./YearBox";
import { MonthNumberBox } from "./MonthNumberBox";
import { DayOfMonthNumberBox } from "./DayOfMonthNumberBox";

/**
 * basically a subset of https://en.wikipedia.org/wiki/ISO_8601, with only support for year, month, and date, and hyphen required.
 * Strings in forms such as:
 * - "2023"
 * - "2023-01"
 * - "2023-01-01"
*/
export class HyphenatedDateStringBox extends Box<string>{
    private HyphenatedDateStringBox:undefined;

    constructor(
        data:string,
        onValidationFail:OnException,
    ){
        Expect(data.includes("-"),`data: expected a hyphen-delimited string: ${data}`,onValidationFail);
        const [yyyy,mm,dd] = data.split("-");
        Expect(yyyy.length===4,`data: did not begin with 4-digit year component: ${data}`,onValidationFail);
        Expect(mm===undefined||mm.length===2,`data: month component was not 2 digits long: ${data}`,onValidationFail);
        Expect(dd===undefined||dd.length===2,`data: day component was not 2 digits long: ${data}`,onValidationFail);
        Expect(Strings.IsInCharset(yyyy,NumericCharset),`data: year (${yyyy}) is not a numeric value: ${data}`,onValidationFail);
        Expect(Strings.IsInCharset(mm,NumericCharset),`data: month (${mm}) is not a numeric value: ${data}`,onValidationFail);
        Expect(Strings.IsInCharset(dd,NumericCharset),`data: day (${dd}) is not a numeric value: ${data}`,onValidationFail);
        super(data);
    }

    /** Returns unix time: the number of seconds since Jan 1 1970     */
    toUnixTime(){
        return new Date(this._data).getTime() / 1000;
    }

    getYear(){
        const raw = this.getUndelimitedString();
        const yyyy = raw.slice(0,4);
        const yearNumber = parseInt(yyyy);
        return yearNumber;
    }

    getYearBox(){
        return new YearBox(this.getYear(),()=>{});
    }

    maybeGetMonthNumber(){
        const raw = this.getUndelimitedString();
        if(raw.length<=4){
            return undefined;
        }
        const mm = raw.slice(4,6);
        const monthNumber = parseInt(mm);
        return monthNumber;
    }

    maybeGetMonthNumberBox(){
        const monthNumber = this.maybeGetMonthNumber();
        if(monthNumber===undefined){
            return undefined;
        }
        return new MonthNumberBox(monthNumber,()=>{});
    }

    maybeGetDayOfMonthNumber(){
        const raw = this.getUndelimitedString();
        if(raw.length<=6){
            return undefined;
        }
        const dd = raw.slice(6,8);
        const dayNumber = parseInt(dd);
        return dayNumber;
    }

    maybeGetDayOfMonthNumberBox(){
        const dayOfMonthNumber = this.maybeGetDayOfMonthNumber();
        if(dayOfMonthNumber===undefined){
            return undefined;
        }
        return new DayOfMonthNumberBox(dayOfMonthNumber,()=>{});
    }

    static MakeFromUnixTime(seconds:number){
        const date = new Date(1000*seconds);
        HyphenatedDateStringBox.MakeFromDate(date);
    }

    static MakeFromDate(date: Date) {
        const year = date.getUTCFullYear();
        const yyyy = ("0000"+year).slice(-4);
        const monthNumber = date.getUTCMonth()+1;
        const mm = ("00"+monthNumber).slice(-2);
        const dayOfMonthNumber = date.getDate();
        const dd = ("00"+dayOfMonthNumber).slice(-2);
        return new HyphenatedDateStringBox(`${yyyy}-${mm}-${dd}`,()=>{});
    }

    private getUndelimitedString(){
        return Strings.RemoveCharacters(this._data,"-");
    }

}
