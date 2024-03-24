document.addEventListener("DOMContentLoaded", () => {
  const diagnosisInput = document.getElementById("disease");
  const suggestionsContainer = document.getElementById("suggestions");

  let diagnoses; // Declarar la variable diagnoses

  diagnosisInput.addEventListener("input",  function () {
    const userInput = this.value.toLowerCase();
    const matchingDiagnoses = diagnoses.filter((diagnosis) =>
      diagnosis.nombre.toLowerCase().includes(userInput),
    );
    displaySuggestions(matchingDiagnoses);
  });

  function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    if (suggestions.length > 0) {
      suggestions.forEach((suggestion) => {
        const suggestionElement = document.createElement("div");
        suggestionElement.classList.add("suggestion-item");
        suggestionElement.textContent = suggestion.nombre;
        suggestionElement.addEventListener("click", function () {
          diagnosisInput.value = suggestion.nombre;
          suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(suggestionElement);
      });
      suggestionsContainer.style.display = "block";
    } else {
      suggestionsContainer.style.display = "none";
    }
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest("#suggestions")) {
      suggestionsContainer.style.display = "none";
    }
  });

  const form = document.getElementById("patientForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Capturar los datos del paciente del formulario
    const patientData = {
      fullName: document.getElementById("fullName").value,
      dateOfBirth: document.getElementById("dateOfBirth").value,
      gender: document.getElementById("gender").value,
      motive: document.getElementById("motive").value,
      temperature: document.getElementById("temperature").value,
      height: document.getElementById("height").value,
      weight: document.getElementById("weight").value,
      oxygen_sat: document.getElementById("oxygen_sat").value,
    };

    filterDiagnoses(patientData);
  });

  //funcion para calcular la edad y nombrarla en horas, dias, meses y años
  function calculateAge(dateOfBirth) {
    if (dateOfBirth === "") {
      return "NO";
    } else {
      const currentDate = new Date();
      const birthDate = new Date(dateOfBirth);
      const ageInMilliseconds = currentDate - birthDate;
      const ageInHours = ageInMilliseconds / (1000 * 60 * 60);
      const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);
      const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // Aproximadamente 30.44 días en un mes
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Aproximadamente 365.25 días en un año para tener en cuenta años bisiestos

      if (ageInHours < 24) {
        // Si la edad es menor a un día, calcular la edad en horas
        const age = Math.floor(ageInHours);
        const nomenclature = String(age).padStart(3, "0") + "H";
        console.log(nomenclature);
        return nomenclature;
      } else if (ageInDays < 30) {
        // Si la edad es menor a un mes, calcular la edad en días
        const age = Math.floor(ageInDays);
        const nomenclature = String(age).padStart(3, "0") + "D";
        console.log(nomenclature);
        return nomenclature;
      } else if (ageInYears < 1) {
        // Si la edad es menor a un año, calcular la edad en meses
        const age = Math.floor(ageInMonths);
        const nomenclature = String(age).padStart(3, "0") + "M";
        console.log(nomenclature);
        return nomenclature;
      } else if (ageInYears >= 1) {
        // Si la edad es mayor o igual a un año, calcular la edad en años
        const age = Math.floor(ageInYears);
        const nomenclature = String(age).padStart(3, "0") + "A";
        console.log(nomenclature);
        return nomenclature;
      }
    }
  }

  function filterDiagnoses(patientData) {
    const age = calculateAge(patientData.dateOfBirth);
    const gender = patientData.gender;
    // verificar si el input de fecha de nacimiento es sin asignar sería un "NO"
    if (age === "NO" && gender === "NO") {
      console.log(diagnoses, "NO");
      return diagnoses;
    } else if (age === "NO" && gender === "MUJER") {
      console.log(
        diagnoses.filter((diagnosis) => diagnosis.lsex === "MUJER"),
        "Mujer",
      );
      return diagnoses.filter((diagnosis) => diagnosis.lsex === "MUJER");
    } else if (age === "NO" && gender === "HOMBRE") {
      console.log(
        diagnoses.filter((diagnosis) => diagnosis.lsex === "HOMBRE"),
        "Hombre",
      );
      return diagnoses.filter((diagnosis) => diagnosis.lsex === "HOMBRE");
    } else if (age !== "NO" && gender === "NO") {
      
      if (
        age.slice(-1) === "H" &&
        diagnoses.filter((diagnosis) => diagnosis.linf === "H")
      ) {
        console.log(
          diagnoses.filter((diagnosis) => diagnosis.linf.slice(-1) === "H"),
          "Diagnositos con linf en H",
        );
        return diagnoses.filter((diagnosis) => diagnosis.linf === "H");
      }

      console.log(
        diagnoses.filter((diagnosis) => diagnosis.lsex === "NO"),
        "lsex no asignado",
      );
    }
  }

  function fetchApi() {
    fetch("https://api.editandoideas.com/technical-test/cat__cie_sis/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud de la API");
        }
        return response.json();
      })
      .then((data) => {
        diagnoses = data;
      })
      .catch((error) => console.error(error));
  }

  fetchApi();
});
