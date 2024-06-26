document.addEventListener("DOMContentLoaded", () => {
  const diagnosisInput = document.getElementById("disease");
  const suggestionsContainer = document.getElementById("suggestions");
  const suggestionsSpan = document.getElementById("numberOfSuggestions");
  const summaryContainer = document.getElementById("summaryContainer");
  const containerDiagnoses = document.getElementById("containerDiagnoses");
  const articlePatientData = document.getElementById("patientArticle");

  let diagnoses;

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
    diagnosisInput.addEventListener("input", async function () {
      const userInput = this.value.toLowerCase();
      const filteredDiagnoses = await filterDiagnoses(patientData);

      const matchingDiagnoses = filteredDiagnoses.filter(
        (diagnosis) =>
          diagnosis.nombre.toLowerCase().includes(userInput) ||
          diagnosis.catalog_key.toLowerCase().includes(userInput),
      );
      displaySuggestions(matchingDiagnoses);
    });
    displayPatientSummary(patientData);

    function displayPatientSummary(patientData) {
      summaryContainer.innerHTML = `
      <h2>Resumen del paciente</h2>
      <div>
      <p>Nombre completo: ${patientData.fullName}</p>
      <p>Fecha de nacimiento: ${patientData.dateOfBirth}</p>
      <p>Género: ${patientData.gender}</p>
      <p>Motivo: ${patientData.motive}</p>
      <p>Temperatura: ${patientData.temperature}</p>
      <p>Altura: ${patientData.height}</p>
      <p>Peso: ${patientData.weight}</p>
      <p>Saturación de oxígeno: ${patientData.oxygen_sat}</p>
      <button id="resetButton">Reiniciar</button>
      </div>
    `;

      // Ocultar el formulario y mostrar el resumen
      articlePatientData.style.display = "none";
      summaryContainer.style.display = "flex";
      containerDiagnoses.style.display = "block";
      document.getElementById("resetButton").addEventListener("click", () => {
        // Borrar el resumen
        summaryContainer.innerHTML = "";

        // Mostrar el formulario
        articlePatientData.style.display = "block";
        containerDiagnoses.style.display = "none";

        // Resetear el formulario
        form.reset();
      });
    }

    function displaySuggestions(suggestions) {
      suggestionsContainer.innerHTML = "";
      suggestionsSpan.innerHTML = "";
      if (suggestions.length > 0) {
        suggestions.forEach((suggestion) => {
          const suggestionElement = document.createElement("div");
          const numberOfSuggestions = document.getElementById(
            "numberOfSuggestions",
          );
          numberOfSuggestions.textContent = `${suggestions.length} sugerencias`;
          suggestionElement.classList.add("suggestion-item");
          suggestionElement.textContent =
            suggestion.catalog_key + "-" + suggestion.nombre;
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
        const age = Math.floor(ageInHours);
        const nomenclature = String(age).padStart(3, "0") + "H";
        return nomenclature;
      } else if (ageInDays < 30) {
        const age = Math.floor(ageInDays);
        const nomenclature = String(age).padStart(3, "0") + "D";
        return nomenclature;
      } else if (ageInYears < 1) {
        const age = Math.floor(ageInMonths);
        const nomenclature = String(age).padStart(3, "0") + "M";
        return nomenclature;
      } else if (ageInYears >= 1) {
        const age = Math.floor(ageInYears);
        const nomenclature = String(age).padStart(3, "0") + "A";
        return nomenclature;
      }
    }
  }

  const GENDER_MUJER = "MUJER";
  const GENDER_HOMBRE = "HOMBRE";
  const GENDER_NO = "NO";

  // Función para filtrar diagnósticos por género
  function filterDiagnosesByGender(patientData) {
    const gender = patientData.gender;
    if (gender === GENDER_MUJER || gender === GENDER_HOMBRE) {
      return diagnoses.filter((diagnosis) => diagnosis.lsex === gender);
    } else {
      return diagnoses.filter((diagnosis) => diagnosis.lsex === GENDER_NO);
    }
  }

  // Función para filtrar diagnósticos por edad y linf/lsup
  function filterDiagnosesByAgeRange(patientData) {
    const age = calculateAge(patientData.dateOfBirth);
    const ageUnit = age.slice(-1);

    let nomenclature;
    if (age === "NO") {
      nomenclature = "NO";
    } else if (
      ageUnit === "H" ||
      ageUnit === "D" ||
      ageUnit === "M" ||
      ageUnit === "A"
    ) {
      nomenclature = ageUnit;
    }

    return diagnoses.filter(
      (diagnosis) =>
        diagnosis.linf.slice(-1) === nomenclature ||
        diagnosis.lsup.slice(-1) === nomenclature,
    );
  }

  // Función principal de filtrado de diagnósticos
  function filterDiagnoses(patientData) {
    const age = calculateAge(patientData.dateOfBirth);
    const gender = patientData.gender;

    // Verificar si el input de fecha de nacimiento es sin asignar
    if (age === "NO" && gender === GENDER_NO) {
      return diagnoses;
    } else if (age === "NO" && gender === GENDER_MUJER) {
      return filterDiagnosesByGender(patientData);
    } else if (age === "NO" && gender === GENDER_HOMBRE) {
      return filterDiagnosesByGender(patientData);
    } else if (age !== "NO" && gender === GENDER_NO) {
      // Verificar si age coincide con linf o lsup
      const matchingDiagnoses = filterDiagnosesByAgeRange(patientData);
      return matchingDiagnoses;
    } else if (age !== "NO" && gender === GENDER_MUJER) {
      // Filtrar por género y edad
      const genderFiltered = filterDiagnosesByGender(patientData);
      const ageFiltered = filterDiagnosesByAgeRange(patientData);
      return genderFiltered.filter((diagnosis) =>
        ageFiltered.includes(diagnosis),
      );
    } else if (age !== "NO" && gender === GENDER_HOMBRE) {
      // Filtrar por género y edad
      const genderFiltered = filterDiagnosesByGender(patientData);
      const ageFiltered = filterDiagnosesByAgeRange(patientData);
      return genderFiltered.filter((diagnosis) =>
        ageFiltered.includes(diagnosis),
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
