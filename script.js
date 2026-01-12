const seesaw = document.getElementById("seesaw");
const plankClickArea = document.getElementById("plank-click-area");

const MAX_ANGLE = 30;
const MAX_TORQUE = 5000; // deneme / görsel eşik

let totalLeftTorque = 0;
let totalRightTorque = 0;


function generateRandomWeight() {
    return Math.floor(Math.random() * 10 + 1);
}

function createWeightElement(weight) {
    const weightElement = document.createElement("div");
    weightElement.className = "weight";
    weightElement.textContent = weight;
    return weightElement;
}

function calculateSeesawAngle() {
    const torqueDiff = totalRightTorque - totalLeftTorque;

    if (torqueDiff === 0) return 0;

    const angleRatio = Math.max(
        -1,
        Math.min(1, torqueDiff / MAX_TORQUE)
    );

    return angleRatio * MAX_ANGLE;
}

plankClickArea.addEventListener("click", function (event) {
    const clickAreaBounds = plankClickArea.getBoundingClientRect();
    const clickX = event.clientX;
    const positionOnPlank = clickX - clickAreaBounds.left;
    const plankCenter = clickAreaBounds.width / 2;
    const distanceFromCenter = Math.abs(positionOnPlank - plankCenter);

    const weight = generateRandomWeight();
    const weightElement = createWeightElement(weight);

    weightElement.style.position = "absolute";
    weightElement.style.left = `${positionOnPlank - 15}px`;
    weightElement.style.top = "-35px";

    if (positionOnPlank < plankCenter) {
        totalLeftTorque += weight * distanceFromCenter;
    } else {
        totalRightTorque += weight * distanceFromCenter;
    }

    seesaw.appendChild(weightElement);

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;
});





