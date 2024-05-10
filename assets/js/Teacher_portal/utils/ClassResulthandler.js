export default class ClassResultHandler {
  constructor(data) {
    this.students = data;
    this.calculateFields();
  }

  calculateFields() {
    this.students.forEach((student) => {
      student.Total = this.calculateTotal(student);
      student.Ave = this.calculateAverage(student);
      student.Grade = this.calculateGrade(student);
      student.Position = "-";
      student.Remarks = "-";
    });

    // Calculate position based on Total
    this.calculatePosition();

    // Calculate remarks based on Grade
    this.calculateRemarks();
  }

  // this has to be Calulated dynamically
  calculateTotal(student) {
    const keys = Object.keys(student);
    const startIndex = keys.indexOf("Name") + 1;
    const endIndex = keys.indexOf("published");
    const relevantKeys = keys.slice(startIndex, endIndex);
    return relevantKeys.reduce(
      (sum, key) =>
        sum +
        (isNaN(student[key]["Total"]) ? 0 : parseInt(student[key]["Total"])),
      0
    );
  }

  // this has to be Calulated dynamically
  calculateAverage(student) {
    const keys = Object.keys(student);
    const startIndex = keys.indexOf("Name") + 1;
    const endIndex = keys.indexOf("published");
    const relevantKeys = keys.slice(startIndex, endIndex);
    const greaterThanOrEqualToOneCount = relevantKeys.filter(
      (key) =>
        parseInt(student[key]["Total"]) >= 0 && student[key]["Total"] !== "-"
    ).length;
    // Check if greaterThanOrEqualToOneCount is not zero before performing the division
    const average =
      greaterThanOrEqualToOneCount !== 0
        ? parseFloat((student.Total / greaterThanOrEqualToOneCount).toFixed(2))
        : 0;

    return average;
  }

  calculateGrade(student) {
    if (student.Ave >= 70) return "A";
    else if (student.Ave >= 55) return "C";
    else if (student.Ave >= 40) return "P";
    else return "F";
  }

  calculatePosition() {
    this.students.sort((a, b) => b.Ave - a.Ave);

    // Function to calculate ordinal suffix
    const getOrdinalSuffix = (number) => {
      if (number === 11 || number === 12 || number === 13) {
        return "th";
      } else {
        const lastDigit = number % 10;
        switch (lastDigit) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      }
    };

    let previousAve = null;
    let previousPosition = null;

    this.students.forEach((student, index) => {
      const currentTotal = student.Ave;
      const suffix = getOrdinalSuffix(index + 1);

      if (currentTotal === previousAve) {
        // Assign the same position as the previous student
        student.Position = previousPosition;
      } else {
        // Assign a new position
        student.Position = `${index + 1}${suffix}`;
      }

      // Update previous total and position
      previousAve = currentTotal;
      previousPosition = student.Position;
    });
  }

  calculateRemarks() {
    this.students.forEach((student) => {
      if (student.Grade === "-") student.Remarks = "-";
      else if (student.Grade === "A") student.Remarks = "Excellent";
      else if (student.Grade === "C") student.Remarks = "Good";
      else if (student.Grade === "P") student.Remarks = "Pass";
      else student.Remarks = "Fail";
    });
  }

  getStudents() {
    return this.students;
  }
}
