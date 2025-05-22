document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const circuitTypeSelect = document.getElementById('circuit-type');
    const netlistTextarea = document.getElementById('netlist');
    const signalTypeSelect = document.getElementById('signal-type');
    const signalParamsInput = document.getElementById('signal-params');

    const resultsContentDiv = document.getElementById('results-content');
    const identifiedTypeDiv = document.getElementById('identified-type');
    const estimatedParamsDiv = document.getElementById('estimated-params');
    const analysisPlotsDiv = document.getElementById('analysis-plots');
    const analysisDetailsDiv = document.getElementById('analysis-details');

    // Function to update the results display
    function displayResults(results) {
        identifiedTypeDiv.innerHTML = `<strong>Identified Circuit Type:</strong> ${results.type}`;
        estimatedParamsDiv.innerHTML = `<strong>Estimated Parameters:</strong> ${results.params}`;
        analysisDetailsDiv.innerHTML = `<strong>Analysis Details:</strong> ${results.details}`;

        // Clear previous plots
        analysisPlotsDiv.innerHTML = '';
        // Add new plot images
        if (results.plots && results.plots.length > 0) {
             results.plots.forEach(plotUrl => {
                 const img = document.createElement('img');
                 img.src = plotUrl;
                 img.alt = 'Analysis Plot';
                 analysisPlotsDiv.appendChild(img);
             });
        } else {
             analysisPlotsDiv.innerHTML = '<p>No plots available.</p>';
        }


        resultsContentDiv.querySelector('p').style.display = 'none'; // Hide initial message
    }

    // Function to display an error message
    function displayError(message) {
        identifiedTypeDiv.innerHTML = `<strong>Error:</strong> Could not perform analysis`;
        estimatedParamsDiv.innerHTML = `<strong>Details:</strong> ${message}`;
        analysisDetailsDiv.innerHTML = '';
        analysisPlotsDiv.innerHTML = '';
        resultsContentDiv.querySelector('p').style.display = 'none'; // Hide initial message
    }


    analyzeButton.addEventListener('click', async () => {
        // Collect input values
        const circuit_type = circuitTypeSelect.value;
        const netlist = netlistTextarea.value;
        const signal_type = signalTypeSelect.value;
        const signal_params = signalParamsInput.value;

        // Prepare data to send to the backend
        const dataToSend = {
            circuit_type: circuit_type,
            netlist: netlist,
            signal_type: signal_type,
            signal_params: signal_params
        };

        // Clear previous results and show loading indicator (optional)
        identifiedTypeDiv.innerHTML = '';
        estimatedParamsDiv.innerHTML = '';
        analysisDetailsDiv.innerHTML = '';
        analysisPlotsDiv.innerHTML = '';
        resultsContentDiv.querySelector('p').style.display = 'block'; // Show initial message as loading
        resultsContentDiv.querySelector('p').textContent = 'Analyzing...';


        try {
            // Send data to the backend API
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response from the backend
            const results = await response.json();

            // Display the results
            displayResults(results);

        } catch (error) {
            // Handle errors during the fetch or backend processing
            console.error('Analysis failed:', error);
            displayError(error.message);
        }
    });

    // Optional: Add some initial content or instructions
    resultsContentDiv.innerHTML = '<p>Enter circuit details and click "Analyze Circuit".</p>';

});
