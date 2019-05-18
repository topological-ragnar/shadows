const THREE = require('three')
const $ = require('jquery')
const OrbitControls = require('three-orbit-controls')(THREE)
const FlyControls = require('three-fly-controls')(THREE)
const WindowResize = require('three-window-resize')
const dat = require('dat.gui')
var randomHexColor = require('random-hex-color')

class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
    this.camera.position.z = 0
    this.camera.position.x = 0
    this.camera.position.y = 20


    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.shadowMap.enabled = true


    // this.controls = new OrbitControls(this.camera)
    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
    this.controls.movementSpeed = 0.1
    this.controls.rollSpeed = 0.01
    this.keyMap = {}

    const windowResize = new WindowResize(this.renderer, this.camera)

    this.gui = new dat.GUI()
    var options = this.gui.addFolder('options')
    this.rotate = true
    options.add(this, 'rotate').listen()
    options.open()

    this.clock = new THREE.Clock()
    this.clock.start()

    var floorGeometry = new THREE.PlaneGeometry(400 , 400, 32 )
    floorGeometry.lookAt(new THREE.Vector3(0,1,0))
    floorGeometry.translate(0,-10.1,0)
    var floorMaterial = new THREE.MeshToonMaterial( {color: 0xaaaaaa,side:THREE.DoubleSide} )
    var floorMesh = new THREE.Mesh( floorGeometry, floorMaterial )
    floorMesh.receiveShadow = true
    floorMesh.castShadow = true
    this.scene.add( floorMesh )

    var floorGeometry2 = new THREE.PlaneGeometry(400 , 400, 32 )
    floorGeometry2.lookAt(new THREE.Vector3(0,1,0))
    floorGeometry2.translate(0,-10.2,0)
    var floorMaterial2 = new THREE.MeshToonMaterial( {color: 0xaaaaaa,side:THREE.DoubleSide} )
    var floorMesh2 = new THREE.Mesh( floorGeometry2, floorMaterial2 )
    floorMesh2.receiveShadow = true
    floorMesh2.castShadow = true
    this.scene.add( floorMesh2 )

    this.sunsetDistance = 200
    this.lights = []
    for(var i = 0; i < 3; i++){
      var light = new THREE.PointLight( randomHexColor(), 1, 2000 )
      light.position.set( 0, 0, this.sunsetDistance )
      this.scene.add( light )
      this.lights.push(light)
      light.index = i+1
      light.castShadow = true
    }

    this.camera.lookAt(this.lights[0].position)


    // this._addCubeToScene()
    this.createCity()
  }

  render () {
    var t = this.clock.getElapsedTime()/40
    //
    // if(this.rotate){
    //   this.cube.rotation.x+=0.01
    //   this.cube.rotation.y+=0.01
    // }

    if(this.rotate){
      this.lights.forEach((light) => {
        light.position.y = 100*Math.sin(light.index*t)-11
        light.position.z = this.sunsetDistance*(Math.cos(light.index*t)+1)
      })
    }


    // this.light.position.x+=0.01

    this.renderer.render(this.scene, this.camera)

  }

  // 'private'

  _addCubeToScene() {
    var geometry = new THREE.BoxGeometry(1,1,1)
    var material = new THREE.MeshNormalMaterial()
    this.cube = new THREE.Mesh(geometry,material)
    this.scene.add(this.cube)
  }

  createCity() {
    var number = 5000
    var height = 20
    var width = 1
    var spread = 200

    //create locations
    var positions = []
    var x = 0
    var z = 0
    for(var i = 0; i < number; i++){
      z = Math.random()*spread
      x = (Math.random()-0.5)*spread*(1+(z/spread)*2)
      positions.push([x,z])
    }

    //build meshes
    this.meshes = []
    var material = new THREE.MeshToonMaterial()
    var nightMaterial = new THREE.MeshBasicMaterial({wireframe:true, color:0x22457d})
    var h = 0
    positions.forEach((p) => {
      h = Math.random()*height
      var geometry = new THREE.BoxGeometry(width,h,width)
      geometry.translate(p[0],-10+h/2,p[1])
      var mesh = new THREE.Mesh(geometry,material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.meshes.push(mesh)
      this.scene.add(mesh)
      var mesh2 = new THREE.Mesh(geometry,nightMaterial)
      this.scene.add(mesh2)
    })

  }



}

module.exports = Environment
