
document.addEventListener("DOMContentLoaded", () => {
    const diagnosisInput = document.getElementById("disease");
    const suggestionsContainer = document.getElementById("suggestions");
    fetchApi();
  
    let diagnoses = [];
  
    diagnosisInput.addEventListener("input", function () {
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
  
      console.log(patientData);
      calculateAge(patientData.dateOfBirth);
  
      // Filtrar los diagnósticos basados en los criterios
      filterDiagnoses(patientData);
    });
  
    function fetchApi() {
      fetch("https://api.editandoideas.com/technical-test/cat__cie_sis/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud de la API");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          diagnoses = data;
          return data;
        })
        .catch((error) => console.error(error));
    }
  
    //funcion para calcular la edad y nombrarla en horas, dias, meses y años
    function calculateAge(dateOfBirth) {
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
          const nomenclature = String(age).padStart(3, '0') + 'H';
          console.log('Nomenclatura:', nomenclature);
          return nomenclature;
      } else if (ageInDays < 30) {
          // Si la edad es menor a un mes, calcular la edad en días
          const age = Math.floor(ageInDays);
          const nomenclature = String(age).padStart(3, '0') + 'D';
          console.log('Edad:', nomenclature);
          return nomenclature;
      } else if (ageInYears < 1) {
          // Si la edad es menor a un año, calcular la edad en meses
          const age = Math.floor(ageInMonths);
          const nomenclature = String(age).padStart(3, '0') + 'M';
          console.log('Edad:', nomenclature);
          return nomenclature;
      } else {
          // Si la edad es mayor o igual a un año, calcular la edad en años
          const age = Math.floor(ageInYears);
          const nomenclature = String(age).padStart(3, '0') + 'A';
          console.log('Edad:', nomenclature);
          return nomenclature;
      }

  }

  
    // Función para filtrar los diagnósticos segun los criterios de edad y sexo
    function filterDiagnoses(diagnoses, linf, lsup, lsex,birthDate, nomenclature) {
      console.log(diagnoses, linf, lsup, lsex, birthDate, nomenclature);
      // Verificar si todos los criterios son "NO"
      if (linf === "NO" && lsup === "NO" && lsex === "NO") {
        // No se aplica ningún filtro, todos los diagnósticos están en la lista de resultados
        return diagnoses;
      }
  
      // Aplicar filtro de edad
      let filteredDiagnoses = diagnoses.filter((diagnosis) => {
        if (linf !== "NO") {
          if (nomenclature >= linf) {
            console.log(diagnosis.linf.String.padStart(nomenclature, '0'), 'Diagnosticos con linf');
              return diagnosis.linf.String.padStart(nomenclature, '0');
          }
      }
  
      if (lsup !== "NO") {
        if (nomenclature <= lsup) {
            return true;
        }
    }
        // Si no hay criterios de edad, el diagnóstico pasa el filtro
        return true;
      });
  
      // Aplicar filtro de sexo
      if (lsex !== "NO") {
        filteredDiagnoses = filteredDiagnoses.filter((diagnosis) => {
          return diagnosis.sex.toUpperCase() === lsex.toUpperCase();
        });
      }
  
      return filteredDiagnoses;
    }
  });