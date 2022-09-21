export function dateFormatter(date) {
  var months = [
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
  date = new Date(date)
  var day = date.getDate();
  var month = date.getMonth();
  month = months[month];
  var year = date.getFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  return month + " " + day + ", " + year;
}
