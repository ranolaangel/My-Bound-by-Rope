// ============================================
// BOUND BY THE ROPE - 3D Web Game
// ============================================

let scene, camera, renderer;
let player1, player2, rope, mountain;
let keys = {};
let gameRunning = false;

const GAME_CONFIG = {
    ROPE_MAX_LENGTH: 15,
    ROPE_BREAK_LENGTH: 20,
    GRAVITY: 0.2,
    PLAYER_SPEED: 0.3,
    PLAYER_CLIMB_SPEED: 0.2,
    SUMMIT_HEIGHT: 50,
};

// ============================================
// INITIALIZATION
// ============================================

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 100, 200);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
}

// ============================================
// PLAYER CREATION
// ============================================

function createPlayer(x, z, color, name) {
    const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.5,
        roughness: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(x, 3, z);

    const player = {
        mesh: mesh,
        velocity: new THREE.Vector3(0, 0, 0),
        position: new THREE.Vector3(x, 3, z),
        isClimbing: false,
        isOnGround: true,
        canJump: true,
        color: color,
        name: name,
    };

    scene.add(mesh);
    return player;
}

// ============================================
// MOUNTAIN CREATION
// ============================================

function createMountain() {
    const mountainGroup = new THREE.Group();
    
    const platforms = [
        { x: 0, y: 0, z: 0, w: 40, h: 1, d: 40 },
        { x: -5, y: 5, z: 5, w: 25, h: 1, d: 25 },
        { x: 5, y: 10, z: 10, w: 20, h: 1, d: 20 },
        { x: -3, y: 15, z: 15, w: 18, h: 1, d: 18 },
        { x: 4, y: 20, z: 20, w: 15, h: 1, d: 15 },
        { x: -2, y: 25, z: 25, w: 12, h: 1, d: 12 },
        { x: 3, y: 30, z: 30, w: 10, h: 1, d: 10 },
        { x: 0, y: 35, z: 35, w: 8, h: 1, d: 8 },
        { x: -1, y: 40, z: 40, w: 6, h: 1, d: 6 },
        { x: 0, y: 45, z: 45, w: 4, h: 1, d: 4 },
        { x: 0, y: 50, z: 50, w: 3, h: 0.5, d: 3 },
    ];

    platforms.forEach((p, index) => {
        const geometry = new THREE.BoxGeometry(p.w, p.h, p.d);
        const material = new THREE.MeshStandardMaterial({
            color: index === platforms.length - 1 ? 0xFFD700 : 0x8B7355,
            metalness: 0.3,
            roughness: 0.8,
        });
        const platform = new THREE.Mesh(geometry, material);
        platform.position.set(p.x, p.y, p.z);
        platform.castShadow = true;
        platform.receiveShadow = true;
        
        if (index === platforms.length - 1) {
            const flagGeometry = new THREE.PlaneGeometry(2, 1);
            const flagMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
            const flag = new THREE.Mesh(flagGeometry, flagMaterial);
            flag.position.set(0, 1.5, 0);
            flag.rotation.y = Math.PI / 4;
            platform.add(flag);
        }

        mountainGroup.add(platform);
    });

    scene.add(mountainGroup);
    return mountainGroup;
}

// ============================================
// ROPE CREATION
// ============================================

function createRope() {
    const ropeGroup = new THREE.Group();
    
    const ropeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const ropeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        metalness: 0.1,
        roughness: 0.8,
    });
    
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.castShadow = true;
    rope.receiveShadow = true;
    ropeGroup.add(rope);
    
    scene.add(ropeGroup);
    return ropeGroup;
}

// ============================================
// UPDATE ROPE
// ============================================

function updateRope() {
    if (!rope || !player1.mesh || !player2.mesh) return;

    const p1Pos = player1.mesh.position;
    const p2Pos = player2.mesh.position;
    
    const distance = p1Pos.distanceTo(p2Pos);
    
    document.getElementById('ropeDistance').textContent = distance.toFixed(1);
    document.getElementById('p1Height').textContent = Math.round(p1Pos.y) + 'm';
    document.getElementById('p2Height').textContent = Math.round(p2Pos.y) + 'm';
    
    const ropeStatus = document.getElementById('ropeStatusText');
    const ropeStatusDiv = document.getElementById('ropeStatus');
    if (distance > GAME_CONFIG.ROPE_BREAK_LENGTH * 0.7) {
        ropeStatus.textContent = '🟡 Fraying';
        ropeStatusDiv.classList.add('critical');
    } else if (distance > GAME_CONFIG.ROPE_BREAK_LENGTH * 0.5) {
        ropeStatus.textContent = '🟠 Stressed';
        ropeStatusDiv.classList.remove('critical');
    } else {
        ropeStatus.textContent = '🟢 Strong';
        ropeStatusDiv.classList.remove('critical');
    }
    
    if (distance > GAME_CONFIG.ROPE_BREAK_LENGTH) {
        endGame(false);
        return;
    }
    
    const midpoint = new THREE.Vector3();
    midpoint.addVectors(p1Pos, p2Pos).multiplyScalar(0.5);
    rope.position.copy(midpoint);
    
    const direction = new THREE.Vector3().subVectors(p2Pos, p1Pos);
    rope.scale.z = direction.length() / 1.3;
    
    rope.lookAt(p2Pos);
}

// ============================================
// PLAYER MOVEMENT & PHYSICS
// ============================================

