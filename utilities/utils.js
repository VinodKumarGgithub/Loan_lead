
var moment = require("moment-timezone");
var Magic = require("mmmagic");
var magic = new Magic.Magic(Magic.MAGIC_MIME_TYPE);
var async = require("async");

module.exports.convertToJsonFromDifferentFormats = function (
  dateStringParam,
  format
) {
  // FORMATS
  // 'm/d/y'
  // 'd/m/y'
  // 'y/m/d'

  var d = dateStringParam;

  var dateArr;
  var dateConverted, dateString;
  if (format == "m/d/y") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "d/m/y") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  } else if (format == "y/m/d") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
    }
  } else if (format == "m-d-y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "y-m-d") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
    }
  } else if (format == "d-m-y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  } else if (format == "m.d.y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "d.m.y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  }

  if (dateString) {
    dateConverted = new Date(dateString);

    return dateConverted;
  } else {
    return null;
  }
};

module.exports.convertToJsonFromDifferentFormats_WithTimeStartJson = function (
  dateStringParam,
  format
) {
  // FORMATS
  // 'm/d/y'
  // 'd/m/y'
  // 'y/m/d'

  var d = dateStringParam;

  var dateArr;
  var dateConverted, dateString;
  if (format == "m/d/y") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "d/m/y") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  } else if (format == "y/m/d") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
    }
  } else if (format == "m-d-y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "y-m-d") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
    }
  } else if (format == "d-m-y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  } else if (format == "m.d.y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "d.m.y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  }

  if (dateString) {
    console.log("date string is ", dateString + "T00:00:00.00Z");
    dateConverted = new Date(dateString + "T00:00:00.00Z");

    return dateConverted;
  } else {
    return null;
  }
};

module.exports.convertToJsonFromDifferentFormatsWithPad = function (
  dateStringParam,
  format
) {
  // FORMATS
  // 'm/d/y'
  // 'd/m/y'
  // 'y/m/d'

  var d = dateStringParam;

  var dateArr;
  var dateConverted, dateString;
  if (format == "m/d/y") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      if (dateArr[2].length == 2) {
        var nowFullYear = new Date();
        nowFullYear = nowFullYear.getUTCFullYear() + "";
        dateArr[2] = nowFullYear.substr(0, 2) + dateArr[2];
      }
      dateString = dateArr[2] + "-" + pad(dateArr[0]) + "-" + pad(dateArr[1]);
    }
  } else if (format == "d/m/y") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  } else if (format == "y/m/d") {
    dateArr = d.split("/");
    if (dateArr.length > 0) {
      dateString = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
    }
  } else if (format == "m-d-y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "y-m-d") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
    }
  } else if (format == "d-m-y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  } else if (format == "m.d.y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
    }
  } else if (format == "d.m.y") {
    dateArr = d.split("-");
    if (dateArr.length > 0) {
      dateString = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    }
  }

  if (dateString) {
    dateConverted = new Date(dateString);

    return dateConverted;
  } else {
    return null;
  }
};

module.exports.getOnlyDateWithSlashFormatMMDDYYYY = function (d) {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  if (d == "-") {
    return "-";
  } else {
    if (!d) {
      return "";
    } else {
      console.log(
        pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "-" + d.getFullYear()
      );
      return (
        pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "-" + d.getFullYear()
      );
    }
  }
};

module.exports.isEmpty = function isEmpty(obj) {
  // Speed up calls to hasOwnProperty
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
};

module.exports.ISODateString = function (d) {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds()) +
    "." +
    pad(d.getMilliseconds()) +
    "Z"
  );
};

module.exports.getOnlyDate = function (d) {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  // + '.'
  // + pad(d.getMilliseconds()) + 'Z';
};

module.exports.getOnlyDateWithSlashFormatDDMMYYYY = function dobDateString(d) {
  d = new Date(d);

  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  if (d == "-") {
    return "-";
  } else {
    if (!d) {
      return "";
    } else {
      return (
        pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear()
      );
    }
  }
};

