export default class StudentDataHandler {
  constructor(data) {
    this.students = data;
    this.calculateFields();
  }

  calculateFields() {
    this.students.forEach((student) => {
      student.CA = this.calculateCA(student);
      student.Total = this.calculateTotal(student);
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
  calculateCA(student) {
    const keys = Object.keys(student);
    const startIndex = keys.indexOf("Name") + 1;
    const endIndex = keys.indexOf("Exam");
    const relevantKeys = keys.slice(startIndex, endIndex);
    return relevantKeys.reduce(
      (sum, key) =>
        sum +
        (isNaN(student[key]) || student[key] === ""
          ? 0
          : parseInt(student[key])),
      0
    );
  }

  calculateTotal(student) {
    if (student["Exam"] === "-" || student["Exam"] === "") {
      return "-";
    } else {
      return Object.keys(student)
        .filter((key) => key.startsWith("CA") || key.startsWith("Exam"))
        .reduce(
          (sum, key) =>
            sum + (isNaN(student[key]) ? 0 : parseInt(student[key])),
          0
        );
    }
  }

  calculateGrade(student) {
    const Total = this.calculateTotal(student);
    if (Total === "-") {
      return "-";
    } else {
      if (Total >= 70) return "A";
      else if (Total >= 55) return "C";
      else if (Total >= 40) return "P";
      else return "F";
    }
  }

  calculatePosition() {
    this.students.sort((a, b) => {
      if (a.Total === "-" && b.Total === "-") {
        return 0;
      } else if (b.Total === "-") {
        return -1;
      } else {
        return b.Total - a.Total;
      }
    });

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

    let previousTotal = null;
    let previousPosition = null;

    this.students.forEach((student, index) => {
      const currentTotal = student.Total;
      const suffix = getOrdinalSuffix(index + 1);

      if (currentTotal === "-") {
        student.Position = "-";
      } else if (currentTotal === previousTotal) {
        // Assign the same position as the previous student
        student.Position = previousPosition;
      } else {
        // Assign a new position
        student.Position = `${index + 1}${suffix}`;
      }

      // Update previous total and position
      previousTotal = currentTotal;
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

// Class Result Handler //////////////////////////////////////////////////////////////////////////////////
