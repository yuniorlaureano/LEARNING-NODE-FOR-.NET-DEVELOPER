db.holidays.insert({ name: "New Year's Day", date: ISODate("2016-01-01") });
db.holidays.insert({ name: "Good Friday", date: ISODate("2016-03-25") });
db.holidays.insert({ name: "Easter Monday", date: ISODate("2016-03-28") });
db.holidays.insert({ name: "Early May bank holiday", date: ISODate("2016-05-02") });
db.holidays.insert({ name: "Spring bank holiday", date: ISODate("2016-05-30") });
db.holidays.insert({ name: "Summer bank holiday", date: ISODate("2016-08-29") });
db.holidays.insert({ name: "Boxing Day", date: ISODate("2016-12-26") });
db.holidays.insert({ name: "Christmas Day", date: ISODate("2016-12-27"), substitute_for: ISODate("2016-12-25") });