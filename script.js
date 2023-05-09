let camera, scene, renderer, particleSystem, material, textures;

const particleCount = 8000;
const particleSizes = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
const initialSize = 0.9;
const sizeWhenHovered = 1;

const particleSpeed = 0.09;

const imageUrls = [
  "./imgs/lol.png",
];

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

textures = imageUrls.map((url) => new THREE.TextureLoader().load(url));

material = new THREE.PointsMaterial({
  size: initialSize,
  map: textures[0],
  alphaTest: 0.1,
  transparent: true,
  depthTest: false,
  vertexColors: true
});

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const textureIndices = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 50;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  sizes[i] = particleSizes[Math.floor(Math.random() * particleSizes.length)];
  textureIndices[i] = Math.floor(Math.random() * textures.length);
}
geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute(
  "textureIndex",
  new THREE.BufferAttribute(textureIndices, 1)
);

particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);



const updateParticles = () => {
  for (let i = 0; i < particleCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    const flow = new THREE.Vector3(
      Math.sin(y * 0.1) * Math.sin(z * 0.1) + Math.random() * 0.1 - 0.05,
      Math.cos(x * 0.1) * Math.cos(z * 0.1) + Math.random() * 0.1 - 0.05,
      Math.sin(x * 0.1) * Math.cos(y * 0.1) + Math.random() * 0.1 - 0.05
    );

    // apply the flow effect to the particle position
    const speed = particleSpeed;
    positions[i * 3] += flow.x * speed;
    positions[i * 3 + 1] += flow.y * speed;
    positions[i * 3 + 2] += flow.z * speed;

    // wrap particles around when they go out of bounds
    if (Math.abs(positions[i * 3]) > 50) {
      positions[i * 3] *= -1;
    }
    if (Math.abs(positions[i * 3 + 1]) > 50) {
      positions[i * 3 + 1] *= -1;
    }
    if (Math.abs(positions[i * 3 + 2]) > 50) {
      positions[i * 3 + 2] *= -1;
    }
  }

  // update the position attribute of the geometry
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
};

const animate = () => {
  requestAnimationFrame(animate);

  updateParticles();

  geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
};
animate();

const menuIcon = document.querySelector('.menu-icon');
const slideInMenu = document.querySelector('#slide-in-menu');
const overlay = document.querySelector('#overlay');
const introText = document.querySelector('#intro-text');

menuIcon.addEventListener('click', () => {
  slideInMenu.classList.toggle('show');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('show');
  introText.style.opacity = 0;
  setTimeout(() => {
    introText.style.display = 'none';
  }, 1000);
});

document.addEventListener('click', () => {
  overlay.classList.remove('show');
  introText.style.opacity = 0;
});

