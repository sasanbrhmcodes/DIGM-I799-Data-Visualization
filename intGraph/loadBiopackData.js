async function loadBiopackData() {
  try {
    const response = await fetch('Biopack.json');
    const data = await response.json();

    const hrData = [];

    for (const message of data.messages) {
      if (message.key === 'Biometric Data') {
        const biometricData = message.value.data;
        const time = parseFloat(biometricData.time);
        const hrValue = parseFloat(biometricData.HR.Value);

        if (!isNaN(time) && !isNaN(hrValue)) {
          hrData.push({ time, value: hrValue });
        } else {
          console.error('Invalid HR Data Point:', biometricData);
        }
      }
    }

    if (hrData.length === 0) {
      console.error('Error: No valid HR data found in Biopack.json');
    } else {
      console.log('Valid HR Data:', hrData.slice(0, 5)); // Sample the first 5 data points
    }

    return hrData;
  } catch (error) {
    console.error('Error loading Biopack.json:', error);
    return null;
  }
}
