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


function calculateSeesawAngle() {
    const { leftTorque, rightTorque } = calculateTotalTorque();
    const torqueDiff = rightTorque - leftTorque;

    if (torqueDiff === 0) return 0;

    // Visual scaling for smoother rotation (based on task example)
    const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (torqueDiff / 10)));

    return angle;
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

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    nextWeight = Number(savedNextWeight) || generateRandomWeight();
    updateInfoPanel();
}

resetButton.addEventListener("click", resetSeesaw);

plankClickArea.addEventListener("click", function (event) {
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

    weights.push({
        value: weight,
        distanceFromCenter,
        side,
        positionOnPlank,
    });

    saveState();

    requestAnimationFrame(() => {
        weightElement.style.top = `-${boxSize}px`;
    });

    seesaw.style.transform = `translate(-50%, -50%) rotate(${calculateSeesawAngle()}deg)`;
    updateInfoPanel();
});

restoreState();
updateInfoPanel();