export interface DateResultsObj {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}



export class DateUtil {
  
  static getTimeDifference(startDate: Date, endDate: Date): DateResultsObj {
    const timeDifferent: number = Math.abs(endDate.getTime() - startDate.getTime());

    // sec to years = 60 * 60 * 24 * 30 * 12  

    const years: number = Math.floor(timeDifferent / (1000 * 60 * 60 * 24 * 365.25));
    const months: number = Math.floor((timeDifferent % (1000 * 60 * 60 * 24 * 365.25))/ (1000 * 60 * 60 * 24 * 30.44)); 
    const days: number = Math.floor( (timeDifferent % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor( (timeDifferent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes: number = Math.floor( (timeDifferent % (1000 * 60 * 60)) / (1000 * 60));



    return {
      years,
      months,
      days,
      hours,
      minutes
    }

  }
}