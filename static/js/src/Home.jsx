import React from 'react';
import ReactDOM from 'react-dom';
import * as BABYLON from 'babylonjs';
import * as Materials from 'babylonjs-materials';
import * as BLOADERS from 'babylonjs-loaders'

const HOUSE_SIZE = 6;
const BASE_POS = {x:-5, y:4.2, z:6};
const START_POS = {x:BASE_POS.x, y:BASE_POS.y+2, z:BASE_POS.z+1.15};
const START_ANGLE = {x:START_POS.x, y:START_POS.y, z:START_POS.z-3};



export class Home extends React.Component {

  constructor() {
    super();
    this.scene = null;
    this.debugCam = null;
    this.bulb = null;
    this.bulbState = false;
    this.bulbGlow = null;
    this.domeMesh = null;
    this.desk = null;
    this.laptop = null;
    this.lightswitch = null;
    this.mainCam = null;
    this.cutscene = false;
    this.canvas;
    this.introNarrationParams = [
      {timeout:500, text:'Hello...?'},
      {timeout:3000, text:'Where am I?'},
      {timeout:7000, text:'Is someone else in here?'},
      {timeout:11000, text:'I can\'t see a thing. I have to find a light.'}
    ];

    this.state = {
      narrationVisibility:'narration_bg',
      currentNarration:'',
      outputVisibility:'output_bg',
      currentOutput:''
    };
  }

  loadGraffiti(mesh) {
    let graffiti = new BABYLON.StandardMaterial('graffiti', this.scene);
    //graffiti.bumpTexture = new BABYLON.Texture('textures/wall_getout.jpg', this.scene);
    graffiti.ambientTexture = new BABYLON.Texture('textures/wall_getout.jpg', this.scene);
    mesh.material = graffiti;
  }

