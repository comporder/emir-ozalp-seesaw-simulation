const seesaw = document.getElementById("seesaw");
const scene = document.getElementById("scene");
const plankClickArea = document.getElementById("plank-click-area");

let totalWeightOnLeft = 0;
let totalWeightOnRight = 0;
const distanceFromPivot = 1;

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
    const leftTorque = totalWeightOnLeft * distanceFromPivot;
    const rightTorque = totalWeightOnRight * distanceFromPivot;

    if (leftTorque > rightTorque) {
        return -30;
    } else if (rightTorque > leftTorque) {
        return 30;
    } else {
        return 0;
    }
}

plankClickArea.addEventListener("click", function (event) {
    const seesawBounds = seesaw.getBoundingClientRect();
    const clickX = event.clientX;
    const positionOnSeesaw  = clickX - seesawBounds.left;

    const weight = generateRandomWeight();
    const weightElement = createWeightElement(weight);

    weightElement.style.position = "absolute";
    weightElement.style.left = `${positionOnSeesaw  - 15}px`;
    weightElement.style.top = "-35px"; // seesaw'ın üstü

    console.log(seesawBounds.width / 2);

    if (positionOnSeesaw < seesawBounds.width / 2) {
        totalWeightOnLeft += weight;
    } else {
        totalWeightOnRight += weight;
    }

    seesaw.appendChild(weightElement);

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;
});





