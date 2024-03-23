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
  
    //funcion para calcular la edad
    function calculateAge(dateOfBirth) {
      const currentDate = new Date();
      const birthDate = new Date(dateOfBirth);
      console.log(birthDate, 'Aqui esta la fecha de nacimiento');
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const month = currentDate.getMonth() - birthDate.getMonth();
      if (
        month < 0 ||
        (month === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      console.log(age);
      return age;
    }
  
    function convertToYears(value, unit) {
      if (unit === "H") {
        return value / 8760; // 1 año tiene aproximadamente 8760 horas
      } else if (unit === "D") {
        return value / 365; // 1 año tiene aproximadamente 365 días
      } else if (unit === "M") {
        return value / 12; // 1 año tiene aproximadamente 12 meses
      } else {
        return value; // La edad ya está en años
      }
    }
  
    // Función para verificar si la edad es superior al límite
    function isAgeAboveLimit(age, limit) {
      const ageInYears = parseInt(age.substring(0, age.length - 1)); // Extraer el valor numérico de la edad
      const ageUnit = age.charAt(age.length - 1); // Obtener la unidad de la edad (H, D, M, A)
  
      const limitInYears = parseInt(limit.substring(0, limit.length - 1)); // Extraer el valor numérico del límite
      const limitUnit = limit.charAt(limit.length - 1); // Obtener la unidad del límite (H, D, M, A)
  
      // Convertir la edad y el límite a años si no están en años
      const ageInYearsConverted = convertToYears(ageInYears, ageUnit);
      const limitInYearsConverted = convertToYears(limitInYears, limitUnit);
  
      // Verificar si la edad es mayor o igual al límite
      return ageInYearsConverted >= limitInYearsConverted;
    }
  
    // Función para verificar si la edad es inferior al límite
    function isAgeBelowLimit(age, limit) {
      const ageInYears = parseInt(age.substring(0, age.length - 1)); // Extraer el valor numérico de la edad
      const ageUnit = age.charAt(age.length - 1); // Obtener la unidad de la edad (H, D, M, A)
  
      const limitInYears = parseInt(limit.substring(0, limit.length - 1)); // Extraer el valor numérico del límite
      const limitUnit = limit.charAt(limit.length - 1); // Obtener la unidad del límite (H, D, M, A)
  
      // Convertir la edad y el límite a años si no están en años
      const ageInYearsConverted = convertToYears(ageInYears, ageUnit);
      const limitInYearsConverted = convertToYears(limitInYears, limitUnit);
  
      // Verificar si la edad es menor o igual al límite
      return ageInYearsConverted <= limitInYearsConverted;
    }
  
    //funcion para salcular limites de edad usando nomenclatura horas de nacido, dias de nacido, meses de nacido, años de nacido
  
    // Función para filtrar los diagnósticos
    function filterDiagnoses(data, linf, lsup, lsex) {
      // Verificar si todos los criterios son "NO"
      if (linf === "NO" && lsup === "NO" && lsex === "NO") {
        // No se aplica ningún filtro, todos los diagnósticos están en la lista de resultados
        return data;
      }
  
      // Aplicar filtro de edad
      let filteredDiagnoses = data.filter((diagnosis) => {
        if (linf !== "NO") {
          const ageCriteriaMet = isAgeAboveLimit(diagnosis.age, linf);
          if (!ageCriteriaMet) return false;
        }
  
        if (lsup !== "NO") {
          const ageCriteriaMet = isAgeBelowLimit(diagnosis.age, lsup);
          if (!ageCriteriaMet) return false;
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