const seesaw = document.getElementById("seesaw");
const scene = document.getElementById("scene");
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

seesaw.addEventListener("click", function (event) {
    const seesawBounds = seesaw.getBoundingClientRect();
    const seesawCenter = seesawBounds.left + seesawBounds.width / 2;
    const clickX = event.clientX;
    const positionOnSeesaw  = clickX - seesawBounds.left;
    const weight = generateRandomWeight();
    const weightElement = createWeightElement(weight);

    weightElement.style.position = "absolute";
    weightElement.style.left = `${positionOnSeesaw  - 15}px`;
    weightElement.style.top = "-35px"; // seesaw'ın üstü

    if (event.clientX < seesawCenter) {
        totalWeightOnLeft += weight;
        console.log("Total weight on left:", totalWeightOnLeft);
    } else {
        totalWeightOnRight += weight;
        console.log("Total weight on right:", totalWeightOnRight);
    }

    seesaw.appendChild(weightElement);

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;
});





