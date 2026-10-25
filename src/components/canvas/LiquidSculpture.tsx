import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LiquidSculptureProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

export const LiquidSculpture: React.FC<LiquidSculptureProps> = ({
  className = '',
  intensity = 1.0,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);

      // --- GLSL Simplex Noise Shaders ---
      const vertexShader = `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uNoiseDensity;
        uniform float uNoiseStrength;
        uniform vec2 uMouse;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying float vNoise;

        // Simplex 3D noise
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);

          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);

          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));

          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);

          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);

          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);

          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          // Slow organic pulsation
          float t = uTime * uSpeed;
          
          // Layered multi-frequency displacement for liquid organic form
          vec3 noisePos = position * uNoiseDensity + vec3(t * 0.35, t * 0.28, t * 0.42);
          float n1 = snoise(noisePos);
          float n2 = snoise(noisePos * 2.1 + vec3(t * 0.15)) * 0.5;
          float noise = (n1 + n2) * uNoiseStrength;

          // Mouse warp influence
          float mouseDist = length(position.xy - uMouse * 2.0);
          float mousePush = smoothstep(2.5, 0.0, mouseDist) * 0.25;

          vec3 displaced = position + normal * (noise + mousePush);

          // Finite difference to calculate smooth distorted normal
          float eps = 0.015;
          vec3 tx = position + vec3(eps, 0.0, 0.0);
          vec3 ty = position + vec3(0.0, eps, 0.0);
          float nx = (snoise(tx * uNoiseDensity + vec3(t * 0.35)) + snoise(tx * 2.1 * uNoiseDensity) * 0.5) * uNoiseStrength;
          float ny = (snoise(ty * uNoiseDensity + vec3(t * 0.35)) + snoise(ty * 2.1 * uNoiseDensity) * 0.5) * uNoiseStrength;
          vec3 displacedTx = tx + normal * nx;
          vec3 displacedTy = ty + normal * ny;
          
          vec3 tangentX = displacedTx - displaced;
          vec3 tangentY = displacedTy - displaced;
          vec3 computedNormal = normalize(cross(tangentX, tangentY));

          vNormal = normalize(normalMatrix * computedNormal);
          vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          vNoise = noise;

          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        uniform float uTime;
        uniform vec3 uColorOrange;
        uniform vec3 uColorBlue;
        uniform vec3 uColorViolet;
        uniform vec3 uColorCyan;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying float vNoise;

        void main() {
          vec3 V = normalize(vViewPosition);
          vec3 N = normalize(vNormal);

          // Fresnel incidence
          float NdotV = max(dot(N, V), 0.0);
          float fresnel = pow(1.0 - NdotV, 3.0);
          float deepFresnel = pow(1.0 - NdotV, 1.8);

          // Rim lighting setup inspired by Image 2
          // 1. Warm Orange Rim (Top / Upper-Left crest)
          vec3 dirOrange = normalize(vec3(-0.85, 0.8, 0.35));
          float rimOrange = pow(max(dot(N, dirOrange), 0.0), 2.2) * deepFresnel;
          vec3 orangeGlow = uColorOrange * rimOrange * 2.8;

          // 2. Deep Electric Blue Rim (Lower-Right & Underbelly)
          vec3 dirBlue = normalize(vec3(0.9, -0.75, 0.4));
          float rimBlue = pow(max(dot(N, dirBlue), 0.0), 1.9) * deepFresnel;
          vec3 blueGlow = uColorBlue * rimBlue * 2.5;

          // 3. Violet / Magenta Sheen (Top-Right high angle)
          vec3 dirViolet = normalize(vec3(0.5, 0.85, -0.3));
          float rimViolet = pow(max(dot(N, dirViolet), 0.0), 2.6) * deepFresnel;
          vec3 violetGlow = uColorViolet * rimViolet * 2.0;

          // 4. Cyan Glint (Precise razor edge)
          vec3 dirCyan = normalize(vec3(-0.3, -0.9, 0.6));
          float rimCyan = pow(max(dot(N, dirCyan), 0.0), 3.2) * fresnel;
          vec3 cyanGlow = uColorCyan * rimCyan * 1.8;

          // Glossy specular highlight
          vec3 H1 = normalize(dirOrange + V);
          float spec1 = pow(max(dot(N, H1), 0.0), 64.0);

          vec3 H2 = normalize(dirBlue + V);
          float spec2 = pow(max(dot(N, H2), 0.0), 40.0);

          // Base obsidian deep liquid body
          vec3 baseBlack = vec3(0.012, 0.014, 0.02);
          
          // Internal translucent refractive glow
          float internalScatter = (1.0 - NdotV) * 0.12;
          vec3 scatterColor = mix(uColorViolet, uColorBlue, 0.5) * internalScatter;

          // Composite colors
          vec3 finalColor = baseBlack 
                          + scatterColor 
                          + orangeGlow 
                          + blueGlow 
                          + violetGlow 
                          + cyanGlow 
                          + (spec1 * vec3(1.0, 0.78, 0.5) * 1.6)
                          + (spec2 * vec3(0.5, 0.85, 1.0) * 1.2);

          // Alpha edge feathering for liquid glass illusion
          float alpha = clamp(0.72 + fresnel * 0.28, 0.0, 1.0);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      // Geometry: High resolution Icosahedron for smooth fluid tessellation
      const geometryMain = new THREE.IcosahedronGeometry(2.35, 64);
      const uniformsMain = {
        uTime: { value: 0 },
        uSpeed: { value: 0.38 },
        uNoiseDensity: { value: 0.75 },
        uNoiseStrength: { value: 0.45 * intensity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorOrange: { value: new THREE.Color('#ff6b2c') }, // Vivid radiant orange
        uColorBlue: { value: new THREE.Color('#2563eb') },   // Electric cobalt blue
        uColorViolet: { value: new THREE.Color('#9333ea') }, // Violet / orchid
        uColorCyan: { value: new THREE.Color('#06b6d4') },   // Cyan glint
      };

      const materialMain = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniformsMain,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
      });

      const meshMain = new THREE.Mesh(geometryMain, materialMain);
      meshMain.position.set(0.65, 0.15, 0.0);
      scene.add(meshMain);

      // --- Satellite Droplet (inspired by Image 2's secondary floating droplet) ---
      const geometrySatellite = new THREE.IcosahedronGeometry(1.2, 48);
      const uniformsSat = {
        uTime: { value: 1.5 },
        uSpeed: { value: 0.45 },
        uNoiseDensity: { value: 0.95 },
        uNoiseStrength: { value: 0.35 * intensity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorOrange: { value: new THREE.Color('#ff7836') },
        uColorBlue: { value: new THREE.Color('#38bdf8') },
        uColorViolet: { value: new THREE.Color('#a855f7') },
        uColorCyan: { value: new THREE.Color('#22d3ee') },
      };

      const materialSat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniformsSat,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
      });

      const meshSat = new THREE.Mesh(geometrySatellite, materialSat);
      meshSat.position.set(-2.8, -1.2, -0.6);
      scene.add(meshSat);

      // --- Subtle Ambient floating dust/stars particles ---
      const particlesCount = 70;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 14;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 8;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: new THREE.Color('#818cf8'),
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // --- Pointer Tracking & Smooth Parallax ---
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

      const handlePointerMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouse.targetX = x;
        mouse.targetY = y;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });

      // Handle Resize
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      // --- Animation Loop ---
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse lerping
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;

        // Update uniforms
        uniformsMain.uTime.value = elapsedTime;
        uniformsMain.uMouse.value.set(mouse.x, mouse.y);

        uniformsSat.uTime.value = elapsedTime + 2.0;
        uniformsSat.uMouse.value.set(mouse.x, mouse.y);

        // Continuous subtle rotation
        meshMain.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 + mouse.y * 0.3;
        meshMain.rotation.y = elapsedTime * 0.12 + mouse.x * 0.35;
        meshMain.position.y = 0.15 + Math.sin(elapsedTime * 0.4) * 0.18;

        // Orbit satellite
        meshSat.rotation.x = elapsedTime * 0.18;
        meshSat.rotation.y = -elapsedTime * 0.15;
        meshSat.position.x = -2.8 + Math.cos(elapsedTime * 0.3) * 0.4 + mouse.x * 0.25;
        meshSat.position.y = -1.2 + Math.sin(elapsedTime * 0.35) * 0.3 + mouse.y * 0.2;

        // Drift particles
        particles.rotation.y = elapsedTime * 0.015;

        // Camera parallax response
        if (camera) {
          camera.position.x = mouse.x * 0.45;
          camera.position.y = mouse.y * 0.35;
          camera.lookAt(0, 0, 0);
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        geometryMain.dispose();
        materialMain.dispose();
        geometrySatellite.dispose();
        materialSat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS glow sculpture:', err);
      setHasWebGL(false);
    }
  }, [intensity, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Graceful Fallback if WebGL is disabled or on reduced-motion devices */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 via-purple-600/30 to-blue-500/20 blur-3xl animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-orange-500/30 bg-black/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,107,44,0.25)] flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-blue-500/30 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40 blur-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
