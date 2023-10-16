import { Box } from "away-core/Box";
import { Expect } from "away-core/Expect";
import { OnException } from "away-core/OnException";

export class YearBox extends Box<number>{
    private __YearBox__:undefined;
    
    constructor(
        data:number,
        onValidationFail:OnException
    ){
        super(data);
        Expect(!isNaN(data),`data: not a number`,onValidationFail);
    }

    static FromString(yyyy: string,onBadData:OnException) {
        const data = parseInt(yyyy);
        Expect(!isNaN(data),`bad argument: yyyy: not a number, received: `+yyyy,onBadData);
        return new YearBox(data,onBadData);
    }

    static MakeFromDate(date: Date) {
        const year = date.getUTCFullYear();
        return new YearBox(year,()=>{});
    }

    /* use length=2 to get a value like 92 for 1992, of length=4 to get a value like 0123 for 123 */
    toPaddedString(length:number=4){
        const zeroes = new Array(length).fill("0").join("");
        return (zeroes+this._data).slice(-length);
    }
}