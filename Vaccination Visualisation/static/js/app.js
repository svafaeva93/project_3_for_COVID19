// Define the URL for the JSON file
const url = 'http://127.0.0.1:5000/vaccinated_people_province';
const url2='http://127.0.0.1:5000/vaccines'

// Calling the functions
vaccinations();
vaccines();
fetchVaccinatedData();

function vaccinations() {
  d3.json(url)
    .then(data => {
      console.log(data);
      // Declare arrays for province and vaccinations
      var provinces = [];
      var vaccinations = [];
      // Iterate over the array of documents
      data.forEach(document => {
        var vaccination = document["cumm_vaccinated_people"]; // Fix variable name here
        var province = document["_id"];
        console.log("Vaccinated People:", vaccination);
        console.log("Province:", province);
        // Push values to respective arrays
        provinces.push(province);
        vaccinations.push(vaccination);
      });
      // Update the trace object
      const updatedTrace = {
        y: provinces.reverse(),
        x: vaccinations.reverse(),
        type: 'bar',
        orientation: 'h',
        width: 0.8,
        marker: {
          color: 'rgba(0, 128, 0, 0.8)'
        }
      };
      // Update the data array
      const updatedData = [updatedTrace];
      // Update the layout object
// Update the layout object
const updatedLayout = {
  title: 'Vaccinated People by Province',
  xaxis: {
    title: 'Vaccinated People',
    automargin: true,
    title_standoff: 50
  },
  yaxis: {
    title: 'Province',
    automargin: true,
    title_standoff: 50
  },
  width: 700, // Adjust the width of the hbar chart here
  height: 500 // Adjust the height of the hbar chart here
};
// Update the chart
Plotly.newPlot('plot', updatedData, updatedLayout);

    })
    .catch(error => {
      console.log('Error loading data:', error);
    });
}
// Declare global variables for provinces, vaccines, and dates
var provinces = [];
var vaccines = [];
var dates = [];

function vaccines() {
  d3.json(url2)
    .then(data => {
      console.log(data);

      // Iterate over the array of documents
      data.forEach(document => {
        var vaccination = document["Cumulative number of people (Vaccinedose1)"];
        var province = document["Province"];
        var date = new Date(document["Date"]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        console.log("Vaccinated", vaccination);
        console.log("Date:", date);
        console.log("Province:", province);

        // Push values to respective arrays
        provinces.push(province);
        vaccines.push(vaccination);
        dates.push(date);
      });

      // Create the province dropdown menu
      var provinceDropdown = d3.select("#provinceDropdown");
      var uniqueProvinces = Array.from(new Set(provinces)); // Get unique provinces
      uniqueProvinces.forEach(province => {
        provinceDropdown.append("option").text(province);
      });
    })
    .catch(error => {
      console.log('Error loading data:', error);
    });
}

// Update the vaccine numbers for unique provinces in the "Demographic Info" element
// Update the vaccine numbers and dates for the selected province in the "Demographic Info" element
function updateVaccineNumbers(selectedProvince) {
  var filteredData = vaccines.reduce((acc, vaccine, index) => {
    if (provinces[index] === selectedProvince) {
      acc.push({ date: dates[index], vaccine: vaccine });
    }
    return acc;
  }, []);

  filteredData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort data by date

  var demographicInfo = d3.select("#sample-metadata");
  demographicInfo.html(""); // Clear previous content

  demographicInfo.append("h5").text("Vaccine Numbers in " + selectedProvince + ":");
  filteredData.forEach(data => {
    var formattedVaccine = data.vaccine.toLocaleString(); // Format the vaccinated number with commas or periods
    demographicInfo.append("p").text(data.date + ": " + formattedVaccine);
  });
}

// Event listener for province dropdown change
d3.select("#provinceDropdown").on("change", function () {
  var selectedProvince = d3.select(this).property("value");
  updateVaccineNumbers(selectedProvince);
});

// Declare global variables for vaccinatedData
var vaccinatedProvinces = [];
var vaccinatedNumbers = [];
var vaccinatedDates = [];

function fetchVaccinatedData() {
  d3.json(url2)
    .then(data => {
      console.log(data);

      // Clear previous content
      d3.select("#plot3").html("");

      // Iterate over the array of documents
      data.forEach(document => {
        var vaccinatedNumber = document["Cumulative number of people (Vaccinedose1)"];
        var vaccinatedProvince = document["Province"];
        var vaccinatedDate = new Date(document["Date"]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        console.log("Vaccinated Number:", vaccinatedNumber);
        console.log("Date:", vaccinatedDate);
        console.log("Province:", vaccinatedProvince);

        // Push values to respective arrays
        vaccinatedProvinces.push(vaccinatedProvince);
        vaccinatedNumbers.push(vaccinatedNumber);
        vaccinatedDates.push(vaccinatedDate);
      });

      // Sort data by date
      var sortedData = vaccinatedDates.map((date, index) => ({ date: new Date(date), number: vaccinatedNumbers[index] }));
      sortedData.sort((a, b) => a.date - b.date);

      // Extract sorted dates and vaccinated numbers
      var sortedDates = sortedData.map(entry => entry.date);
      var sortedVaccinatedNumbers = sortedData.map(entry => entry.number);

      // Create the bar trace
      var trace = {
        x: sortedDates,
        y: sortedVaccinatedNumbers,
        type: 'bar',
        marker: {
          color: 'rgba(0, 128, 0, 0.8)'
        }
      };

      // Create the data array
      var data = [trace];

// Create the layout
var layout = {
  title: 'Vaccinated People Over Time',
  xaxis: {
    title: 'Date',
    tickformat: '%b %d, %Y' // Format the date tick labels
  },
  yaxis: {
    title: 'Vaccinated People',
    tickformat: ',.0f' // Format the y-axis tick labels with commas as thousands separators
  },
  width: 600, // Set the desired width in pixels
  height: 600 // Set the desired height in pixels
};

// Plot the chart
Plotly.newPlot('plot3', data, layout);
})
.catch(error => {
  console.log('Error loading data:', error);
});
}