module.exports.getOnlyDateWithMonthsThreeCharNames =
  function DateStringFormWithShortMonth(d) {
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }

    var monthNamesShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var monthIndex = d.getMonth();

    return (
      pad(d.getDate()) +
      "-" +
      monthNamesShort[monthIndex] +
      "-" +
      d.getFullYear()
    );
    // + '.'
    // + pad(d.getMilliseconds()) + 'Z';
  };

module.exports.copyObject = function copy(obj) {
  var a = {};
  for (var x in obj) a[x] = obj[x];
  return a;
};

module.exports.getTimeFromDate = function getTimeFromDate(date) {
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return hour + ":" + min; // + ":" + sec;
};

module.exports.compareTwoDates = function compareTwoDates(date1, date2) {
  var dateObj1 = new Date(date1);
  var month1 = dateObj1.getMonth() + 1;
  var day1 = dateObj1.getDate();
  var year1 = dateObj1.getFullYear();
  var dateObj2 = new Date(date2);
  var month2 = dateObj2.getMonth() + 1;
  var day2 = dateObj2.getDate();
  var year2 = dateObj2.getFullYear();
  if (year1 == year2 && month1 == month2 && day1 == day2) {
    //console.log(year1 +' == '+ year2)
    //console.log(day1 +' == '+  day2)
    //console.log(month1 +' == '+  month2)
    return true;
  } else {
    return false;
  }
};

module.exports.getGTorEQdate = function compareTwoDates(date1, date2) {
  var dateObj1 = new Date(date1);
  var month1 = dateObj1.getMonth() + 1;
  var day1 = dateObj1.getDate();
  var year1 = dateObj1.getFullYear();
  var dateObj2 = new Date(date2);
  var month2 = dateObj2.getMonth() + 1;
  var day2 = dateObj2.getDate();
  var year2 = dateObj2.getFullYear();

  if (year1 > year2) {
    return true;
  } else if (year1 == year2) {
    if (month1 > month2) {
      return true;
    } else if (month1 == month2) {
      if (day1 > day2) {
        return true;
      } else if (day1 == day2) {
        return true;
      }
    }
  }

  return false;
};

module.exports.getSMorEQdate = function compareTwoDates(date1, date2) {
  var dateObj1 = new Date(date1);
  var month1 = dateObj1.getMonth() + 1;
  var day1 = dateObj1.getDate();
  var year1 = dateObj1.getFullYear();
  var dateObj2 = new Date(date2);
  var month2 = dateObj2.getMonth() + 1;
  var day2 = dateObj2.getDate();
  var year2 = dateObj2.getFullYear();
  if (year1 < year2) {
    return true;
  } else if (year1 == year2) {
    if (month1 < month2) {
      return true;
    } else if (month1 == month2) {
      if (day1 < day2) {
        return true;
      } else if (day1 == day2) {
        return true;
      }
    }
  }

  return false;
};


module.exports.asc = function (array, key) {
  function compare(a, b) {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  }

  array.sort(compare);
};

module.exports.desc = function (array, key) {
  function compare(a, b) {
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  }

  array.sort(compare);
};

module.exports.covertJsonToCSV = function convertJsonToCSV(
  res,
  data,
  fields,
  fieldNames,
  filename,
  callback
) {
  var json2csv = require("json2csv");

  // var utils = require("./utils");

  json2csv(
    {
      data: data,
      fields: fields,
      fieldNames: fieldNames,
      // excelStrings: true
    },
    function (err, csv) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + filename + ".csv"
        );
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        res.setHeader("content-type", "text/csv");
        res.send(csv);
        callback();
      }
    }
  );
};

module.exports.covertJsonToCSVWithDefault = function covertJsonToCSVWithDefault(
  res,
  data,
  fields,
  filename,
  callback
) {
  var json2csv = require("json2csv");

  // var utils = require("./utils");

  json2csv(
    {
      data: data,
      fields: fields,
      // excelStrings: true
    },
    function (err, csv) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + filename + ".csv"
        );
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        res.setHeader("content-type", "text/csv");
        res.send(csv);
        callback();
      }
    }
  );
};

module.exports.templateDownloadPath = __dirname + "/files/templates/";

