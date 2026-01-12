const seesaw = document.getElementById("seesaw");
let totalWeightOnLeft = 0;
let totalWeightOnRight = 0;
const distanceFromPivot = 1;


seesaw.addEventListener("click", function (event) {
    const seesawBounds = seesaw.getBoundingClientRect();
    const seesawCenter = seesawBounds.left + seesawBounds.width / 2;

    if (event.clientX < seesawCenter) {
        totalWeightOnLeft += 1;
        console.log("Total weight on left:", totalWeightOnLeft);
    } else {
        totalWeightOnRight += 1;
        console.log("Total weight on right:",  totalWeightOnRight);
    }

    const angle = calculateSeesawAngle();
    seesaw.style.transform = `rotate(${angle}deg)`;
});

function calculateSeesawAngle() {
    const leftTorque = totalWeightOnLeft * distanceFromPivot;
    const rightTorque = totalWeightOnRight * distanceFromPivot;

    if (leftTorque > rightTorque) {
        return -15;
    } else if (rightTorque > leftTorque) {
        return 15;
    } else {
        return 0;
    }
}

