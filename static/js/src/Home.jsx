import React from 'react';
import ReactDOM from 'react-dom';
import * as BABYLON from 'babylonjs';
import * as BLOADERS from 'babylonjs-loaders'

export class Home extends React.Component {

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

  initializeScene() {
    let self = this;
    let canvas = document.getElementsByTagName('canvas')[0]; // Get the canvas element 
    let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    BLOADERS.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;
    
    BABYLON.SceneLoader.Load('3D/', "wall.babylon", engine, function (newScene) {
      newScene.clearColor = new BABYLON.Color3.FromHexString('#OC1445');
      newScene.debugLayer.show();
      let wall1 = newScene.meshes[0];
      console.log('ws1', wall1.getBoundingInfo().boundingBox.extendSize);
      wall1.scaling = wall1.scaling.multiply(new BABYLON.Vector3(1, 1, 2));
      wall1.bakeCurrentTransformIntoVertices();
      
      let win = BABYLON.Mesh.CreateBox('window', 1, newScene);
      win.scaling = new BABYLON.Vector3(0.5, 1, 1);
      win.position = new BABYLON.Vector3(wall1.position.x, 2, wall1.position.z);
      let wallCSG = BABYLON.CSG.FromMesh(wall1);
      var subCSG = wallCSG.subtract(BABYLON.CSG.FromMesh(win));
      let newWall = subCSG.toMesh('wall', wall1.material, newScene);
      newWall.checkCollisions = true;
      let winSize = win.getBoundingInfo().boundingBox.extendSize;
      let bar = BABYLON.MeshBuilder.CreateCylinder('bar', {height:winSize.y*2, diameter:0.03}, newScene);
      bar.checkCollisions = true;
      let blackMat = new BABYLON.StandardMaterial("blackMat", newScene);
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
      
      let wallSize = wall1.getBoundingInfo().boundingBox.extendSize;
      console.log('ws2', wallSize);

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
      
      let floor = BABYLON.MeshBuilder.CreatePlane('ground', {width: wallSize.x*2, height: wallSize.x*2}, newScene);
      let material = new BABYLON.StandardMaterial("bab5", newScene);
      floor.material = material;
      floor.position.z += wallSize.x;
      floor.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
      floor.checkCollisions = true;
      material.ambientTexture = new BABYLON.Texture('textures/concrete_floor.jpg', newScene);
      
      let ceiling = BABYLON.MeshBuilder.CreatePlane('ceiling', {width: wallSize.x*2, height: wallSize.x*2, sideOrientation:BABYLON.Mesh.DOUBLESIDE}, newScene);
      material = new BABYLON.StandardMaterial("bab5", newScene);
      material.roughness = 1;
      ceiling.material = material;
      ceiling.position.z += wallSize.x;
      ceiling.position.y += wallSize.x;
      ceiling.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
      ceiling.checkCollisions = true;
      material.ambientTexture = new BABYLON.Texture('textures/ceiling.jpg', newScene);

  
      BABYLON.SceneLoader.ImportMesh("", "3D/", "lamp.babylon", newScene, function (newMeshes) {
        let lamp = new BABYLON.TransformNode();
        newMeshes.forEach(mesh => {
          // leave meshes already parented to maintain model hierarchy:
          if (!mesh.parent) {
            mesh.parent = lamp;
          }
        });
        console.log('lmp', lamp);
        console.log('sz', newMeshes.length);
        lamp.position.y = 0.5
        lamp.position.x = 0.5;
        lamp.position.z = 0.5;
      });
      newScene.executeWhenReady(function () {
        let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2,2,2), newScene);
        light.diffuse = new BABYLON.Color3(1,1,1);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.groundColor = new BABYLON.Color3(0, 0, 0);
        
        newScene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        let camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0,2,2.5), newScene);
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1.5, 1, 1.5);
        newScene.collisionsEnabled = true;
        camera.checkCollisions = true;
        camera.attachControl(canvas, true);
        
        self.showAxes(3);

        engine.runRenderLoop(function () {
          newScene.render();
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
    return(<canvas></canvas>);
  }
}