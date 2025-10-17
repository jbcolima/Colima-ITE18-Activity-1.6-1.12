import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// 1. Test built-in geometries (BoxGeometry used here, but you can swap with others)
//    - Examples: THREE.SphereGeometry(1, 32, 32), THREE.TorusGeometry(1, 0.5, 16, 100)
// const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4) // Example of a BoxGeometry with subdivisions

// 3. Create your own geometry using BufferGeometry
const count = 50 * 3 // 50 triangles * 3 vertices per triangle
const positionsArray = new Float32Array(count * 3) // 3 components (x, y, z) per vertex

for(let i = 0; i < count * 3; i++) {
    // 4. Experiment with random triangles and vertex counts
    positionsArray[i] = (Math.random() - 0.5) * 4 // Random values between -2 and 2
}

const customGeometry = new THREE.BufferGeometry()
// Set the positions attribute
customGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionsArray, 3) // 3 values per vertex (x, y, z)
)

const geometry = customGeometry
// 2. Add wireframe: true to see subdivisions/triangles
const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true // Key change for step 2
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()