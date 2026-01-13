const seesaw = document.getElementById("seesaw");
const plankClickArea = document.getElementById("plank-click-area");
const leftWeightEl = document.getElementById("left-weight");
const leftTorqueEl = document.getElementById("left-torque");
const rightWeightEl = document.getElementById("right-weight");
const rightTorqueEl = document.getElementById("right-torque");
const nextWeightEl = document.getElementById("next-weight");
const tiltAngleEl = document.getElementById("tilt-angle");
const resetButton = document.getElementById("reset-button");

const MAX_ANGLE = 30;
const MAX_TORQUE = 5000; // deneme / görsel eşik
const weights = [];

let nextWeight = generateRandomWeight();

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

function calculateTotalWeight() {
    let leftWeight = 0;
    let rightWeight = 0;

    weights.forEach(item => {
        if (item.side === "left") {
            leftWeight += item.value;
        } else {
            rightWeight += item.value;
        }
    });

    return { leftWeight, rightWeight };
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

function updateInfoPanel() {
    const { leftTorque, rightTorque } = calculateTotalTorque();
    const { leftWeight, rightWeight } = calculateTotalWeight();
    const angle = calculateSeesawAngle();

    leftWeightEl.textContent = leftWeight;
    rightWeightEl.textContent = rightWeight;
    leftTorqueEl.textContent = Math.round(leftTorque);
    rightTorqueEl.textContent = Math.round(rightTorque);
    tiltAngleEl.textContent = angle.toFixed(1);
    nextWeightEl.textContent = nextWeight;
}

function resetSeesaw() {
    weights.length = 0;
    localStorage.removeItem("seesawWeights");
    localStorage.removeItem("seesawNextWeight");
    const weightElements = seesaw.querySelectorAll(".weight");
    weightElements.forEach(box => box.remove());
    seesaw.style.transform = "rotate(0deg)";
    nextWeight = generateRandomWeight();
    
    updateInfoPanel();
}

function saveState() {
    localStorage.setItem("seesawWeights", JSON.stringify(weights));
    localStorage.setItem("seesawNextWeight", nextWeight);
}

function restoreState() {
    const savedWeights = localStorage.getItem("seesawWeights");
    const savedNextWeight = localStorage.getItem("seesawNextWeight");

    if (!savedWeights) return;

    const parsedWeights = JSON.parse(savedWeights);
    parsedWeights.forEach(box => {
        const weightElement = createWeightElement(box.value);
        weightElement.style.left = `${box.positionOnPlank - 15}px`;
        weightElement.style.top = "-35px";

        weights.push({ ...box, element: weightElement });
        seesaw.appendChild(weightElement);
    });

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;

    nextWeight = Number(savedNextWeight) || generateRandomWeight();
    updateInfoPanel();
}



resetButton.addEventListener("click", resetSeesaw);

plankClickArea.addEventListener("click", function (event) {
    const clickAreaBounds = plankClickArea.getBoundingClientRect();
    const clickX = event.clientX;
    const positionOnPlank = clickX - clickAreaBounds.left;
    const plankCenter = clickAreaBounds.width / 2;
    const distanceFromCenter = Math.abs(positionOnPlank - plankCenter);

    const weight = nextWeight;
    nextWeight = generateRandomWeight();
    const weightElement = createWeightElement(weight);
    const side = positionOnPlank < plankCenter ? "left" : "right";


    weightElement.style.position = "absolute";
    weightElement.style.left = `${positionOnPlank - 15}px`;
    weightElement.style.top = "-35px";

    weights.push({
        value: weight,
        distanceFromCenter,
        side,
        positionOnPlank,
        element: weightElement
    });

    saveState();

    seesaw.appendChild(weightElement);

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;
    updateInfoPanel();
});

restoreState();
updateInfoPanel();




