//var titleText = ["SQL t", "o", " RA"];
var titleText = ["SQL"," t","o", " RA"];
let title3DText;
let charO;
let cameraTo = {
    z: 0
};

function arrayTo3DText(arr) {
    if(title3DText){
        scene.remove(title3DText);
    }
    let textWidth = 0;
    let pos;
    let group = new THREE.Group();
    for (let i = 0; i < arr.length; i++) {
        let word = arr[i],
            obj = createText(word, 0xffffff, 140, 25);
        
        obj.receiveShadow = true;
        obj.castShadow = true;
        group.add(obj);
        textWidth += obj.width;
    }

    pos = -textWidth / 2;

    for (let i = 0; i < arr.length; i++) {
        group.children[i].position.x = pos;
        pos += group.children[i].width;
    }

    scene.add(group);
    return group;
}

window.addEventListener("fontLoaded", initTitle);

function initTitle() {
    title3DText = arrayTo3DText(titleText);
    charO = title3DText.children[2];
    cameraTo.x = charO.position.x + charO.width / 2;
    cameraTo.y = charO.position.y + charO.height / 2;
    dropWords();
//    buildGui();
    window.removeEventListener("fontLoaded", initTitle);
}

function animatedCameraMoveTo(toPos, toRot) {
    toRot = toRot || {
        x: 0,
        y: 0,
        z: 0
    };

    let steps = 50;
    let stepIndex = 0;

    let cp = camera.position;
    let cr = camera.rotation;

    let posCoef = {
        x: toPos.x > cp.x ? 1 : -1,
        y: toPos.y > cp.y ? 1 : -1,
        z: toPos.z > cp.z ? 1 : -1
    }

    let rotCoef = {
        x: toRot.x > cr.x ? 1 : -1,
        y: toRot.y > cr.y ? 1 : -1,
        z: toRot.z > cr.z ? 1 : -1
    }

    let posStep = {
        x: Math.abs(cp.x - toPos.x) * posCoef.x / steps,
        y: Math.abs(cp.y - toPos.y) * posCoef.y / steps,
        z: Math.abs(cp.z - toPos.z) * posCoef.z / steps
    };

    let rotStep = {
        x: Math.abs(cr.x - toRot.x) * rotCoef.x / steps,
        y: Math.abs(cr.y - toRot.y) * rotCoef.y / steps,
        z: Math.abs(cr.z - toRot.z) * rotCoef.z / steps
    };

    var inter = setInterval(function () {
        stepIndex++;

        camera.position.x += posStep.x;
        camera.position.y += posStep.y;
        camera.position.z += posStep.z;

        camera.rotation.x += rotStep.x;
        camera.rotation.y += rotStep.y;
        camera.rotation.z += rotStep.z;

        if (stepIndex == steps) {
            clearInterval(inter);
            var event = new Event("titleAnimated");
            window.dispatchEvent(event);
        }
    }, 20);
    
    clearInterval(dropWordsInterval);
    createSqlScene();
}



function createMirror() {
    mirrorParams.mirror = new THREE.Mirror(renderer, camera, {
        clipBias: 0.003,
        textureWidth: window.innerWidth,
        textureHeight: window.innerHeight,
        color: 0xb9b9b9
//        color: 0x889999
//        color: 0x7c7c7c
    });
    mirrorParams.mirrorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(mirrorParams.width, mirrorParams.height), mirrorParams.mirror.material);
    mirrorParams.mirrorMesh.add(mirrorParams.mirror);
    mirrorParams.mirrorMesh.position.y = 0;
    mirrorParams.mirrorMesh.position.z = 0 / 2;
    mirrorParams.mirrorMesh.rotation.x = -Math.PI / 180 * 90;
    mirrorParams.mirrorMesh.receiveShadow = true;
    scene.add(mirrorParams.mirrorMesh);
};

let mirrorParams = {
    width: container.offsetWidth,
    height: container.offsetHeight
};

var speed = 1.5;

function moveWord(obj) {
    let step = speed;
    let inter = setInterval(function () {
        obj.position.y -= step;
        if(obj.position.y < -container.offsetHeight /2 - 100){
            clearInterval(inter);
            scene.remove(obj);
        }
    }, 30);
}

let ffc = 0xffffff;
let sfc = 0x555555;
let dropWordsInterval;

function dropWords() {
    let index = 0;
    let randomX;
    let randomZ;
    let halfWidth = container.offsetWidth/2;
    
    dropWordsInterval = setInterval(function () {
        randomX = Math.floor(Math.random() * (halfWidth+halfWidth+1)-halfWidth);
        randomZ = Math.floor(Math.random() * (200+200+1)-200);
//        let obj = createText(keywords[index], Math.random() * 0xffffff);
        let color = index % 2 == 0 ? ffc : sfc;
        let obj = createText(keywords[index],color);
        obj.position.x = randomX;
        obj.position.y = container.offsetHeight / 2;
        obj.position.z = randomZ;
        scene.add(obj);
        moveWord(obj);
        index++;
        if(index > keywords.length) index = 0;
    }, 250);
}