module.exports.getLast4DigitsFromCardNumber =
  function getLast4DigitsFromCardNumber(number) {
    var lastDigits = number.substr(number.length - 4, 4);

    return lastDigits;
  };

module.exports.validateXlxsOnly = function (req, result) {
  //console.log('\nvalidating file\n')
  //console.log(req.body)
  //var error_msg = [];
  //return result(error_msg);
  var keys = Object.keys(req.body);

  console.log("total " + keys.length + " keys: " + keys);

  var fieldNameArray, fieldName;
  var two_mb = 10097152;

  var error_msg = [];

  if (keys.length <= 0) {
    return result(error_msg);
  }

  async.forEach(
    keys,
    function (eachKey, callback) {
      //console.log(eachKey);
      if (
        Object.prototype.toString.call(req.body[eachKey]) === "[object Array]"
      ) {
        fieldNameArray = req.body[eachKey];

        async.forEach(
          fieldNameArray,
          function (eachField, callback) {
            magic.detectFile(eachField.path, function (err, result) {
              if (err) callback(err);
              console.log(result);
              //console.log(result.substring(0, 5).toLowerCase());
              if (
                result == "application/vnd-xls" ||
                result == "application/msexcel" ||
                result == "application/x-msexcel" ||
                result == "application/x-ms-excel" ||
                result == "application/x-excel" ||
                result == "application/x-dos_ms_excel" ||
                result == "application/xls" ||
                result == "application/x-xls" ||
                result ==
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                result == "application/vnd.ms-excel" ||
                result ==
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ) {
                if (eachField.size > two_mb) {
                  error_msg.push({
                    ext: eachField.extension,
                    mimetype: result,
                    originalname: eachField.originalname,
                    size: eachField.size,
                    type: "size",
                  });
                }
              } else {
                error_msg.push({
                  ext: eachField.extension,
                  mimetype: result,
                  originalname: eachField.originalname,
                  size: eachField.size,
                  type: "other",
                });
              }
              callback();
            });
          },
          function (err) {
            if (err) {
              callback([{ ext: "unknown", type: "unknown", error: err }]);
            } else {
              callback();
            }
          }
        );
      } else {
        fieldName = req.body[eachKey];

        magic.detectFile(fieldName.path, function (err, result) {
          if (err) {
            callback(err);
          } else {
            console.log(result);
            if (
              result == "application/vnd-xls" ||
              result == "application/msexcel" ||
              result == "application/x-msexcel" ||
              result == "application/x-ms-excel" ||
              result == "application/x-excel" ||
              result == "application/x-dos_ms_excel" ||
              result == "application/xls" ||
              result == "application/x-xls" ||
              result ==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              result == "application/vnd.ms-excel" ||
              result ==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
              console.log(
                "file of size " + fieldName.size + " tried to upload"
              );
              if (fieldName.size > two_mb) {
                error_msg.push({
                  ext: fieldName.extension,
                  mimetype: result,
                  originalname: fieldName.originalname,
                  size: fieldName.size,
                  type: "size",
                });
              }
            } else {
              error_msg.push({
                ext: fieldName.extension,
                mimetype: fieldName.mimetype,
                originalname: fieldName.originalname,
                size: fieldName.size,
                type: "other",
              });
            }
            callback();
          }
        });
      }
    },
    function (err) {
      if (err) {
        console.log(err);
        return result(err);
      } else {
        console.log("valid file");
        console.log(error_msg);
        return result(error_msg);
      }
    }
  );
};

module.exports.getEndDate = function getEndDate(
  startDate,
  interval,
  frequency
) {
  if (startDate) {
    var d = new Date(startDate);
    frequency = frequency ? Number(frequency) : 1;
    if (interval == "days") {
      d = d.setDate(d.getDate() + frequency);
      return new Date(d);
    } else if (interval == "months") {
      d = d.setMonth(d.getMonth() + frequency);
      return new Date(d);
    } else if (interval == "years") {
      d = d.setFullYear(d.getFullYear() + frequency);
      return new Date(d);
    } else {
      return new Date(d);
    }
  }
};

module.exports.truncate20 = function truncate20(value) {
  if (value.length > 20) {
    return value.slice(0, 20) + " ...";
  } else {
    return value;
  }
};
