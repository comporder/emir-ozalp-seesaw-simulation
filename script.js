const seesaw = document.getElementById("seesaw");
const plankClickArea = document.getElementById("plank-click-area");

const MAX_ANGLE = 30;
const MAX_TORQUE = 5000; // deneme / görsel eşik
const weights = [];


function generateRandomWeight() {
    return Math.floor(Math.random() * 10 + 1);
}

function createWeightElement(weight) {
    const weightElement = document.createElement("div");
    weightElement.className = "weight";
    weightElement.textContent = weight;
    return weightElement;
}

function calculateTotalTorque() {
    let leftTorque = 0;
    let rightTorque = 0;

    weights.forEach((item) => {
        const torque = item.value * item.distanceFromCenter;

        if (item.side === "left") {
            leftTorque += torque;
        } else {
            rightTorque += torque;
        }
    });

    return { leftTorque, rightTorque };
}


function calculateSeesawAngle() {
    const { leftTorque, rightTorque } = calculateTotalTorque();
    const torqueDiff = rightTorque - leftTorque;

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
    const side = positionOnPlank < plankCenter ? "left" : "right";


    weightElement.style.position = "absolute";
    weightElement.style.left = `${positionOnPlank - 15}px`;
    weightElement.style.top = "-35px";

    weights.push({
        value: weight,
        distanceFromCenter,
        side,
        element: weightElement
    });

    seesaw.appendChild(weightElement);

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;
});





