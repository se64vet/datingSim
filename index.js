async function loadGameStory() {
    try {
        const response = await fetch('story.json'); // Path to your JSON file
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
    const gameStory = await loadGameStory();

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
            return {
                title: "💕 Perfect Chemistry",
                text: "You and Alex have discovered something truly special. The day was filled with romantic moments, deep connections, and genuine affection. As you cuddle together, you both feel like you've found your perfect match. This is just the beginning of many beautiful adventures together."
            };
        } else if (gameStats.adventure >= 6) {
            return {
                title: "🌟 Adventure Partners",
                text: "You and Alex are the perfect adventure team! Today proved that you both crave excitement and new experiences. Whether it's trying new foods, exploring art, or taking on challenges together, you've found someone who matches your adventurous spirit. The future looks bright and full of exciting possibilities."
            };
        } else if (gameStats.playful >= 6) {
            return {
                title: "😄 Playful Soulmates",
                text: "Laughter and joy filled every moment of your day together. You and Alex bring out the best in each other's playful sides, creating a relationship full of fun, spontaneity, and happiness. Your ability to find joy in simple moments together is truly special."
            };
        } else if (gameStats.thoughtful >= 6) {
            return {
                title: "💭 Deep Connection",
                text: "Today revealed the depth of your connection with Alex. Your thoughtful choices and meaningful conversations have created a bond that goes beyond surface-level attraction. You've found someone who truly understands you and values the same things in life."
            };
        } else {
            return {
                title: "💝 Sweet Harmony",
                text: "Your balanced approach to the day created a perfect harmony between romance, adventure, playfulness, and thoughtfulness. You and Alex complement each other beautifully, and your relationship feels natural and comfortable. This is the kind of love that lasts."
            };
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
                <button class="restart-button" onclick="restartGame()">Play Again</button>
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




