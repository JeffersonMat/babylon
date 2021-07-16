import {
  SceneLoader,
  FreeCamera,
  Vector3,
  Color3,
  Engine,
  Scene,
  HemisphericLight,
  SpotLight,
  Layer,
  UtilityLayerRenderer,
  BoundingBoxGizmo,
  SixDofDragBehavior,
  MultiPointerScaleBehavior,
  DirectionalLight,
} from "babylonjs"
import "babylonjs-loaders"

const init = () => {
  const canvas = document.getElementById("canvas")
  const engine = new Engine(canvas)
  let scene = new Scene(engine)

  const createModel = () => {
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.2)

    //Lights Hanlers
    const spotLight = new SpotLight(
      "spotLight",
      new Vector3(0, 30, 10),

      Math.PI / 3,
      20,
      scene
    )
    spotLight.intensity = 100
    spotLight.range = 20
  
   

    const directionalLight = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0, -1, 0),
      scene
    )

    directionalLight.intensity = 10
    directionalLight.range = 100
    directionalLight.diffuse = new BABYLON.Color3(90, 90, 76)

    //Camera Handlers

    const camera = new FreeCamera("camera1", new Vector3(0, 1, 0), scene)
    camera.setTarget(new Vector3.Zero())

    // Attaching the controls to camera to enable rotation of the model rather than canvas
    camera.attachControl(scene, true)
    camera.useAutoRotationBehavior = true
    camera.allowUpsideDown = true
    scene.activeCamera.alpha += Math.PI

    //Model setup importing .gltf model
    const model = SceneLoader.Append(
      "../assets/daft_punk/",
      "scene.gltf",
      scene,
      function (newMeshes) {
        scene.createDefaultCameraOrLight(true, true, true)
        const light = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene)
        light.intensity = 20

        //Scales the Model
        newMeshes.meshes[0].scaling.scaleInPlace(1.5)

        //wrap in bounding box mesh to avoid picking perf hit

        const gltfMesh = newMeshes.meshes[0]

        //Encapsulates model in a box to enable grabbing
        const boundingBox =
          new BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh)

        // Create bounding box gizmo
        const utilLayer = new UtilityLayerRenderer(scene)
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false
        var gizmo = new BoundingBoxGizmo(Color3.FromHexString(""), utilLayer)

        // Create behaviors to drag and scale with pointers in VR
        const sixDofDragBehavior = new SixDofDragBehavior()
        boundingBox.addBehavior(sixDofDragBehavior)
        const multiPointerScaleBehavior = new MultiPointerScaleBehavior()
        boundingBox.addBehavior(multiPointerScaleBehavior)
      }
    )

    return scene
  }

  scene = createModel()
  // scene.debugLayer.show()
  engine.runRenderLoop(function () {
    scene.render()
  })
  //Set up background for canvas
  const url =
    "https://images.unsplash.com/photo-1542879412-4309c2cade1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
  const background = new Layer("back", url, scene)
  background.isBackground = true

  return scene.render()
}

window.addEventListener("DOMContentLoaded", () => {
  init()
})

window.addEventListener("resize", () => {
  const canvas = document.getElementById("canvas")
  const engine = new Engine(canvas, true)
  engine.resize()
})
