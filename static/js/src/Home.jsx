import React from 'react';
import ReactDOM from 'react-dom';
import * as BABYLON from 'babylonjs';

export class Home extends React.Component {

  initializeScene() {
    let canvas = document.getElementsByTagName('canvas')[0]; // Get the canvas element 
    let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
    camera.attachControl(canvas, true);

    let light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
    let light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);

    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter:2}, scene);

    engine.runRenderLoop(function () { 
      scene.render();
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