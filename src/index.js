document.addEventListener("DOMContentLoaded", () => {
  const diagnosisInput = document.getElementById("disease");
  const suggestionsContainer = document.getElementById("suggestions");
  const suggestionsSpan = document.getElementById("numberOfSuggestions");

  let diagnoses; // Declarar la variable diagnoses

  

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
    console.log(patientData, "Datos del paciente");
    filterDiagnoses(patientData);
    diagnosisInput.addEventListener("input", async  function () {
      const userInput = this.value.toLowerCase();
      const filteredDiagnoses = await filterDiagnoses(patientData);

  const matchingDiagnoses = filteredDiagnoses.filter((diagnosis) =>
    diagnosis.nombre.toLowerCase().includes(userInput),
  );
      displaySuggestions(matchingDiagnoses);
    });
  
    function displaySuggestions(suggestions) {
      suggestionsContainer.innerHTML = "";
      suggestionsSpan.innerHTML = "";
      if (suggestions.length > 0) {
        suggestions.forEach((suggestion) => {
          const suggestionElement = document.createElement("div");
          const numberOfSuggestions = document.getElementById("numberOfSuggestions");
          numberOfSuggestions.textContent = `${suggestions.length} sugerencias`;
          suggestionElement.classList.add("suggestion-item");
          suggestionElement.textContent = suggestion.nombre;
          suggestionElement.addEventListener("click", function () {
            numberOfSuggestions.textContent = `${suggestions.length} sugerencias`;
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
        suggestionsSpan.textContent = "";
      } 
    });
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

  //funcion para filtrar los diagnosticos
// Constantes para las nomenclaturas
const GENDER_MUJER = "MUJER";
const GENDER_HOMBRE = "HOMBRE";
const GENDER_NO = "NO";

// Función para filtrar diagnósticos por género
function filterDiagnosesByGender(patientData) {
    const gender = patientData.gender;
    if (gender === GENDER_MUJER || gender === GENDER_HOMBRE) {
        return diagnoses.filter(diagnosis => diagnosis.lsex === gender);
    } else {
        return diagnoses.filter(diagnosis => diagnosis.lsex === GENDER_NO);
    }
}


// Función para filtrar diagnósticos por edad y linf/lsup
function filterDiagnosesByAgeRange(patientData) {
    const age = calculateAge(patientData.dateOfBirth);
    const ageUnit = age.slice(-1);

    let nomenclature;
    if (age === "NO") {
        nomenclature = "NO";
    } else if (ageUnit === "H" || ageUnit === "D" || ageUnit === "M" || ageUnit === "A") {
        nomenclature = ageUnit;
    } 
    console.log(diagnoses, "Diagnositos")
    console.log(diagnoses.filter(diagnosis => diagnosis.linf.slice(-1) === nomenclature || diagnosis.lsup.slice(-1) === nomenclature))
    return diagnoses.filter(diagnosis => diagnosis.linf.slice(-1) === nomenclature || diagnosis.lsup.slice(-1) === nomenclature);
}

// Función principal de filtrado de diagnósticos
function filterDiagnoses(patientData) {
  const age = calculateAge(patientData.dateOfBirth);
  const gender = patientData.gender;

  // Verificar si el input de fecha de nacimiento es sin asignar
  if (age === "NO" && gender === GENDER_NO) {
      console.log(diagnoses, "NO");
      return diagnoses;
  } else if (age === "NO" && gender === GENDER_MUJER) {
      console.log(
        filterDiagnosesByGender(patientData),
          "Mujer"
      );
      return filterDiagnosesByGender(patientData);
  } else if (age === "NO" && gender === GENDER_HOMBRE) {
      console.log(
        filterDiagnosesByGender(patientData),
          "Hombre"
      );
      return filterDiagnosesByGender(patientData);
  } else if (age !== "NO" && gender === GENDER_NO) {
      // Verificar si age coincide con linf o lsup
      console.log(
        filterDiagnosesByAgeRange(patientData),
          "Edad nomenclatura"
      );
      const matchingDiagnoses = filterDiagnosesByAgeRange(patientData);

      console.log(matchingDiagnoses, "Diagnositos con linf/lsup en H");
      return matchingDiagnoses;
  } else if (age !== "NO" && gender === GENDER_MUJER) {
      // Filtrar por género y edad
      const genderFiltered = filterDiagnosesByGender(patientData);
      const ageFiltered = filterDiagnosesByAgeRange(patientData);
      console.log(genderFiltered.filter(diagnosis => ageFiltered.includes(diagnosis)), "filtro por mujer y edad")
      return genderFiltered.filter(diagnosis => ageFiltered.includes(diagnosis));
  } else if (age !== "NO" && gender === GENDER_HOMBRE){
      // Filtrar por género y edad
      const genderFiltered = filterDiagnosesByGender(patientData);
      const ageFiltered = filterDiagnosesByAgeRange(patientData);
      console.log(genderFiltered.filter(diagnosis => ageFiltered.includes(diagnosis)), "filtro por hombre y edad")
      return genderFiltered.filter(diagnosis => ageFiltered.includes(diagnosis));
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
