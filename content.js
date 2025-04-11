console.log("👻 The ghost has entered this tab...");

// ========== TEXT GLITCHING ==========
function getAllTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            if (!node.nodeValue.trim() || node.nodeValue.trim().length < 10) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }

    return textNodes;
}

function randomlyCorruptText() {
    const textNodes = getAllTextNodes();
    if (textNodes.length === 0) return;

    const node = textNodes[Math.floor(Math.random() * textNodes.length)];
    const text = node.nodeValue;

    const index = Math.floor(Math.random() * text.length);
    const char = text[index];
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));

    if (/[a-zA-Z]/.test(char)) {
        const span = document.createElement("span");
        span.textContent = randomChar;
        span.className = "ghost-glitch";

        setTimeout(() => {
            const combined = before?.nodeValue + char + after?.nodeValue;
            const restored = document.createTextNode(combined);
        
            if (parent.contains(before)) {
                parent.replaceChild(restored, before);
            }
        
            if (parent.contains(span)) {
                parent.removeChild(span);
            }
        
            if (parent.contains(after)) {
                parent.removeChild(after);
            }
        }, 5000);

        const before = document.createTextNode(text.slice(0, index));
        const after = document.createTextNode(text.slice(index + 1));

        const parent = node.parentNode;
        if (!parent) return;


        parent.replaceChild(after, node);
        parent.insertBefore(span, after);
        parent.insertBefore(before, span);
    }
}

setInterval(randomlyCorruptText, 10000);


// ========== GHOST CURSOR ==========
const ghostCursor = document.createElement("div");
ghostCursor.style.position = "fixed";
ghostCursor.style.width = "16px";
ghostCursor.style.height = "16px";
ghostCursor.style.background = `url("${chrome.runtime.getURL("cursor.png")}") no-repeat center`;
ghostCursor.style.backgroundSize = "contain";
ghostCursor.style.pointerEvents = "none";
ghostCursor.style.zIndex = "999999";
ghostCursor.style.opacity = "0.7";
ghostCursor.style.transition = "transform 0.1s ease-out";
ghostCursor.style.display = "none";
document.body.appendChild(ghostCursor);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

setInterval(() => {
    const shouldJitter = Math.random() < 0.2;
    if (shouldJitter) {
        ghostCursor.style.display = "block";
        jitterCursor();
        setTimeout(() => {
            ghostCursor.style.display = "none";
        }, 4000);
    }
}, 20000);

function jitterCursor() {
    let ticks = 0;
    const jitterInterval = setInterval(() => {
        if (ticks++ > 20) {
            clearInterval(jitterInterval);
            return;
        }

        const jitterX = (Math.random() - 0.5) * 10;
        const jitterY = (Math.random() - 0.5) * 10;
        ghostCursor.style.left = `${mouseX + jitterX}px`;
        ghostCursor.style.top = `${mouseY + jitterY}px`;
    }, 100);
}


// ========== Text Crawl Message ==========
const ghostMessages = [
    "I see you.",
    "Don’t look behind.",
    "He’s almost here...",
    "Tab 3 knows the truth.",
    "There’s something in your bookmarks.",
    "Stop scrolling. It's watching.",
    "The ghost remembers.",
    "What did you just click?",
    "You're not alone on this page.",
    "This isn’t your browser anymore.",
];

function createGhostMessage(msg) {
    const container = document.createElement("div");
    container.textContent = "";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "30px";
    container.style.padding = "10px 16px";
    container.style.background = "rgba(0,0,0,0.6)";
    container.style.color = "#ccc";
    container.style.fontFamily = "monospace";
    container.style.fontSize = "14px";
    container.style.borderRadius = "6px";
    container.style.zIndex = 999999;
    container.style.pointerEvents = "none";
    container.style.boxShadow = "0 0 5px rgba(255,255,255,0.2)";
    container.style.transition = "opacity 1s ease";
    container.style.opacity = "1";

    document.body.appendChild(container);

    let i = 0;
    const crawl = setInterval(() => {
        container.textContent += msg[i];
        i++;
        if (i >= msg.length) {
            clearInterval(crawl);
            setTimeout(() => {
                container.style.opacity = "0";
                setTimeout(() => container.remove(), 1000);
            }, 3000);
        }
    }, 100);
}

function maybeShowGhostMessage() {
    const chance = Math.random();
    if (chance < 0.3) {
        const message = ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
        createGhostMessage(message);
    }
}

setInterval(() => {
    maybeShowGhostMessage();
}, 60000 + Math.random() * 60000);


