const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev/';
const username = 'coalition';
const password = 'skills-test';

async function fetchPatientData() {
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(`${username}:${password}`));

    try {
        const response = await fetch(apiUrl, { method: 'GET', headers: headers });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const jessicaTaylor = data.find(patient => patient.name === 'Jessica Taylor');
        populateDashboard(jessicaTaylor);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function populateDashboard(patient) {
    // Populate profile section
    document.querySelector('.patient-profile h2').textContent = patient.name;
    document.querySelector('.patient-profile img').src = patient.profile_picture;
    document.getElementById('dob').textContent = formatDate(patient.date_of_birth);
    document.getElementById('gender').textContent = patient.gender;
    document.getElementById('contact-info').textContent = patient.phone_number;
    document.getElementById('emergency-contacts').textContent = patient.emergency_contact;
    document.getElementById('insurance').textContent = patient.insurance_type;

    // Populate diagnosis history section
    const bloodPressureData = patient.diagnosis_history.map(d => ({
        date: `${d.month} ${d.year}`,
        systolic: d.blood_pressure.systolic.value,
        diastolic: d.blood_pressure.diastolic.value,
    }));
    createBloodPressureChart(bloodPressureData);

    // Update blood pressure info
    const latestBP = patient.diagnosis_history[0].blood_pressure;
    document.getElementById('systolic').textContent = latestBP.systolic.value;
    document.getElementById('diastolic').textContent = latestBP.diastolic.value;
    document.querySelector('#systolic + span').textContent = latestBP.systolic.levels;
    document.querySelector('#diastolic + span').textContent = latestBP.diastolic.levels;

    // Populate vital signs
    const latestDiagnosis = patient.diagnosis_history[0];
    document.getElementById('respiratory-rate').textContent = `${latestDiagnosis.respiratory_rate.value} bpm`;
    document.getElementById('temperature').textContent = `${latestDiagnosis.temperature.value}°F`;
    document.getElementById('heart-rate').textContent = `${latestDiagnosis.heart_rate.value} bpm`;
    document.querySelector('#respiratory-rate + span').textContent = latestDiagnosis.respiratory_rate.levels;
    document.querySelector('#temperature + span').textContent = latestDiagnosis.temperature.levels;
    document.querySelector('#heart-rate + span').textContent = latestDiagnosis.heart_rate.levels;

    // Populate diagnostic list
    populateDiagnosticList(patient.diagnostic_list);

    // Populate lab results
    populateLabResults(patient.lab_results);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function createBloodPressureChart(data) {
    const ctx = document.getElementById('bloodPressureChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'Systolic',
                    data: data.map(d => d.systolic),
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
                {
                    label: 'Diastolic',
                    data: data.map(d => d.diastolic),
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Blood Pressure (mmHg)',
                    },
                },
            },
        },
    });
}

function populateDiagnosticList(diagnosticList) {
    const diagnosticTable = document.getElementById('diagnostic-table').getElementsByTagName('tbody')[0];
    diagnosticTable.innerHTML = ''; 
    diagnosticList.forEach(diagnosis => {
        const row = diagnosticTable.insertRow();
        row.insertCell(0).textContent = diagnosis.name;
        row.insertCell(1).textContent = diagnosis.description;
        row.insertCell(2).textContent = diagnosis.status;
    });
}

function populateLabResults(labResults) {
    const labResultsList = document.getElementById('lab-results-list');
    labResultsList.innerHTML = ''; 
    labResults.forEach(result => {
        const li = document.createElement('li');        

        const span = document.createElement('span');
        span.textContent = result;        
        const svgWrapper = document.createElement('div');
        svgWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <path id="download_FILL0_wght300_GRAD0_opsz24_1_" data-name="download_FILL0_wght300_GRAD0_opsz24 (1)" d="M190-765.45a1.282,1.282,0,0,1-.449-.077,1.106,1.106,0,0,1-.395-.264l-4.146-4.146a.94.94,0,0,1-.294-.7,1.025,1.025,0,0,1,.294-.709,1.019,1.019,0,0,1,.713-.321.944.944,0,0,1,.713.3L189-768.8V-779a.968.968,0,0,1,.287-.713A.968.968,0,0,1,190-780a.968.968,0,0,1,.713.287A.968.968,0,0,1,191-779v10.2l2.564-2.564a.952.952,0,0,1,.706-.294,1,1,0,0,1,.719.314,1.044,1.044,0,0,1,.3.7.932.932,0,0,1-.3.7l-4.146,4.146a1.1,1.1,0,0,1-.395.264A1.282,1.282,0,0,1,190-765.45ZM182.411-760a2.327,2.327,0,0,1-1.71-.7,2.327,2.327,0,0,1-.7-1.71v-2.615a.968.968,0,0,1,.287-.713.968.968,0,0,1,.713-.287.968.968,0,0,1,.713.287.968.968,0,0,1,.287.713v2.615a.392.392,0,0,0,.128.282.392.392,0,0,0,.282.128h15.179a.392.392,0,0,0,.282-.128.392.392,0,0,0,.128-.282v-2.615a.968.968,0,0,1,.287-.713.968.968,0,0,1,.713-.287.968.968,0,0,1,.713.287.968.968,0,0,1,.287.713v2.615a2.327,2.327,0,0,1-.7,1.71,2.327,2.327,0,0,1-1.71.7Z" transform="translate(-180.001 779.999)"/>
        </svg>`;        
        // Append the text and SVG to the list item
        li.appendChild(span);
        li.appendChild(svgWrapper);
        
        labResultsList.appendChild(li);
    });
}


fetchPatientData();