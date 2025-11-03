const sections = document.querySelectorAll(".section");
const toast = document.querySelector(".toast");
const levelToast = document.querySelector(".l-toast");
let uLevel = localStorage.getItem("ulevel") || 1;
let moves = 0;

const keyframes = [
    [
        [
            { top: "-100%", offset: 0 },
            { top: "4%", offset: 0.06 },
            { top: "4%", offset: 0.8 },
            { top: "-100%", offset: 1 },
        ],
        {
            duration: 2500,
            iteration: 1,
        },
    ],
    [
        [
            { top: "-100%", offset: 0 },
            { top: "4%", offset: 0.06 },
            { top: "4%", offset: 0.8 },
            { top: "-100%", offset: 1 },
        ],
        {
            duration: 2500,
            iteration: 1,
        },
    ],
];

mI.innerHTML = "Level: " + uLevel + " || Moves: " + moves;

const moveRing = (e) => {
    let prevSel = document.querySelector(".selected") || null;

    if (prevSel && e.target.classList.value.includes("section")) {
        if (prevSel.parentElement != e.target) {
            // prevSel.animate(...keyframes[1]); // start animation
            if (e.target.querySelectorAll(".ring").length == 5) {
                toast.innerHTML = "Cannot place more than 5 rings!";
                toast.animate(...keyframes[0]);
                return;
            }
            e.target.prepend(prevSel); // copy to target
            moves++; // icrement moves

            sections.forEach((s) => {
                let rings = [...s.querySelectorAll(".ring")];

                s.querySelector(".tick").hidden = !(
                    rings.every(
                        (el) =>
                            el.getAttribute("my_bg") ==
                            rings[0].getAttribute("my_bg")
                    ) && rings.length == 4
                );
            });

            if (document.querySelectorAll(".tick:not([hidden])").length == 4) {
                levelClear();
            }
        }

        prevSel?.classList.remove("selected"); // unselect
        mI.innerHTML = "Level: " + uLevel + " || Moves: " + moves;
    }
};

const levelClear = () => {
    levelToast.animate(...keyframes[0]);
    moves = 0;
    if (uLevel >= 10) {
        levelToast.innerHTML = "Level Cleared!! You've completed all levels.";
        levelToast.animate(...keyframes[0]);
        return;
    }
    uLevel++;
    mI.innerHTML = "Level: " + uLevel + " || Moves: " + moves;

    const rings = document.querySelectorAll(".ring");
    rings.forEach((r) => r.remove());

    document.querySelectorAll(".tick").forEach((t) => (t.hidden = true));

    populateLevel(uLevel);

    localStorage.setItem("ulevel", uLevel);
};

let sectios = [...sections];
sectios.pop().onclick = moveRing;

const levels = JSON.parse(localStorage.getItem("levels")) || [];

if (levels.length == 0) {
    for (let h = 0; h < 10; h++) {
        let colors = [
            // "#db0000",
            "#db0000",
            "#0005a5",
            "#cfcf00",
            "#20ad00ff",
            "#db0000",
            "#0005a5",
            "#cfcf00",
            "#20ad00ff",
            "#db0000",
            "#0005a5",
            "#cfcf00",
            "#20ad00ff",
            "#db0000",
            "#0005a5",
            "#cfcf00",
            "#20ad00ff",
        ];

        let rings = [];
        let level = {
            id: h + 1,
            rings,
        };

        for (let i = 0; i < 4; i++) {
            let seg = [];

            for (let j = 0; j < 4; j++) {
                let randomColor = Math.floor(Math.random() * colors.length);
                seg.push(colors[randomColor]);
                colors.splice(randomColor, 1);
            }
            rings.push(seg);
            level = { ...level, rings };
        }

        levels.push(level);

        localStorage.setItem("levels", JSON.stringify(levels));
    }
}

const populateLevel = (uLevel) => {
    const clevel = levels[uLevel - 1];
    let j = 0;
    sectios.forEach((s, h) => {
        for (let i = 0; i < 4; i++) {
            const ring = document.createElement("div");
            ring.style.backgroundColor = clevel.rings[h][i];

            ring.id = j;
            ring.setAttribute("my_bg", clevel.rings[h][i]);
            ring.onclick = (e) => {
                let prevSel = document.querySelector(".selected") || null;
                prevSel &&
                    prevSel.id != e.target.id &&
                    prevSel?.classList.remove("selected");

                if (e.target == e.target.parentElement.querySelector(".ring")) {
                    e.target.classList.toggle("selected");
                } else {
                    !prevSel && toast.animate(...keyframes[0]);
                }
            };

            ring.classList.add("ring");
            s.appendChild(ring);
            j++;
        }

        s.onclick = moveRing;
    });
}

populateLevel();
