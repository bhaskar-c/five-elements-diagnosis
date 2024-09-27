// Get the canvas and context once at the beginning
const canvas = document.getElementById('fiveElementsDiagramCanvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const baseRadius = 50;
const maxPentagonRadius = (canvas.width / 2) - (baseRadius * 1.3);

// Function to draw the five elements diagram
function drawFiveElementsDiagram(fiveElementsMap) {
    const elements = [
        { label: 'Fire', color: '#FF6F61', angle: 72 * 0, state: fiveElementsMap['Fire'] },
        { label: 'Earth', color: '#FDD835', angle: 72 * 1, state: fiveElementsMap['Earth'] },
        { label: 'Metal', color: '#BDBDBD', angle: 72 * 2, state: fiveElementsMap['Metal'] },
        { label: 'Water', color: '#64B5F6', angle: 72 * 3, state: fiveElementsMap['Water'] },
        { label: 'Wood', color: '#81C784', angle: 72 * 4, state: fiveElementsMap['Wood'] }
    ];

    // Calculate circle centers
    const circleCenters = elements.map((element, i) => {
        const angleInRadians = (element.angle - 90) * Math.PI / 180;
        const x = centerX + maxPentagonRadius * Math.cos(angleInRadians);
        const y = centerY + maxPentagonRadius * Math.sin(angleInRadians);
        return { x, y };
    });

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw arrows between circles
    circleCenters.forEach((start, i) => {
        const end = circleCenters[(i + 1) % circleCenters.length]; // Next element in the pentagon
        drawArrow(ctx, start.x, start.y, end.x, end.y, baseRadius, 'black');
    });

    // Draw purple arrows for "grandson" elements (skipping one circle)
    circleCenters.forEach((start, i) => {
        const end = circleCenters[(i + 2) % circleCenters.length]; // Grandson element
        drawArrow(ctx, start.x, start.y, end.x, end.y, baseRadius, '#6750A4');
    });

    // Draw the filled circles and concentric outlines
    elements.forEach((element, i) => {
        const center = circleCenters[i];

        // Draw the filled circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, baseRadius, 0, 2 * Math.PI);
        ctx.fillStyle = element.color;
        ctx.fill();
        ctx.closePath();

        // Draw concentric outline based on the state
        let outlineRadius = baseRadius; // Default outline radius
        if (element.state === 'Hyper') {
            outlineRadius = baseRadius * 1.2; // Increase radius
        } else if (element.state === 'Hypo') {
            outlineRadius = baseRadius * 0.8; // Decrease radius
        }

        // Draw outline circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, outlineRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'black'; // Outline color (can be modified)
        ctx.lineWidth = 3; // Outline width
        ctx.stroke();
        ctx.closePath();

        // Draw the label
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.label, center.x, center.y);
    });
}

// Function to draw arrows
function drawArrow(ctx, x1, y1, x2, y2, radius, color) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Adjust the end points to stop at the circumference of the circles
    const ratio = (dist - radius) / dist;
    const adjustedX2 = x1 + dx * ratio;
    const adjustedY2 = y1 + dy * ratio;

    // Draw the arrow line
    ctx.strokeStyle = color;
    ctx.lineWidth = color === 'black' ? 3 : 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(adjustedX2, adjustedY2);
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(adjustedY2 - y1, adjustedX2 - x1);
    const arrowLength = 10;
    const arrowAngle = Math.PI / 6; // Arrowhead angle

    const arrowX1 = adjustedX2 - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = adjustedY2 - arrowLength * Math.sin(angle - arrowAngle);

    const arrowX2 = adjustedX2 - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = adjustedY2 - arrowLength * Math.sin(angle + arrowAngle);

    ctx.beginPath();
    ctx.moveTo(adjustedX2, adjustedY2);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.lineTo(arrowX2, arrowY2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}