// ========== Page Shudder ==========
function shudderPage() {
    const body = document.body;

    if (!body) return;

    let i = 0;
    const maxShakes = 8;
    const intensity = 3;

    const shakeInterval = setInterval(() => {
        const x = (Math.random() - 0.5) * intensity * 2;
        const y = (Math.random() - 0.5) * intensity * 2;

        body.style.transform = `translate(${x}px, ${y}px)`;

        i++;
        if (i >= maxShakes) {
            clearInterval(shakeInterval);
            body.style.transform = '';
        }
    }, 100);
}

setInterval(() => {
    if (Math.random() < 0.3) {
        setTimeout(() => {
            shudderPage();
        }, Math.random() * 4000);
    }
}, 15000);


// ========== Flip Text ==========
function flipText(){
    const candidates = Array.from(document.querySelectorAll("p, span, h1, h2, h3, li, a"))
        .filter(el => el.textContent.trim().length > 10);

    if (candidates.length === 0) return;

    const count = Math.ceil(Math.random() * 3);
    const selected = [];

    while (selected.length < count && candidates.length > 0) {
        const index = Math.floor(Math.random() * candidates.length);
        selected.push(candidates.splice(index, 1)[0]);
    }

    selected.forEach(el => {
        el.style.transform = "rotateX(180deg)";
    });

    setTimeout(() => {
        selected.forEach(el => {
            el.style.transform = "rotateX(0deg)";
        });
    }, 3000 + Math.random() * 1000);
}

setInterval(() => {
    if (Math.random() < 0.3) {
        flipText();
    }
}, 15000);


// ========== Inverted Color Flash ==========
function invertedFlash() {
    const html = document.documentElement;
    html.style.transition = "filter 0.1s ease";
    html.style.filter = "invert(1) hue-rotate(180deg)";

    setTimeout(() => {
        html.style.filter = "none";
    }, 25 + Math.random() * 20);
}

setInterval(() => {
    if (Math.random() < 0.3) {
        setTimeout(() => {
            invertedFlash();
        }, Math.random() * 2000);
    }
}, 15000);


// ========== Ghost Text Input Message ==========
const ghostInputMessages = [
    "who’s there?",
    "i see you",
    "behind you",
    "don’t trust the light",
    "stop",
    "just watching",
    "can you hear me?",
    "you’re not alone",
    "help me!"
];

function getRandomTextInput() {
    const inputs = Array.from(document.querySelectorAll("input[type='text'], textarea"))
        .filter(input => input.offsetParent !== null && !input.disabled);
    if (inputs.length === 0) return null;
    return inputs[Math.floor(Math.random() * inputs.length)];
}

function typeLikeGhost(element, message, delay = 100) {
    let index = 0;
    const originalValue = element.value;

    const typer = setInterval(() => {
        if (index < message.length) {
            element.value += message[index++];
        } else {
            clearInterval(typer);
            setTimeout(() => {
                const deleter = setInterval(() => {
                    if (element.value.length > originalValue.length) {
                        element.value = element.value.slice(0, -1);
                    } else {
                        clearInterval(deleter);
                    }
                }, 50);
            }, 3000);
        }
    }, delay);
}

setInterval(() => {
    if (Math.random() < 0.2) {
        setTimeout(() => {
            const input = getRandomTextInput();
            if (!input) return;

            const message = ghostInputMessages[Math.floor(Math.random() * ghostInputMessages.length)];

            input.focus();
            typeLikeGhost(input, message, 120);
        }, Math.random() * 4000);
    }
}, 15000);


// ========== Phantom Camera Flash ==========
function phantomFlash() {
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100%";
    flash.style.height = "100%";
    flash.style.background = "white";
    flash.style.opacity = "0.8";
    flash.style.zIndex = "9999999";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 0.3s ease";

    document.body.appendChild(flash);

    setTimeout(() => {
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 500);
    }, 50);
}

setInterval(() => {
    if (Math.random() < 0.1) {
        setTimeout(phantomFlash, Math.random() * 5000);
    }
}, 30000);


// ========== Ghost Notification ==========
function showGhostNotification() {
    if (Notification.permission === "granted") {
        new Notification("Ghost Tab Opened", {
            body: "Another tab just flickered into existence...",
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/OOjs_UI_icon_edit-ltr-progressive.svg/512px-OOjs_UI_icon_edit-ltr-progressive.svg.png"
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showGhostNotification();
            }
        });
    }
}

setInterval(() => {
    if (Math.random() < 0.2) showGhostNotification();
}, 150000);


// ========== Earie Sounds ==========
const ghostSounds = [
    chrome.runtime.getURL("sounds/mixkit-cinematic-whoosh-deep-impact-1143.mp3"),
    chrome.runtime.getURL("sounds/mixkit-lone-wolf-howling-1729.wav"),
];

