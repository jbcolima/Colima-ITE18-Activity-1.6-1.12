import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Debug GUI
 */
const gui = new dat.GUI()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.8)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png') // adjust path as needed

/**
 * Materials
 */
const materials = {
    MeshBasicMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    MeshNormalMaterial: new THREE.MeshNormalMaterial(),
    MeshMatcapMaterial: new THREE.MeshMatcapMaterial({ matcap: matcapTexture }),
    MeshLambertMaterial: new THREE.MeshLambertMaterial({ color: 0x44aa88 }),
    MeshPhongMaterial: new THREE.MeshPhongMaterial({ color: 0x8844aa, shininess: 100 }),
    MeshToonMaterial: new THREE.MeshToonMaterial({ color: 0x2288ff }),
    MeshStandardMaterial: new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.5, roughness: 0.3 })
}

/**
 * Geometries
 */
const geometries = {
    sphere: new THREE.SphereGeometry(0.5, 32, 32),
    plane: new THREE.PlaneGeometry(1, 1),
    torus: new THREE.TorusGeometry(0.4, 0.15, 32, 64)
}

/**
 * Create meshes (they will share the same material)
 */
let activeMaterial = materials.MeshStandardMaterial

const sphere = new THREE.Mesh(geometries.sphere, activeMaterial)
sphere.position.x = -2

const plane = new THREE.Mesh(geometries.plane, activeMaterial)

const torus = new THREE.Mesh(geometries.torus, activeMaterial)
torus.position.x = 2

scene.add(sphere, plane, torus)

/**
 * GUI Controls
 */
const settings = {
    material: 'MeshStandardMaterial',
    color: activeMaterial.color.getHex(),
    wireframe: activeMaterial.wireframe,
    opacity: activeMaterial.opacity,
    metalness: activeMaterial.metalness || 0,
    roughness: activeMaterial.roughness || 0
}

const materialFolder = gui.addFolder('Material Controls')
materialFolder.add(settings, 'material', Object.keys(materials)).name('Material Type').onChange((value) => {
    activeMaterial = materials[value]

    // update all meshes
    sphere.material = activeMaterial
    plane.material = activeMaterial
    torus.material = activeMaterial

    // sync GUI controls to new material
    settings.color = activeMaterial.color ? activeMaterial.color.getHex() : 0xffffff
    settings.wireframe = !!activeMaterial.wireframe
    settings.opacity = activeMaterial.opacity ?? 1
    settings.metalness = activeMaterial.metalness ?? 0
    settings.roughness = activeMaterial.roughness ?? 0

    updateControllers()
})

const updateControllers = () => {
    colorController.updateDisplay()
    wireframeController.updateDisplay()
    opacityController.updateDisplay()
    metalnessController.updateDisplay()
    roughnessController.updateDisplay()
}

const colorController = materialFolder.addColor(settings, 'color').onChange((value) => {
    if (activeMaterial.color) activeMaterial.color.set(value)
})
const wireframeController = materialFolder.add(settings, 'wireframe').onChange((value) => {
    activeMaterial.wireframe = value
})
const opacityController = materialFolder.add(settings, 'opacity', 0, 1, 0.01).onChange((value) => {
    activeMaterial.opacity = value
    activeMaterial.transparent = value < 1
})
const metalnessController = materialFolder.add(settings, 'metalness', 0, 1, 0.01).onChange((value) => {
    if ('metalness' in activeMaterial) activeMaterial.metalness = value
})
const roughnessController = materialFolder.add(settings, 'roughness', 0, 1, 0.01).onChange((value) => {
    if ('roughness' in activeMaterial) activeMaterial.roughness = value
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animation
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate rotation
    sphere.rotation.y = elapsedTime * 0.4
    plane.rotation.y = elapsedTime * 0.4
    torus.rotation.y = elapsedTime * 0.4

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
