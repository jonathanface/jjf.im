import React from 'react';
import ReactDOM from 'react-dom';
import * as BABYLON from 'babylonjs';
import * as BLOADERS from 'babylonjs-loaders'

export class Home extends React.Component {
  
  constructor() {
    super();
    this.state = {};
    this.state.scene = null;
    this.state.debugCam = null;
    this.state.bulb = null;
    this.state.bulbState = false;
    this.state.bulbGlow = null;
    this.state.domeMesh = null;
    this.state.desk = null;
    this.state.laptop = null;
    this.state.mainCam = null;
    this.state.canvas;
  }

  showAxes(size) {
    var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, self.scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, self.scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", self.scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
  
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], self.scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], self.scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], self.scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  }
  
  addGround() {
    var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", scene);
    terrainMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    terrainMaterial.specularPower = 64;
	
	// Set the mix texture (represents the RGB values)
    terrainMaterial.mixTexture = new BABYLON.Texture("textures/mixMap.png", scene);
	
	// Diffuse textures following the RGB values of the mix map
	// diffuseTexture1: Red
	// diffuseTexture2: Green
	// diffuseTexture3: Blue
    terrainMaterial.diffuseTexture1 = new BABYLON.Texture("textures/floor.png", scene);
    terrainMaterial.diffuseTexture2 = new BABYLON.Texture("textures/rock.png", scene);
    terrainMaterial.diffuseTexture3 = new BABYLON.Texture("textures/grass.png", scene);
    
	// Bump textures according to the previously set diffuse textures
    terrainMaterial.bumpTexture1 = new BABYLON.Texture("textures/floor_bump.png", scene);
    terrainMaterial.bumpTexture2 = new BABYLON.Texture("textures/rockn.png", scene);
    terrainMaterial.bumpTexture3 = new BABYLON.Texture("textures/grassn.png", scene);
   
    // Rescale textures according to the terrain
    terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
    terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
    terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;
	
	// Ground
	var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 10, scene, false);
	ground.position.y = -2.05;
	ground.material = terrainMaterial;
  }

  highlightMesh(mesh, color, scene) {
    var hl = new BABYLON.HighlightLayer("hl1", scene);
    hl.addMesh(mesh, color);
  }
  
  jumpToDebugCam() {
    this.state.scene.activeCameras.push(this.state.debugCam);
  }
  
  jumpToInteriorCam() {
    this.state.scene.activeCameras.push(this.state.mainCam);
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
    let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2,2,2), this.state.scene);
    light.diffuse = new BABYLON.Color3(1,1,1);
    light.specular = new BABYLON.Color3(0, 0, 0);
    light.groundColor = new BABYLON.Color3(0, 0, 0);
  }
  
  toggleLightBulb() {
    if (this.state.bulbState) {
      if (this.state.bulbGlow) {
        this.state.bulbGlow.dispose();
      }
      if (this.state.domeMesh.material) {
        this.state.domeMesh.material = null;
      }
    } else {
      this.state.bulbGlow = new BABYLON.HighlightLayer("hg", this.state.scene);
      this.state.bulbGlow.innerGlow = false;
      this.state.bulbGlow.addMesh(this.state.domeMesh, new BABYLON.Color3(.9, .9, .9));
      let materialGlow = new BABYLON.StandardMaterial('lamplight', this.state.scene);
      materialGlow.emissiveColor = new BABYLON.Color3(1.0, 1.0, 0.7);
      this.state.domeMesh.material = materialGlow;
    }
    this.state.bulbState = !this.state.bulbState;
    this.state.bulb.setEnabled(this.state.bulbState);
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
  
  initializeScene() {
    let self = this;
    this.state.canvas = document.getElementsByTagName('canvas')[0]; // Get the canvas element 
    let engine = new BABYLON.Engine(this.state.canvas, true); // Generate the BABYLON 3D engine
    BLOADERS.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;
    
    BABYLON.SceneLoader.Load('3D/', 'wall.babylon', engine, function (newScene) {
      self.state.scene = newScene;
      self.state.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
      self.state.scene.clearColor = new BABYLON.Color3.FromHexString('#OC1445');
      //self.state.scene.debugLayer.show();
      let wall1 = self.state.scene.meshes[0];
      wall1.scaling = wall1.scaling.multiply(new BABYLON.Vector3(1, 1, 1.5));
      wall1.bakeCurrentTransformIntoVertices();
      
      let win = BABYLON.Mesh.CreateBox('window', 1, self.state.scene);
      win.scaling = new BABYLON.Vector3(0.5, 1, 1);
      win.position = new BABYLON.Vector3(wall1.position.x, 2, wall1.position.z);
      let wallCSG = BABYLON.CSG.FromMesh(wall1);
      var subCSG = wallCSG.subtract(BABYLON.CSG.FromMesh(win));
      let newWall = subCSG.toMesh('wall', wall1.material, self.state.scene);
      newWall.checkCollisions = true;
      let winSize = win.getBoundingInfo().boundingBox.extendSize;
      let bar = BABYLON.MeshBuilder.CreateCylinder('bar', {height:winSize.y*2, diameter:0.03}, self.state.scene);
      bar.checkCollisions = true;
      let blackMat = new BABYLON.StandardMaterial("blackMat", self.state.scene);
      blackMat.diffuseColor = BABYLON.Color3.Black();
      bar.material = blackMat;
      bar.position.x = win.position.x + (winSize.x / 4);
      bar.position.z = win.position.z;
      bar.position.y = win.position.y;
      let bar2 = bar.clone();
      bar2.position.x = win.position.x;
      let bar3 = bar.clone();
      bar3.position.x = - (winSize.x / 4);
      win.dispose();
      
      let wallSize = newWall.getBoundingInfo().boundingBox.extendSize;

      let wall2 = wall1.clone();
      wall2.position.x += wallSize.x;
      wall2.position.z += wallSize.x;
      wall2.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
      wall2.checkCollisions = true;

      let wall3 = wall1.clone();
      wall3.position.x -= wallSize.x;
      wall3.position.z += wallSize.x;
      wall3.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
      
      wall3.checkCollisions = true;

     
      let wall4 = wall1.clone();
      wall4.position.z += wallSize.x*2;
      wall4.checkCollisions = true;

      wall1.dispose();
      
      let floor = BABYLON.MeshBuilder.CreatePlane('ground', {width: wallSize.x*2, height: wallSize.x*2}, self.state.scene);
      let material = new BABYLON.StandardMaterial('groundMat', self.state.scene);
      floor.material = material;
      floor.position.z += wallSize.x;
      floor.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
      floor.checkCollisions = true;
      material.diffuseTexture = new BABYLON.Texture('textures/concrete_floor.jpg', self.state.scene);
      
      let ceiling = BABYLON.MeshBuilder.CreatePlane('ceiling', {width: wallSize.x*2, height: wallSize.x*2, sideOrientation:BABYLON.Mesh.DOUBLESIDE}, self.state.scene);
      material = new BABYLON.StandardMaterial('ceilingMat', self.state.scene);
      material.roughness = 1;
      ceiling.material = material;
      ceiling.position.z += wallSize.x;
      ceiling.position.y = wallSize.y*2 - 0.5;
      ceiling.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
      ceiling.checkCollisions = true;
      material.diffuseTexture = new BABYLON.Texture('textures/ceiling.jpg', self.state.scene);

  
      BABYLON.SceneLoader.ImportMesh('', '3D/', 'lamp.babylon', self.state.scene, function (newMeshes) {
        let lamp = new BABYLON.TransformNode();
        newMeshes.forEach(mesh => {
          if (!mesh.parent) {
            mesh.parent = lamp;
          }
          if (mesh.name == 'Line151') {
            self.state.domeMesh = mesh;
          }
        });
        
        lamp.position.y = wallSize.y*2 - 1.15;
        lamp.position.x = 0.5;
        lamp.position.z = 0.5;
        let lightPos = lamp.position.clone();
        lightPos.y += 0.2;
        lightPos.x -= 0.1;
       
        self.state.bulb = new BABYLON.PointLight('lightbulb', lightPos, self.state.scene);
        self.state.bulb.range /= 2;
        self.state.bulb.diffuse = new BABYLON.Color3(1, 1, 1);
        self.state.bulb.specular = new BABYLON.Color3(1, 1, 1);
        self.state.bulb.groundColor = new BABYLON.Color3(0, 0, 0);
        self.state.bulb.excludedMeshes.push(self.state.domeMesh);
        self.state.bulb.parent = lamp;
        self.state.bulb.setEnabled(false);
      });
      
      BABYLON.SceneLoader.ImportMesh("", "3D/", "desk.babylon", self.state.scene, function (newMeshes) {
        self.state.desk = self.parentImportedMeshes(newMeshes, true);
        console.log(self.state.desk.getHierarchyBoundingVectors());
        self.state.desk.scaling = self.state.desk.scaling.multiply(new BABYLON.Vector3(0.6, 0.6, 0.6));
        //desk.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
        let deskSize = self.state.desk.getHierarchyBoundingVectors().max;
        self.state.desk.position.z = wallSize.z + deskSize.z;
        self.state.desk.position.x -= wallSize.x - deskSize.x;
        
        BABYLON.SceneLoader.ImportMesh('', '3D/', 'laptop.babylon', self.state.scene, function (newMeshes) {
          self.state.laptop = self.parentImportedMeshes(newMeshes, true);
          self.state.laptop.scaling = self.state.laptop.scaling.multiply(new BABYLON.Vector3(1.1,1.1,1.1));
          //let lapSize = self.state.laptop.getHierarchyBoundingVectors().max;
          self.state.laptop.position.z = wallSize.z + 1;
          self.state.laptop.position.x -= wallSize.x + 0.5;
          self.state.laptop.position.y = 0.7;
          //self.state.laptop.applyGravity = true;
          //self.state.laptop.rotate(BABYLON.Axis.X, Math.PI/4, BABYLON.Space.WORLD);
        });
      });
      
      
      
      self.state.scene.executeWhenReady(function () {  
        
        self.state.mainCam = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0,2,2.5), self.state.scene);
        self.state.mainCam.applyGravity = true;
        self.state.mainCam.ellipsoid = new BABYLON.Vector3(1.5, 1, 1.5);
        
        self.state.scene.collisionsEnabled = true;
        self.state.mainCam.checkCollisions = true;
        self.state.mainCam.attachControl(self.state.canvas, true);
        self.state.debugCam = new BABYLON.ArcRotateCamera('debugCam', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), self.state.scene);
        self.state.debugCam.setPosition(new BABYLON.Vector3(0, 10, 0));
        self.state.debugCam.attachControl(self.state.canvas, true);
        self.state.debugCam.attachControl(self.state.canvas, true);
        //self.jumpToDebugCam(canvas);
        //self.addDebugLight();
        self.state.scene.activeCameras.push(self.state.mainCam);
        
        self.showAxes(3);

        engine.runRenderLoop(function () {
          self.state.scene.render();
        });
      });
    });
    

    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () { 
      engine.resize();
    });
  }
  
  componentDidMount() {
    this.initializeScene();
  }

  render() {
    return(
    <div>
      <canvas></canvas>
      <div className="controls">
        <button onClick={this.toggleLightBulb.bind(this)}>toggle light bulb</button>
        <button onClick={this.jumpToDebugCam.bind(this)}>debug cam</button>
        <button onClick={this.addDebugLight.bind(this)}>debug light</button>
        <button onClick={this.jumpToInteriorCam.bind(this)}>interior cam</button>
      </div>
    </div>
    );
  }
}