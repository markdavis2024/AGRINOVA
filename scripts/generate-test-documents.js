const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create upload directories
const uploadDir = path.join(__dirname, '../public/uploads/verification');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to generate a sample ID card image
function generateIDCard(type, number) {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, '#1a365d');
  gradient.addColorStop(0.5, '#2b6cb0');
  gradient.addColorStop(1, '#1a365d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // Border
  ctx.strokeStyle = '#ecc94b';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 580, 380);

  // Header
  ctx.fillStyle = '#ecc94b';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('NATIONAL ID CARD', 300, 55);

  // Line
  ctx.fillStyle = '#ecc94b';
  ctx.fillRect(50, 70, 500, 2);

  // Photo placeholder
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(50, 100, 120, 140);
  ctx.fillStyle = '#4a5568';
  ctx.font = '60px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('📷', 110, 200);
  ctx.fillStyle = '#a0aec0';
  ctx.font = '12px Arial';
  ctx.fillText('PHOTO', 110, 235);

  // ID Info
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`ID Number: ${number}`, 200, 120);
  ctx.fillText(`Name: Test Farmer`, 200, 150);
  ctx.fillText(`Date of Birth: 01/01/1990`, 200, 180);
  ctx.fillText(`Issue Date: 01/01/2023`, 200, 210);
  ctx.fillText(`Expiry Date: 01/01/2033`, 200, 240);

  // Type indicator
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ecc94b';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(type.toUpperCase(), 550, 360);

  // Bottom line
  ctx.fillStyle = '#ecc94b';
  ctx.fillRect(50, 300, 500, 1);

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#a0aec0';
  ctx.font = '12px Arial';
  ctx.fillText('Government of Cameroon • Ministry of Agriculture', 300, 380);

  return canvas;
}

// Function to generate a sample farm proof document
function generateFarmProof() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f7fafc';
  ctx.fillRect(0, 0, 800, 600);

  // Border
  ctx.strokeStyle = '#2b6cb0';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, 780, 580);

  // Header
  ctx.fillStyle = '#1a365d';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF FARM OWNERSHIP', 400, 60);

  ctx.fillStyle = '#2b6cb0';
  ctx.font = '18px Arial';
  ctx.fillText('MINISTRY OF AGRICULTURE AND RURAL DEVELOPMENT', 400, 95);

  // Line
  ctx.strokeStyle = '#2b6cb0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 115);
  ctx.lineTo(700, 115);
  ctx.stroke();

  // Content
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2d3748';
  ctx.font = '16px Arial';
  const lines = [
    'This is to certify that:',
    '',
    'TEST FARMER',
    '',
    'Is the registered owner of the following farm:',
    '',
    'Farm Name: AGRINOVA TEST FARM',
    'Location: Centre Region, Yaoundé',
    'Size: 5.5 hectares',
    'Registration Number: AGRI-2026-001',
    'Date of Registration: 01/01/2026',
    '',
    'This certificate is valid for agricultural activities in',
    'accordance with the laws of the Republic of Cameroon.',
    '',
    '_________________________',
    'Director of Agriculture',
    'Ministry of Agriculture'
  ];

  lines.forEach((line, index) => {
    ctx.fillText(line, 80, 150 + (index * 25));
  });

  // Stamp
  ctx.strokeStyle = '#2b6cb0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(650, 450, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#2b6cb0';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('APPROVED', 650, 445);
  ctx.font = '10px Arial';
  ctx.fillText('MINISTRY OF AGRICULTURE', 650, 465);

  return canvas;
}

// Generate the images
console.log('📄 Generating test documents...');

// Generate ID Front
const idFrontCanvas = generateIDCard('front', 'AGRI-2026-001');
const idFrontBuffer = idFrontCanvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(uploadDir, 'id-front-test.jpg'), idFrontBuffer);
console.log('✅ ID Front generated: id-front-test.jpg');

// Generate ID Back
const idBackCanvas = generateIDCard('back', 'AGRI-2026-001');
const idBackBuffer = idBackCanvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(uploadDir, 'id-back-test.jpg'), idBackBuffer);
console.log('✅ ID Back generated: id-back-test.jpg');

// Generate Farm Proof
const farmProofCanvas = generateFarmProof();
const farmProofBuffer = farmProofCanvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(uploadDir, 'farm-proof-test.jpg'), farmProofBuffer);
console.log('✅ Farm Proof generated: farm-proof-test.jpg');

console.log('\n📁 All documents saved to: public/uploads/verification/');
console.log('You can now use these files for testing!');