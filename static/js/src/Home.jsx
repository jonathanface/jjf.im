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

  initializeScene() {
    let self = this;
    let canvas = document.getElementsByTagName('canvas')[0]; // Get the canvas element 
    let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    BLOADERS.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;
    
    BABYLON.SceneLoader.Load('3D/', "wall.babylon", engine, function (newScene) {
      newScene.clearColor = BABYLON.Color3.White();
      newScene.debugLayer.show();
      let wall1 = newScene.meshes[0];
      console.log(wall1.scaling);
      
      let wallSize = wall1.getBoundingInfo().boundingBox.extendSize;
      
      let wall2 = wall1.clone();
      wall2.position.x += wallSize.x;
      wall2.position.z += wallSize.x;
      wall2.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
      
      
      let wall3 = wall1.clone();
      wall3.position.x -= wallSize.x;
      wall3.position.z += wallSize.x;
      wall3.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
      
      let wall4 = wall1.clone();
      wall4.position.z += wallSize.x*2;
      
      newScene.executeWhenReady(function () {
        let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2,2,2), newScene);
        light.diffuse = new BABYLON.Color3(1,1,1);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.groundColor = new BABYLON.Color3(0, 0, 0);

        let camera = new BABYLON.ArcRotateCamera('camera', Math.PI/2, Math.PI/4, 6, BABYLON.Vector3.Zero(), newScene);
        console.log(camera.position);
        //camera.position.y = 2;
        camera.attachControl(canvas, true);
        
        self.showAxes(3);
        
        newScene.registerBeforeRender(function() {
          wall1.scaling.y = 3;
        });
        
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