function isNightTime() {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6;
}

function maybePlayGhostSound() {
    if (!document.hasFocus() || !isNightTime()) return;

    const chance = Math.random();
    if (chance < 0.2) {
        const sound = new Audio(ghostSounds[Math.floor(Math.random() * ghostSounds.length)]);
        sound.volume = 0.1;
        sound.play().then(() => {
            console.log("👻 Played ghostly whisper...");
        }).catch(err => {
            console.warn("👻 Ghost whisper failed:", err);
        });
    }
}

setInterval(() => {
    maybePlayGhostSound();
}, 60000 + Math.random() * 120000);


// ========== Button Haunting ==========
function hauntButtons() {
    const ghostify = (el) => {
        el.addEventListener("mouseenter", () => {
            const offsetX = (Math.random() - 0.5) * 300;
            const offsetY = (Math.random() - 0.5) * 300;
            el.style.transition = "transform 0.2s ease";
            el.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${(Math.random() - 0.5) * 10}deg)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = "translate(0, 0) rotate(0deg)";
        });
    };

    const buttonSelectors = [
        "button",
        "a[role='button']",
        "[class*='button']",
        "[class*='btn']"
    ];

    const allButtons = document.querySelectorAll(buttonSelectors.join(", "));
    allButtons.forEach(ghostify);
}

setTimeout(hauntButtons, 5000);


// ========== Ghost Tab ==========
function createGhostTab() {
    if (document.querySelector(".ghost-tab")) return;

    const ghostTab = document.createElement("div");
    ghostTab.className = "ghost-tab";
    ghostTab.innerText = "👁‍🗨";

    Object.assign(ghostTab.style, {
        position: "fixed",
        top: "0px",
        right: `${30 + Math.random() * 100}px`,
        width: "80px",
        height: "30px",
        background: "rgba(255, 255, 255, 0.05)",
        color: "#ccc",
        fontSize: "14px",
        textAlign: "center",
        lineHeight: "30px",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 -1px 5px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: "999999",
        opacity: "0.1",
        transition: "opacity 0.5s ease",
        userSelect: "none",
    });

    ghostTab.addEventListener("mouseenter", () => {
        ghostTab.style.opacity = "0.6";
    });

    ghostTab.addEventListener("mouseleave", () => {
        ghostTab.style.opacity = "0.1";
    });

    ghostTab.addEventListener("click", () => {
        ghostTab.innerText = "🕯 beware...";
        ghostTab.style.background = "rgba(0, 0, 0, 0.8)";
        ghostTab.style.color = "#f44336";
        ghostTab.style.opacity = "1";

        const whisper = new Audio(chrome.runtime.getURL("sounds/mixkit-lone-wolf-howling-1729.wav"));
        whisper.volume = 0.2;
        whisper.play().catch(() => {});
        
        setTimeout(() => {
            ghostTab.remove();
        }, 5000);
    });

    document.body.appendChild(ghostTab);
}

setTimeout(() => {
    if (Math.random() < 1) createGhostTab();
}, 15000 + Math.random() * 10000);


// ========== Phantom Redirects ==========
const hauntedURLs = [
    "https://www.scaryforkids.com/true-ghost-stories/",
    "https://theghostinmymachine.com/",
    "https://creepypasta.fandom.com/wiki/List_of_Creepypasta",
    "https://www.reddit.com/r/NoSleep/",
    "https://en.wikipedia.org/wiki/The_Witching_Hour_(superstition)",
    "https://www.screamingghost.com/random-ghost-story"
];

let redirecting = false;

function glitchyWarningBeforeRedirect(url) {
    const msg = document.createElement("div");
    msg.innerText = "Didn't like this page. Redirecting you...";
    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.fontSize = "22px";
    msg.style.background = "black";
    msg.style.color = "#ff4444";
    msg.style.padding = "20px 30px";
    msg.style.zIndex = "999999";
    msg.style.fontFamily = "'Creepster', cursive, sans-serif";
    msg.style.boxShadow = "0 0 12px red";
    msg.style.borderRadius = "10px";
    msg.style.opacity = "0.95";

    document.body.appendChild(msg);

    setTimeout(() => {
        window.location.href = url;
    }, 3000);
}

function spookyRedirect() {
    if (redirecting || !document.hasFocus()) return;

    const chance = Math.random();
    if (chance < 0.02) {
        redirecting = true;

        const url = hauntedURLs[Math.floor(Math.random() * hauntedURLs.length)];
        glitchyWarningBeforeRedirect(url);
    }
}

setInterval(() => {
    spookyRedirect();
}, 120000 + Math.random() * 30000);