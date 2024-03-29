function submitForm() {
    const manualIdValue = document.getElementById('manualIdField').value;
    const offenderValue = document.getElementById('nameField').value;
    const uppercaseOffenderValue = offenderValue.toUpperCase();
    const vRegNumberValue = document.getElementById('regNumberField').value;
    const vRegNumberValue1 = vRegNumberValue.toUpperCase();
    const violationCodeValue = document.getElementById('codeField').value;
    const violationCodeValue1 = `(${violationCodeValue})`;
    const challanAmountValue = parseFloat(document.getElementById('amountField').value);
    const serviceFeeValue = parseFloat(document.getElementById('feeField').value);
    const totalAmountValue = challanAmountValue + serviceFeeValue;
    const receivedByValue = document.getElementById('receivedByField').value;
    const combinedValues = `KPK Traffic Police Challan Name ${offenderValue},Total Amount ${totalAmountValue},Challan ID ${manualIdValue},Received By ${receivedByValue}`;

    const form = document.getElementById('myForm');
    form.style.display = 'none';

    const displayData = document.getElementById('displayData');

    const qrCodeApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(combinedValues)}`;
    displayData.innerHTML = `
        <p style="font-size:22px;"><strong>Khyber Pakhtunkhwa</strong></p>
        <div style="font-size: 15px; transform: scaleY(1.5); transform-origin: 0 0;">Traffic Police</div><br>
        <p style="font-weight: bold; font-size:15px; margin-bottom: -2px; "><strong>............................</strong></p>
        <article style="font-weight: bold; font-size:20px; margin-bottom: -2.5px;">Swat</article>
        <article style="font-weight: bold; font-size:20px; margin-bottom: -2.5px;">${manualIdValue}</article>
        <article style="font-weight: bold; font-size:20px;">PAID</article>
        
        <p style="transform: scaleY(1.5); transform-origin: 0 0; margin-top: -5px;">Offender : ${uppercaseOffenderValue}</p>
        <p style="transform: scaleY(1.5); transform-origin: 0 0; margin-bottom: 15px; margin-top: -15px;">V.Reg# : ${vRegNumberValue1}</p>
        
        <p style="font-weight: bold; font-size:15px; vertical-align: top; margin-bottom: 7px;"><strong>............................</strong></p>
        <p style="transform: scaleY(1.5); transform-origin: 0 0;">Violation Code's : ${violationCodeValue1}</p>
        <p style="transform: scaleY(1.5); transform-origin: 0 0;">Challan Amount : PKR. ${challanAmountValue.toFixed(0)}</p>
        <p style="transform: scaleY(1.5); transform-origin: 0 0; margin-bottom: 15px;">Service Fee    &nbsp;&nbsp; : PKR.&nbsp;&nbsp; ${serviceFeeValue.toFixed(0)}</p>
        
        <p style="font-weight: bold; font-size:15px; vertical-align: top; margin-bottom: 7px;"><strong>............................</strong></p>
        <p style="transform: scaleY(1.5); transform-origin: 0 0; margin-bottom: 2.5px;">Total Amount &nbsp;&nbsp;: PKR. ${totalAmountValue.toFixed(0)}</p>
        <br>
        <img src="${qrCodeApiUrl}" alt="QR Code" width="80" height="80">
        
        <section style="margin-top: -10px;">Received By: ${receivedByValue}</section>
        <section>at ${new Date().toLocaleString()}</section>
        <section>Traffic Police Helpline 1915.</section>
    `;

    const displayPage = document.getElementById('displayPage');
    displayPage.classList.remove('hidden');

    // Upload to Google Drive
    uploadToDrive();
}

function printDisplayPage() {
    window.print();
}

function uploadToDrive() {
    gapi.load('client:auth2', () => {
        gapi.auth2.init({
            clientId: '167800409735-77ce2lcdraku9f4qg21srao19jk2tkbd.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file'
        }).then(() => {
            if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                gapi.auth2.getAuthInstance().signIn().then(() => {
                    const formHtml = document.getElementById('myForm').outerHTML;
                    const fileMetadata = {
                        'name': 'challan_form.html',
                        'mimeType': 'text/html'
                    };
                    const blob = new Blob([formHtml], { type: 'text/html' });
                    const formData = new FormData();
                    formData.append('file', blob, 'challan_form.html');
                    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
                    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: blob,
                    }).then(response => {
                        console.log('Challan form uploaded successfully.');
                    }).catch(error => {
                        console.error('Error uploading challan form:', error);
                    });
                });
            } else {
                // Already signed in, directly upload
                const formHtml = document.getElementById('myForm').outerHTML;
                const fileMetadata = {
                    'name': 'challan_form.html',
                    'mimeType': 'text/html'
                };
                const blob = new Blob([formHtml], { type: 'text/html' });
                const formData = new FormData();
                formData.append('file', blob, 'challan_form.html');
                const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
                fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: blob,
                }).then(response => {
                    console.log('Challan form uploaded successfully.');
                }).catch(error => {
                    console.error('Error uploading challan form:', error);
                });
            }
        });
    });
}
