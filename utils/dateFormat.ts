export const DateFormat = (date: Date) => {
  let tempDate;
  if (date instanceof Date) {
    tempDate = date;
  } else if (typeof tempDate === "string") {
    tempDate = new Date(date);
  } else {
    return "";
  }

  return tempDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
