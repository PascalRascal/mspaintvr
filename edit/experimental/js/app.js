    // Setup three.js WebGL renderer.
    var renderer = new THREE.WebGLRenderer();

    // Create perspective camera used in VR
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    //
    // BUTTON SETUP
    //

    // Create WebVR UI Enter VR Button
    var options = {
        color: 'white',
        background: false,
        corners: 'square'
    };

    var enterVR = new webvrui.EnterVRButton(renderer.domElement, options)
            .on("enter", function(){
                console.log("enter VR")
            })
            .on("exit", function(){
                console.log("exit VR");
                camera.quaternion.set(0,0,0,1);
                camera.position.set(0,controls.userHeight,0);
            })
            .on("error", function(error){
                document.getElementById("learn-more").style.display = "inline";
                console.error(error)
            })
            .on("hide", function(){
                document.getElementById("ui").style.display = "none";
                // On iOS there is no button to close fullscreen mode, so we need to provide one
                if(enterVR.state == webvrui.State.PRESENTING_FULLSCREEN) document.getElementById("exit").style.display = "initial";
            })
            .on("show", function(){
                document.getElementById("ui").style.display = "inherit";
                document.getElementById("exit").style.display = "none";
            });


    // Add button to the #button element
    document.getElementById("button").appendChild(enterVR.domElement);

    //
    // WEBGL SCENE SETUP
    //

    // Append the canvas element created by the renderer to document body element.
    document.body.appendChild(renderer.domElement);

    // Create a three.js scene.
    var scene = new THREE.Scene();

    // Create a three.js camera.
    var controls = new THREE.VRControls(camera);
    controls.standing = true;
    camera.position.y = controls.userHeight;

    // Create VR Effect rendering in stereoscopic mode
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

    // Create 3D objects in scene.
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, controls.userHeight, -0.8);
    scene.add(cube);

    // Hande canvas resizing
    window.addEventListener('resize', onResize, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);

    function onResize(e) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    // Get the HMD
    var animationDisplay;
    enterVR.getVRDisplay()
            .then(function(display) {
                animationDisplay = display;
                display.requestAnimationFrame(animate);
            })
            .catch(function(){
                // If there is no display available, fallback to window
                animationDisplay = window;
                window.requestAnimationFrame(animate);
            });

    // Request animation frame loop function
    var lastRender = 0;
    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;

        // Apply rotation to cube mesh
        cube.rotation.y += delta * 0.0003;

        if(enterVR.isPresenting()){
            controls.update();
            renderer.render(scene,camera);
            effect.render(scene, camera);
        } else {
            renderer.render(scene,camera);
        }
        animationDisplay.requestAnimationFrame(animate);
    }