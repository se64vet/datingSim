const file_path = 'story2.json' // Path to your JSON file

async function loadGameStory(file_path) {
    try {
        const response = await fetch(file_path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gameStory = await response.json(); // Parse the JSON data
        return gameStory;

    } catch (error) {
        console.error("Could not load the the story:", error);
    }
}


// Call the function to load the object when the script runs
(async () => {
    const gameStory = await loadGameStory(file_path);

    // Game State
    let currentScene = 'start';
    let gameStats = {
        adventure: 0,
        romance: 0,
        playful: 0,
        thoughtful: 0
    };
    let totalScenes = gameStory.num_main_scenes;
    let currentSceneIndex = 0;
    const endings = gameStory.endings

    // Game Functions
    function updateStats(stats) {
        if (stats) {
            Object.keys(stats).forEach(key => {
                gameStats[key] += stats[key];
            });
            updateStatsDisplay();
        }
    }

    function updateStatsDisplay() {
        document.getElementById('adventureScore').textContent = gameStats.adventure;
        document.getElementById('romanceScore').textContent = gameStats.romance;
        document.getElementById('playfulScore').textContent = gameStats.playful;
        document.getElementById('thoughtfulScore').textContent = gameStats.thoughtful;
    }

    function updateProgress() {
        const progress = (currentSceneIndex / totalScenes) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    function determineEnding() {
        const max = Math.max(gameStats.adventure, gameStats.romance, gameStats.playful, gameStats.thoughtful);

        if (gameStats.romance >= 8) {
            return endings['perfect chemistry'];

        } else if (gameStats.adventure >= 6) {
            return endings['adventure partners'];

        } else if (gameStats.playful >= 6) {
            return endings['playful soulmates'];

        } else if (gameStats.thoughtful >= 6) {
            return endings['deep connection'];

        } else {
            return endings['sweet harmony'];
        }
    }

    function displayScene(sceneKey) {
        const scene = gameStory.scenes[sceneKey];
        const gameContent = document.getElementById('gameContent');

        if (sceneKey === 'ending') {
            const ending = determineEnding();
            gameContent.innerHTML = `
            <div class="ending-screen">
                <h2 class="ending-title">${ending.title}</h2>
                <p class="ending-text">${ending.text}</p>
                <button class="restart-button" onclick="restartGame()">Chơi lại</button>
            </div>
        `;
            return;
        }

        let choicesHTML = '';
        scene.choices.forEach((choice, index) => {
            choicesHTML += `
            <button class="choice-button" onclick="makeChoice(${index})">
                ${choice.text}
            </button>
        `;
        });

        gameContent.innerHTML = `
        <div class="story-section">
            <div class="story-text">${scene.text}</div>
            <div class="choices-container">
                ${choicesHTML}
            </div>
        </div>
    `;

        currentSceneIndex++;
        updateProgress();
    }

    function makeChoice(choiceIndex) {
        const scene = gameStory.scenes[currentScene];
        const choice = scene.choices[choiceIndex];

        updateStats(choice.stats);
        currentScene = choice.next;
        displayScene(currentScene);
    }
    window.makeChoice = makeChoice;


    function restartGame() {
        currentScene = 'start';
        currentSceneIndex = 0;
        gameStats = {
            adventure: 0,
            romance: 0,
            playful: 0,
            thoughtful: 0
        };
        updateStatsDisplay();
        updateProgress();
        displayScene(currentScene);
    }
    window.restartGame = restartGame;


    // initialize game
    restartGame()

})()