  showAxes(size) {
    var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, this.scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, this.scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
  
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], this.scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], this.scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], this.scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  }

  addGround() {
    var mix = new Materials.MixMaterial("mix", this.scene);
    // Setup mix texture 1
    mix.mixTexture1 = new BABYLON.Texture("textures/mixMap.png", this.scene);
    mix.diffuseTexture1 = new BABYLON.Texture("textures/floor.png", this.scene);
    mix.diffuseTexture2 = new BABYLON.Texture("textures/rock.png", this.scene);
    mix.diffuseTexture3 = new BABYLON.Texture("textures/grass.png", this.scene);
    mix.diffuseTexture4 = new BABYLON.Texture("textures/floor.png", this.scene);

    mix.diffuseTexture1.uScale = mix.diffuseTexture1.vScale = 10;
    mix.diffuseTexture2.uScale = mix.diffuseTexture2.vScale = 10;
    mix.diffuseTexture3.uScale = mix.diffuseTexture3.vScale = 10;
    mix.diffuseTexture4.uScale = mix.diffuseTexture4.vScale = 10;

    // Ground
    let ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground', 'textures/heightMap.png', 100, 100, 100, 0, 10, this.scene, false);
    ground.position.y = -2.05;
    mix.ambientColor = new BABYLON.Color3.FromHexString('#195c1a');
    ground.material = mix;
  }

  addMetaData(mesh, label, value) {
    if (!mesh.metadata) {
      mesh.metadata = {};
    }
    mesh.metadata[label] = value;
  }

  highlightMesh(mesh, color) {
    let hl = new BABYLON.HighlightLayer("hl1", this.scene);
    hl.addMesh(mesh, color);
    this.addMetaData(mesh, 'highlight', hl);
  }

  removeMeshHighlight(mesh) {
    if (mesh.metadata && mesh.metadata.highlight) {
      mesh.metadata.highlight.removeMesh(mesh);
      mesh.metadata.highlight = null;
    }
  }

  jumpToDebugCam() {
    this.scene.activeCameras = [];
    this.scene.activeCameras.push(this.debugCam);
  }

  jumpToInteriorCam() {
    this.scene.activeCameras = [];
    this.scene.activeCameras.push(this.mainCam);
  }

  addHelperPoint(vector, color) {
    let orb = new BABYLON.MeshBuilder.CreateSphere('orb', {diameter:0.1}, this.scene);
    orb.position = vector;
    let mat = new BABYLON.StandardMaterial("mat", this.scene);
    if (!color) {
      mat.diffuseColor = new BABYLON.Color3.FromHexString('#00FF00');
    } else {
      mat.diffuseColor = color;
    }
    orb.material = mat;
    return orb;
  }

  addDebugLight() {
    let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2,2,2), this.scene);
    light.diffuse = new BABYLON.Color3(1,1,1);
    light.specular = new BABYLON.Color3(0, 0, 0);
    light.groundColor = new BABYLON.Color3(0, 0, 0);
  }

  toggleLightBulb() {
    if (this.bulbState) {
      if (this.bulbGlow) {
        this.bulbGlow.dispose();
      }
      if (this.domeMesh.material) {
        this.domeMesh.material = null;
      }
    } else {
      this.bulbGlow = new BABYLON.HighlightLayer("hg", this.scene);
      this.bulbGlow.innerGlow = false;
      this.bulbGlow.addMesh(this.domeMesh, new BABYLON.Color3(.9, .9, .9));
      let materialGlow = new BABYLON.StandardMaterial('lamplight', this.scene);
      materialGlow.emissiveColor = new BABYLON.Color3(1.0, 1.0, 0.7);
      this.domeMesh.material = materialGlow;
    }
    this.bulbState = !this.bulbState;
    this.bulb.setEnabled(this.bulbState);
  }

  parentImportedMeshes(array, blocking) {
    let node = new BABYLON.TransformNode();
    array.forEach(mesh => {
      if (!mesh.parent) {
        mesh.parent = node;
      }
      mesh.checkCollisions = blocking;
    });
    return node;
  }
  
  mouseOverBulb() {
    this.setState({
      currentOutput:'Light Bulb'
    });
  }
  mouseOutBulb() {
    this.setState({
      currentOutput:''
    });
  }
  
  mouseClickBulb() {
    if (!this.cutscene) {
      this.showNarration();
      this.cutscene = true;
      setTimeout(() => {
        if (!this.bulbState) {
          this.typeNarration('I need to find a switch.');
        } else {
          this.typeNarration('It\'s already on.');
        }
      }, 1000);
      setTimeout(() => {
        this.hideNarration();
        this.cutscene = false;
      }, 3000);
    }
  }
  
  mouseOverDesk() {
    this.setState({
      currentOutput:'Desk'
    });
  }
  mouseOutDesk() {
    this.setState({
      currentOutput:''
    });
  }
  
  mouseOverLaptop() {
    this.setState({
      currentOutput:'Laptop'
    });
  }
  mouseOutLaptop() {
    this.setState({
      currentOutput:''
    });
  }

  mouseClickLaptop() {
    if (!this.cutscene) {
      this.showNarration();
      this.cutscene = true;
      setTimeout(() => {
        this.setState({
          currentNarration:''
        });
        if (!this.bulbState) {
          this.typeNarration('I can\'t see what I\'m doing.');
        } else {
          this.typeNarration('Nothing to do here yet.');
        }
      }, 1000);
      setTimeout(() => {
        this.cutscene = false;
        this.hideNarration();
      }, 3000);
    }
  }

  mouseClickSwitch() {
    this.toggleLightBulb();
  }

  mouseOverSwitch() {
    this.setState({
      currentOutput:'Light Switch'
    });
  }
  mouseOutSwitch() {
    this.setState({
      currentOutput:''
    });
  }

  mouseClickSwitch() {
    if (!this.cutscene) {
      this.toggleLightBulb();
    }
  }

  initializeScene() {
    this.canvas = document.getElementsByTagName('canvas')[0]; // Get the canvas element 
    let engine = new BABYLON.Engine(this.canvas, false, null, true); // Generate the BABYLON 3D engine
    engine.displayLoadingUI();
    BLOADERS.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;

    this.scene = new BABYLON.Scene(engine);
    this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.clearColor = new BABYLON.Color3.FromHexString('#OC1445');
    this.scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.03;

    let floor = BABYLON.MeshBuilder.CreatePlane('ground', {width: HOUSE_SIZE, height: HOUSE_SIZE, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.scene);
    let material = new BABYLON.StandardMaterial('groundMat', this.scene);
    floor.material = material;
    floor.position.y = BASE_POS.y;
    floor.position.x = BASE_POS.x;
    floor.position.z = BASE_POS.z;

    floor.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
    floor.checkCollisions = true;
    material.diffuseTexture = new BABYLON.Texture('textures/concrete_floor.jpg', this.scene);
    BABYLON.SceneLoader.ImportMesh('', '3D/', 'wall.babylon', this.scene, (newMeshes) => {
      let wall1 = newMeshes[0];
      wall1.scaling = wall1.scaling.multiply(new BABYLON.Vector3(1, 1, 1.5));
      wall1.position.x = BASE_POS.x;
      wall1.position.y = BASE_POS.y;
      wall1.position.z = BASE_POS.z - HOUSE_SIZE/2;
      
      let win = BABYLON.Mesh.CreateBox('window', 1, this.scene);
      win.position = new BABYLON.Vector3(BASE_POS.x, BASE_POS.y + 2, BASE_POS.z - HOUSE_SIZE/2);
      let wallCSG = BABYLON.CSG.FromMesh(wall1);
      var subCSG = wallCSG.subtract(BABYLON.CSG.FromMesh(win));
      let newWall = subCSG.toMesh('wall', wall1.material, this.scene);
      newWall.checkCollisions = true;
      let winSize = win.getBoundingInfo().boundingBox.extendSize;
      let bar = BABYLON.MeshBuilder.CreateCylinder('bar', {height:winSize.y*2, diameter:0.03}, this.scene);
      bar.checkCollisions = true;
      let blackMat = new BABYLON.StandardMaterial("blackMat", this.scene);
      blackMat.diffuseColor = BABYLON.Color3.Black();
      bar.material = blackMat;
      bar.position.x = win.position.x;
      bar.position.z = win.position.z;
      bar.position.y = win.position.y;
      let bar2 = bar.clone();
      bar2.position.x -= winSize.x/2;
      let bar3 = bar.clone();
      bar3.position.x += winSize.x/2;
      win.dispose();
      let wallSize = wall1.getBoundingInfo().boundingBox.extendSize;
      this.loadGraffiti(newWall);

      let wall2 = wall1.clone();
      wall2.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
      wall2.position.x -= wallSize.x;
      wall2.position.z = BASE_POS.z - wallSize.y;
      wall2.checkCollisions = true;

      let wall3 = wall1.clone();
      wall3.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
      wall3.position.x += wallSize.x;
      wall3.position.z = BASE_POS.z - wallSize.y;
      wall3.checkCollisions = true;

      let wall4 = wall1.clone();
      wall4.position.z += (wallSize.x*2) - wallSize.y;
      wall4.checkCollisions = true;

      let ceiling = BABYLON.MeshBuilder.CreatePlane('ceiling', {width: wallSize.x*2, height: wallSize.x*2, sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene);
      material = new BABYLON.StandardMaterial('ceilingMat', this.scene);
      material.roughness = 1;
      material.diffuseTexture = new BABYLON.Texture('textures/ceiling.jpg', this.scene);
      ceiling.material = material;
      ceiling.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
      ceiling.position.x = BASE_POS.x - wallSize.y;
      ceiling.position.y = BASE_POS.y + wall1.position.y;
      ceiling.position.z = BASE_POS.z - wallSize.y;
      ceiling.checkCollisions = true;

      let wallpos = wall1.position;
      wall1.dispose();

      BABYLON.SceneLoader.ImportMesh('', '3D/', 'lamp.babylon', this.scene, (newMeshes) => {
        let lamp = new BABYLON.TransformNode();
        newMeshes.forEach(mesh => {
          if (!mesh.parent) {
            mesh.parent = lamp;
          }
          if (mesh.name == 'Line151') {
            this.domeMesh = mesh;
          }
        });
        lamp.position.y = BASE_POS.y + wallpos.y - 1.15;
        lamp.position.x = BASE_POS.x + 0.5;
        lamp.position.z = BASE_POS.z - 1.5;
        let lightPos = lamp.position.clone();
        lightPos.y += 0.2;
        lightPos.x -= 0.1;
       
        this.bulb = new BABYLON.PointLight('lightbulb', lightPos, this.scene);
        this.bulb.range /= 2;
        this.bulb.diffuse = new BABYLON.Color3(1, 1, 1);
        this.bulb.specular = new BABYLON.Color3(1, 1, 1);
        this.bulb.groundColor = new BABYLON.Color3(0, 0, 0);
        this.bulb.excludedMeshes.push(this.domeMesh);
        this.bulb.parent = lamp;
        this.bulb.setEnabled(false);
        let mouseOn = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mouseOverBulb.bind(this));
        let mouseOff = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mouseOutBulb.bind(this));
        let mouseClick = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.mouseClickBulb.bind(this));
        lamp.getChildMeshes().forEach(mesh => {
          mesh.actionManager = new BABYLON.ActionManager(this.scene);	
          mesh.actionManager.registerAction(mouseOn);
          mesh.actionManager.registerAction(mouseOff);
          mesh.actionManager.registerAction(mouseClick);
        });
      });

      BABYLON.SceneLoader.ImportMesh("", "3D/", "desk.babylon", this.scene, (newMeshes) => {
        this.desk = this.parentImportedMeshes(newMeshes, true);
        this.desk.scaling = this.desk.scaling.multiply(new BABYLON.Vector3(0.6, 0.6, 0.6));
        let deskSize = this.desk.getHierarchyBoundingVectors().max;
        this.desk.position.y = BASE_POS.y;
        this.desk.position.z = BASE_POS.z - wallSize.x + deskSize.z;
        this.desk.position.x = BASE_POS.x - wallSize.x + deskSize.x;
        this.desk.applyGravity = true;
        this.desk.checkCollisions = true;
        
        let mouseOn = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mouseOverDesk.bind(this));
        let mouseOff = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mouseOutDesk.bind(this));

        this.desk.getChildMeshes().forEach(mesh => {
          mesh.actionManager = new BABYLON.ActionManager(this.scene);	
          mesh.actionManager.registerAction(mouseOn);
          mesh.actionManager.registerAction(mouseOff);
        });

        BABYLON.SceneLoader.ImportMesh('', '3D/', 'laptop.babylon', this.scene, (newMeshes) => {
          var gl = new BABYLON.GlowLayer('lcdglow', this.scene, {mainTextureSamples: 4});
          gl.intensity = 0.2;
          let rgba = new BABYLON.Color4.FromHexString('#ffffff');
          gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            if (mesh.name === 'Plane_006' && !this.bulbState) {
              result.set(1, 1, 1, 1);
            } else {
              result.set(0, 0, 0, 0);
            }
          }

          this.laptop = this.parentImportedMeshes(newMeshes, true);
          this.laptop.name = 'laptop';
          this.laptop.scaling = this.laptop.scaling.multiply(new BABYLON.Vector3(1.1,1.1,1.1));
          this.laptop.position.z = BASE_POS.z - wallSize.x + 0.5;
          this.laptop.position.x = BASE_POS.x - wallSize.x - 0.3;
          this.laptop.position.y = BASE_POS.y + 0.7;
          this.laptop.applyGravity = true;
          this.laptop.checkCollisions = true;
          
          let mouseOn = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mouseOverLaptop.bind(this));
          let mouseOff = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mouseOutLaptop.bind(this));
          let mouseClick = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.mouseClickLaptop.bind(this));
          this.laptop.getChildMeshes().forEach(mesh => {
            mesh.actionManager = new BABYLON.ActionManager(this.scene);	
            mesh.actionManager.registerAction(mouseOn);
            mesh.actionManager.registerAction(mouseOff);
            mesh.actionManager.registerAction(mouseClick);
          });
        });
      });

      BABYLON.SceneLoader.ImportMesh('', '3D/', 'switch.babylon', this.scene, (newMeshes) => {
        this.lightswitch = this.parentImportedMeshes(newMeshes, true);
        this.lightswitch.scaling = this.lightswitch.scaling.multiply(new BABYLON.Vector3(0.09,0.09,0.09));
        this.lightswitch.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
        this.lightswitch.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);
        this.lightswitch.position.z = BASE_POS.z - wallSize.x + 0.15;
        this.lightswitch.position.y = BASE_POS.y + 1.5;
        this.lightswitch.position.x = BASE_POS.x + 1;
        
        let mouseOn = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mouseOverSwitch.bind(this));
        let mouseOff = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mouseOutSwitch.bind(this));
        let mouseClick = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.mouseClickSwitch.bind(this));
        this.lightswitch.getChildMeshes().forEach(mesh => {
          mesh.actionManager = new BABYLON.ActionManager(this.scene);	
          mesh.actionManager.registerAction(mouseOn);
          mesh.actionManager.registerAction(mouseOff);
          mesh.actionManager.registerAction(mouseClick);
        });
      });
    });

    let skyboxMaterial = new Materials.SkyMaterial('skyMaterial', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.inclination = -0.4;
    skyboxMaterial.disableLighting = true;
    let skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, this.scene);
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;
    //this.scene.freezeActiveMeshes();
    this.scene.executeWhenReady(() => {
      this.addGround();
      this.mainCam = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(START_POS.x, START_POS.y, START_POS.z), this.scene);
      this.mainCam.setTarget(new BABYLON.Vector3(START_ANGLE.x, START_ANGLE.y, START_ANGLE.z));
      this.mainCam.applyGravity = true;
      this.mainCam.ellipsoid = new BABYLON.Vector3(1.5, 1, 1.5);
      
      this.scene.collisionsEnabled = true;
      this.mainCam.checkCollisions = true;
      this.mainCam.attachControl(this.canvas, true);
      this.debugCam = new BABYLON.ArcRotateCamera('debugCam', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
      this.debugCam.setPosition(new BABYLON.Vector3(0, 10, 0));
      this.debugCam.attachControl(this.canvas, true);
      this.debugCam.attachControl(this.canvas, true);
      //this.jumpToDebugCam(canvas);
      //this.addDebugLight();
      this.scene.activeCameras.push(this.mainCam);
      
      //this.showAxes.bind(this, 3);
      engine.hideLoadingUI();
      this.showNarration();
      setTimeout(() => {
        this.startIntroNarration();
      }, 1000);
      engine.runRenderLoop(() => {
        this.scene.render();
      });
    });
    // Watch for browser/canvas resize events
    window.addEventListener('resize', () => {
      engine.resize();
    });
  }

  showNarration() {
    this.setState({
      narrationVisibility:'narration_bg visible'
    });
  }

  hideNarration() {
    this.setState({
      currentNarration:'',
      narrationVisibility:'narration_bg'
    });
  }

  startIntroNarration() {
    this.cutscene = true;
    this.introNarrationParams.forEach((item) => {
      setTimeout(() => {
        this.setState({
          currentNarration:''
        });
        this.typeNarration(item.text);
      }, item.timeout);
      setTimeout(() => {
        this.setState({
          currentNarration:''
        });
        this.hideNarration();
        this.showOutput();
        this.cutscene = false;
      }, 15000);
    });
  }

  showOutput() {
    this.setState({
      outputVisibility:'output_bg visible'
    });
  }

  hideOutput() {
    this.setState({
      outputVisibility:'output_bg'
    });
  }

  appendNarration(newChar) {
    let current = this.state.currentNarration;
    this.setState({
      currentNarration: current + newChar
    });
  }

  typeNarration(string) {
    for (let i=0; i < string.length; i++) {
      setTimeout(() => {
        this.appendNarration(string[i]);
      }, i * 50);
    }
  }

  setOutput(string) {
    this.setState({
      currentOutput:string
    });
  }

  componentDidMount() {
    this.initializeScene();
  }

  render() {
    return(
    <div>
      <canvas></canvas>
      <div className={this.state.narrationVisibility}></div>
      <div className="narration_fg">{this.state.currentNarration}</div>
      <div className={this.state.outputVisibility}></div>
      <div className="output_fg">{this.state.currentOutput}</div>
        {/*
      <div className="controls">
        <button onClick={this.toggleLightBulb.bind(this)}>toggle light bulb</button>
        <button onClick={this.jumpToDebugCam.bind(this)}>debug cam</button>
        <button onClick={this.addDebugLight.bind(this)}>debug light</button>
        <button onClick={this.jumpToInteriorCam.bind(this)}>interior cam</button>
        </div>*/}
    </div>
    );
  }
}