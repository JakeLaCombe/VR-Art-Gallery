import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FlyCamera, SceneLoader, SpotLight, PointLight, UniversalCamera } from "@babylonjs/core";
import GalleryScene from './blender_scenes/Gallery.babylon'

class App {
   canvas: HTMLCanvasElement = document.createElement("canvas");

    constructor() {
        // create the canvas html element and attach it to the webpage
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.id = "gameCanvas";
        document.body.appendChild(this.canvas);
        // initialize babylon scene and engine
       
    }

    async init() {
        var engine = new Engine(this.canvas, true);
        var scene = await SceneLoader.LoadAsync(GalleryScene);
        var camera: UniversalCamera =  new UniversalCamera("UniversalCamera", new Vector3(0, 10, -10), scene);
        camera.target = new Vector3(-15, 0, 21);
        camera.attachControl(true);
        camera.applyGravity = true;
        camera.ellipsoid = new Vector3(1, 1, 1);

        const assumedFramesPerSecond = 60;
        const earthGravity = -9.81;
        scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);
        scene.collisionsEnabled = true;
        scene.createDefaultXRExperienceAsync({
            floorMeshes: [scene.getNodeByID("Floor") as Mesh, scene.getNodeByID("Stairs") as Mesh, scene.getNodeByID("2nd Level Floor") as Mesh],
        });

        camera.checkCollisions = true;
        const mesh = scene.getNodeByID("First Floor Walls") as Mesh;
        mesh.checkCollisions = true;
        mesh.getChildMeshes().forEach(mesh => {
            mesh.checkCollisions = true;
        })
        
        
        // new HemisphericLight("light1", new Vector3(20, 200, 20), scene);
        // new PointLight("Spot0", new Vector3(0, 100, 5), scene);
        // var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });
        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}

const app = new App();
app.init();
