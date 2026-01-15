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
const weights = [];

let nextWeight = generateRandomWeight();

function generateRandomWeight() {
    return Math.floor(Math.random() * 10 + 1);
}

function createWeightElement(weight) {
    const weightElement = document.createElement("div");
    weightElement.className = "weight";
    weightElement.textContent = weight;
    weightElement.style.position = "absolute";
    return weightElement;
}

function styleWeightBox(weightElement, weight, positionOnPlank, dropFromTop = false) {
    const boxSize = getBoxSize(weight);

    weightElement.style.width = `${boxSize}px`;
    weightElement.style.height = `${boxSize}px`;
    weightElement.style.left = `${positionOnPlank - boxSize / 2}px`;
    weightElement.style.top = dropFromTop ? `-${boxSize * 3}px` : `-${boxSize}px`;
    weightElement.style.backgroundColor = getColorByWeight(weight);
}

function calculateTotals() {
    let leftWeight = 0, rightWeight = 0;
    let leftTorque = 0, rightTorque = 0;

    weights.forEach(weight => {
        if (weight.side === "left") {
            leftWeight += weight.value;
            leftTorque += weight.value * weight.distanceFromCenter;
        } else {
            rightWeight += weight.value;
            rightTorque += weight.value * weight.distanceFromCenter;
        }
    });

    return { leftWeight, rightWeight, leftTorque, rightTorque };
}

// tweaked this a bit by eye until the sizes looked reasonable
function getBoxSize(weight) {
    return 16 + weight * 2.4;
}

const weightColors = {
    1: "lightblue",
    2: "deepskyblue",
    3: "limegreen",
    4: "green",
    5: "yellow",
    6: "orange",
    7: "darkorange",
    8: "red",
    9: "darkred",
    10: "purple"
};

function getColorByWeight(weight) {
    return weightColors[weight] || "gray";
}

function calculateSeesawAngle(leftTorque, rightTorque) {
    const torqueDiff = rightTorque - leftTorque;

    if (torqueDiff === 0) return 0;

    const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (torqueDiff / 10)));

    return angle;
}

function updateInfoPanel() {
    const { leftWeight, rightWeight, leftTorque, rightTorque } = calculateTotals();
    const angle = calculateSeesawAngle(leftTorque, rightTorque);

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
    seesaw.style.transform = "translate(-50%, -50%) rotate(0deg)";
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
        styleWeightBox(weightElement, box.value, box.positionOnPlank);
        seesaw.appendChild(weightElement);
        weights.push(box);
    });

    const { leftTorque, rightTorque } = calculateTotals();
    const angle = calculateSeesawAngle(leftTorque, rightTorque);
    seesaw.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    nextWeight = Number(savedNextWeight) || generateRandomWeight();
    updateInfoPanel();
}

resetButton.addEventListener("click", resetSeesaw);

plankClickArea.addEventListener("click", function (event) {
    // determine position relative to plank center, offsetX gives position within the clicked element
    const positionOnPlank = event.offsetX;
    const plankCenter = plankClickArea.offsetWidth / 2;
    const distanceFromCenter = Math.abs(positionOnPlank - plankCenter);

    const weight = nextWeight;
    nextWeight = generateRandomWeight();
    const weightElement = createWeightElement(weight);
    const side = positionOnPlank < plankCenter ? "left" : "right";
    const boxSize = getBoxSize(weight);

    styleWeightBox(weightElement, weight, positionOnPlank, true);
    seesaw.appendChild(weightElement);

    // store weight info for state management
    weights.push({
        value: weight,
        distanceFromCenter,
        side,
        positionOnPlank,
    });

    saveState();

    // animate dropping the weight onto the plank
    requestAnimationFrame(() => {
        weightElement.style.top = `-${boxSize}px`;
    });

    const { leftTorque, rightTorque } = calculateTotals();
    const angle = calculateSeesawAngle(leftTorque, rightTorque);
    seesaw.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    updateInfoPanel();
});

restoreState();
updateInfoPanel();