function updatePlayer(player, keySet) {
    if (!gameRunning || !player) return;

    const moveX = (keys[keySet.right] ? 1 : 0) - (keys[keySet.left] ? 1 : 0);
    const moveY = (keys[keySet.up] ? 1 : 0) - (keys[keySet.down] ? 1 : 0);
    
    player.mesh.position.x += moveX * GAME_CONFIG.PLAYER_SPEED;
    player.mesh.position.z += moveY * GAME_CONFIG.PLAYER_SPEED * (player.isClimbing ? 0.5 : 1);
    
    if (keys[keySet.climb] && player.mesh.position.y < GAME_CONFIG.SUMMIT_HEIGHT) {
        player.isClimbing = true;
        player.mesh.position.y += GAME_CONFIG.PLAYER_CLIMB_SPEED;
        player.velocity.y = 0;
    } else {
        player.isClimbing = false;
    }
    
    if (!player.isClimbing) {
        player.velocity.y -= GAME_CONFIG.GRAVITY;
    }
    
    player.mesh.position.y += player.velocity.y;
    
    if (player.mesh.position.y < 0) {
        player.mesh.position.y = 0;
        player.velocity.y = 0;
        player.isOnGround = true;
        player.canJump = true;
    }
    
    if (keys[keySet.jump] && player.canJump && (player.isOnGround || player.isClimbing)) {
        player.velocity.y = 0.5;
        player.canJump = false;
        player.isOnGround = false;
    }
    
    player.position.copy(player.mesh.position);
}

// ============================================
// VICTORY CONDITION
// ============================================

function checkVictory() {
    const summitHeight = GAME_CONFIG.SUMMIT_HEIGHT;
    const summitPos = { x: 0, z: 50 };
    const reachDistance = 5;
    
    const p1Pos = player1.mesh.position;
    const p2Pos = player2.mesh.position;
    
    const p1NearSummit = p1Pos.y > summitHeight - 2 && 
                         Math.hypot(p1Pos.x - summitPos.x, p1Pos.z - summitPos.z) < reachDistance;
    const p2NearSummit = p2Pos.y > summitHeight - 2 && 
                         Math.hypot(p2Pos.x - summitPos.x, p2Pos.z - summitPos.z) < reachDistance;
    
    if (p1NearSummit && p2NearSummit) {
        endGame(true);
    }
}

// ============================================
// CAMERA SYSTEM
// ============================================

function updateCamera() {
    if (!player1.mesh || !player2.mesh) return;
    
    const p1 = player1.mesh.position;
    const p2 = player2.mesh.position;
    
    const targetX = (p1.x + p2.x) / 2;
    const targetY = (p1.y + p2.y) / 2 + 5;
    const targetZ = (p1.z + p2.z) / 2 + 15;
    
    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
    camera.lookAt((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
}

// ============================================
// INPUT HANDLING
// ============================================

function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
}

function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// GAME LOOP
// ============================================

function gameLoop() {
    requestAnimationFrame(gameLoop);
    
    if (gameRunning) {
        updatePlayer(player1, { 
            left: 'arrowleft', 
            right: 'arrowright', 
            up: 'arrowup', 
            down: 'arrowdown',
            jump: ' ',
            climb: 'shift'
        });
        
        updatePlayer(player2, { 
            left: 'a', 
            right: 'd', 
            up: 'w', 
            down: 's',
            jump: 'e',
            climb: 'q'
        });
        
        updateRope();
        checkVictory();
        updateCamera();
    }
    
    renderer.render(scene, camera);
}

// ============================================
// GAME CONTROL FUNCTIONS
// ============================================

function startGame() {
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('victoryModal').classList.remove('show');
    document.getElementById('gameoverModal').classList.remove('show');
    
    // Clear old renderer if exists
    const oldCanvas = document.querySelector('canvas');
    if (oldCanvas && oldCanvas.parentNode === document.getElementById('gameContainer')) {
        oldCanvas.remove();
    }
    
    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }
    
    initThreeJS();
    player1 = createPlayer(-3, 0, 0xFF6B6B, 'Player 1');
    player2 = createPlayer(3, 0, 0x4ECDC4, 'Player 2');
    mountain = createMountain();
    rope = createRope();
    
    gameRunning = true;
}

function backToMenu() {
    gameRunning = false;
    document.getElementById('menuScreen').classList.remove('hidden');
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('victoryModal').classList.remove('show');
    document.getElementById('gameoverModal').classList.remove('show');
}

function endGame(victory) {
    gameRunning = false;
    if (victory) {
        document.getElementById('victoryModal').classList.add('show');
    } else {
        document.getElementById('gameoverModal').classList.add('show');
    }
}

function showInstructions() {
    alert(`🎮 HOW TO PLAY:

👥 YOU ARE TWO CLIMBERS
Connected by a single rope, you must climb the mountain together.

⚠️ RULES:
• Don't get more than 20 meters apart or the rope breaks
• Both players must reach the gold summit flag to win
• Use climbing mechanics to scale the mountain

⌨️ PLAYER 1 (Red):
← → Arrow Keys to move
↑ ↓ Climb up/down
Space to jump

⌨️ PLAYER 2 (Cyan):
A D Keys to move
W S to climb up/down
E to jump

🏔️ GOAL:
Lead both players to the golden summit at the top!

Good luck, climber! 🪢`);
}

// ============================================
// START THE GAME
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    gameLoop();
});
