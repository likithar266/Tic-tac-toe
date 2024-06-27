let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector(".msg");

let turnO = true;
let count = 0;
let confettiAnimationFrame;
let confettiCanvas;
let confetti;

const winPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Clicking boxes
boxes.forEach((box) => {
    box.addEventListener("click", () => {  
        if (turnO) {
            box.innerText = "O";
            box.style.color = "#82204A"; // Change color for "O"
            turnO = false;
        } else {
            box.innerText = "X";
            box.style.color = "#231123"; // Change color for "X"
            turnO = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();

        if (count === 9 && !isWinner) {
            showDraw();
        }
    });
});

// Resetting game
const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    stopConfetti();
};

// Disabling and enabling boxes
const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
        box.style.color = ""; // Reset text color
    });
};

// Show winner
const showWinner = (winner) => {
    msg.innerText = `Congratulations!!\n\n The winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    startConfetti();
};

// Show draw
const showDraw = () => {
    msg.innerText = `Game is Draw`;
    msgContainer.classList.remove("hide");
    disableBoxes();
}

// Check for winner
const checkWinner = () => {
    for (let pattern of winPattern) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

// Start confetti effect
const startConfetti = () => {
    if (confettiCanvas) return; // Avoid creating multiple canvases

    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti';
    document.body.appendChild(confettiCanvas);

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confetti = confettiCanvas.getContext('2d');

    const confettiPieces = Array.from({ length: 200 }).map(() => {
        const side = Math.floor(Math.random() * 3);
        let x, y;
        if (side === 0) {
            x = Math.random() * window.innerWidth; // From top
            y = -10;
        } else if (side === 1) {
            x = -10; // From left
            y = Math.random() * window.innerHeight;
        } else {
            x = window.innerWidth + 10; // From right
            y = Math.random() * window.innerHeight;
        }

        return {
            x,
            y,
            size: Math.random() * 10 + 5,
            speedX: Math.random() * 3 + 2,
            speedY: Math.random() * 3 + 2,
            angle: Math.random() * 2 * Math.PI,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        };
    });

    function updateConfetti() {
        confetti.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiPieces.forEach(piece => {
            piece.x += piece.speedX * Math.cos(piece.angle);
            piece.y += piece.speedY * Math.sin(piece.angle);
            if (piece.y > window.innerHeight || piece.x < -10 || piece.x > window.innerWidth + 10) {
                const side = Math.floor(Math.random() * 3);
                if (side === 0) {
                    piece.x = Math.random() * window.innerWidth;
                    piece.y = -10;
                } else if (side === 1) {
                    piece.x = -10;
                    piece.y = Math.random() * window.innerHeight;
                } else {
                    piece.x = window.innerWidth + 10;
                    piece.y = Math.random() * window.innerHeight;
                }
            }
            confetti.fillStyle = piece.color;
            confetti.fillRect(piece.x, piece.y, piece.size, piece.size);
        });
        confettiAnimationFrame = requestAnimationFrame(updateConfetti);
    }

    updateConfetti();
};

// Stop confetti effect
const stopConfetti = () => {
    cancelAnimationFrame(confettiAnimationFrame);
    if (confettiCanvas) {
        confettiCanvas.remove();
        confettiCanvas = null;
    }
};

// Enabling reset and restart buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);