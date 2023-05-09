export default function main(THREE, OrbitControls) {
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.2;
  controls.zoomSpeed = 0.1;
  
  function onDocumentMouseMove(event) {
    event.preventDefault();
  
    controls.update();
 
    renderer.render(scene, camera);
  }

  renderer.setClearColor(0xffffff);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchmove', onDocumentMouseMove, false);

  const radius = 20;
  const textureLoader = new THREE.TextureLoader();
  const textures = ['./imgs/TOP100/1_EUA.png', './imgs/TOP100/2_Donald-Trump.jpeg', './imgs/TOP100/3_ElizabethII.jpeg,', './imgs/TOP100/4_India.png', './imgs/TOP100/5_BarackObama.jpeg', './imgs/TOP100/6_CristianoRonaldo.jpeg', './imgs/TOP100/7_WWII.jpeg', './imgs/TOP100/8_ReinoUnido.png', './imgs/TOP100/9_MichaelJackson.jpeg', './imgs/TOP100/10_ElonMusk.jpeg', './imgs/TOP100/11_Sex.jpeg', './imgs/TOP100/12_LadyGaga.jpeg', './imgs/TOP100/13_AdolfHitler.jpeg', './imgs/TOP100/14_Eminem.jpg', './imgs/TOP100/15_Messi.jpeg'].map((path) => textureLoader.load(path));
  
  const loader = new THREE.TextureLoader();
textures.forEach((texturePath) => {
  loader.load(texturePath, (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.type = THREE.UnsignedByteType;
    const grayScale = new THREE.Color(0.21, 0.72, 0.07);
    texture.filter = THREE.NearestFilter;
    const grayShader = THREE.ShaderLib.basic.clone();
    const uniforms = THREE.UniformsUtils.clone(grayShader.uniforms);
    uniforms.opacity.value = 1.0;
    uniforms.color.value = grayScale;
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: grayShader.vertexShader,
      fragmentShader: grayShader.fragmentShader,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    plane.material.map = texture;
    plane.scale.set(texture.image.width, texture.image.height, 1);
    scene.add(plane);
  });
});

const particles = new THREE.Group();
  scene.add(particles);

function createParticle(texture, text) {
  const particleGroup = new THREE.Group();
  
  // create image sprite
  const material = new THREE.SpriteMaterial({ map: texture, opacity: 0 });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 5, 2);

  // create text sprite
  const textMaterial = new THREE.SpriteMaterial({
    map: createTextTexture(text),
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });

  const textSprite = new THREE.Sprite(textMaterial);
  textSprite.scale.set(8, 8, 1);
  textSprite.position.set(0, -6, 0);

  // add sprites to group
  particleGroup.add(sprite);
  particleGroup.add(textSprite);

  // set initial position and rotation
  const phi = Math.acos(-1 + (2 * Math.random()));
  const theta = Math.random() * Math.PI * 2;
  const radius = 20;
  particleGroup.position.x = radius * Math.sin(phi) * Math.cos(theta);
  particleGroup.position.y = radius * Math.sin(phi) * Math.sin(theta);
  particleGroup.position.z = radius * Math.cos(phi);
  particleGroup.lookAt(camera.position);
  particleGroup.rotateX(-Math.PI / 2);

  // add fadeIn animation
  const fadeInDuration = 2; // Duration in seconds for sprite to fade in
  const fadeInDelay = Math.random() * 2; // Delay in seconds before sprite starts fading in
  TweenMax.to(material, fadeInDuration, { opacity: 1, delay: fadeInDelay });
  TweenMax.to(textMaterial, fadeInDuration, { opacity: 1, delay: fadeInDelay });

  return particleGroup;
}

function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = 'bold 48px Arial';
  const textWidth = context.measureText(text).width;
  canvas.width = textWidth * 1.2;
  canvas.height = 64;
  context.font = 'bold 10px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}



const particleCount = 100;
const textureParticlesCount = 10;
const textParticlesCount = 5;

const textureParticles = textures.slice(0, textureParticlesCount);
const textParticles = Array.from(Array(textParticlesCount), (_, i) => `Text ${i + 1}`);

for (let i = 0; i < particleCount; i++) {
  const texture = textureParticles[i % textureParticlesCount];
  const text = textParticles[i % textParticlesCount];
  const particle = createParticle(texture, text);
  particles.add(particle);
}
  // Move the camera inside the sphere
  camera.position.set(0, 0, 10);

  const clock = new THREE.Clock();
  const updateParticles = (delta) => {
    particles.children.forEach((particle, index) => {
      particle.position.z += delta * 2;

      if (particle.position.z > radius) {
        const phi = Math.acos(-1 + (2 * Math.random()));
        const theta = Math.random() * Math.PI * 2;
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = -radius;
      }
    });
  };

  const animate = function () {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateParticles(delta);
    renderer.render(scene, camera);
  };

  animate();
  }


  const overlay = document.getElementById('overlay');
  const introText = document.getElementById('intro-text');
  
  overlay.addEventListener('click', () => {
    const fadeOutDuration = 1; // Duration in seconds for overlay to fade out
    const fadeOutDelay = 0; // Delay in seconds before overlay starts fading out
    TweenMax.to(overlay, fadeOutDuration, { opacity: 0, delay: fadeOutDelay });
    TweenMax.to(introText, fadeOutDuration, { opacity: 0, delay: fadeOutDelay, onComplete: () => {
      introText.style.display = 'none';
    }});
  });
  
  document.addEventListener('click', () => {
    const fadeOutDuration = 1; // Duration in seconds for overlay to fade out
    const fadeOutDelay = 0; // Delay in seconds before overlay starts fading out
    TweenMax.to(overlay, fadeOutDuration, { opacity: 0, delay: fadeOutDelay });
    TweenMax.to(introText, fadeOutDuration, { opacity: 0, delay: fadeOutDelay, onComplete: () => {
      introText.style.display = 'none';
    }});
  });