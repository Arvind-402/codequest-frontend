import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LiquidSculptureProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

/**
 * MK Vision Studio Inspired 3D Sliding Perspective Sculpture
 * "The Algorithmic Monolith — Studio Edition"
 *
 * Visual Features:
 * - Inner Liquid Obsidian Core with multi-harmonic simplex noise
 * - Outer Translucent Crystalline Ribbon Cage with #03E29C (Studio Mint) dispersion
 * - Twin Gyroscopic Execution Loops (Precision gold/bronze and emerald orbits)
 * - Scroll-Linked 3D Spatial Trajectory: smoothly slides along X, Y, and Z perspective axes
 * - Cursor Parallax with smooth cubic lerping
 * - Auto-pauses offscreen & inactive tabs for strict 60 FPS performance
 */
export const LiquidSculpture: React.FC<LiquidSculptureProps> = ({
  className = '',
  intensity = 1.0,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;
    let isVisible = true;

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Scene & Perspective Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 9.2);

      // 2. High-Performance WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Master 3D Spatial Anchor (Slides dynamically across scroll progress)
      const masterGroup = new THREE.Group();
      masterGroup.position.set(1.2, 0.2, 0);
      scene.add(masterGroup);

      // -------------------------------------------------------------
      // SHADERS: Inner Liquid Obsidian Kernel
      // -------------------------------------------------------------
      const kernelVertexShader = `
        uniform float uTime;
        uniform float uNoiseStrength;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        varying float vDisplacement;

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
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          float t = uTime * 0.25;
          vec3 coord = position * 0.7;
          float n1 = snoise(coord + vec3(0.0, t, 0.0));
          float n2 = snoise(coord * 2.0 - vec3(t * 0.7, 0.0, t * 0.4)) * 0.42;
          float n3 = snoise(coord * 4.0 + vec3(t * 0.3, t * 0.5, 0.0)) * 0.16;
          
          float totalDisplacement = (n1 + n2 + n3) * uNoiseStrength;
          vDisplacement = totalDisplacement;

          vec3 newPos = position + normal * totalDisplacement;
          vec4 worldPos = modelMatrix * vec4(newPos, 1.0);
          vWorldPosition = worldPos.xyz;
          
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const kernelFragmentShader = `
        uniform vec3 uColorMint;
        uniform vec3 uColorBronze;
        uniform vec3 uColorHighlight;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);

          float NdotV = max(dot(N, V), 0.0);
          float fresnel = pow(1.0 - NdotV, 3.4);
          float softFresnel = pow(1.0 - NdotV, 1.8);

          vec3 lightDir1 = normalize(vec3(-1.2, 1.3, 1.0));
          vec3 lightDir2 = normalize(vec3(1.3, -1.0, 0.7));

          // 1. MK Studio Mint Rim (#03E29C)
          float diff1 = max(dot(N, lightDir1), 0.0);
          vec3 mintRim = uColorMint * (fresnel * 3.2 + diff1 * 0.4);

          // 2. Editorial Bronze Rim (#C89B58)
          float diff2 = max(dot(N, lightDir2), 0.0);
          vec3 bronzeRim = uColorBronze * (softFresnel * 1.6 + diff2 * 0.3);

          // 3. Specular Razor Edge (#FFFFFF)
          vec3 H1 = normalize(lightDir1 + V);
          float spec1 = pow(max(dot(N, H1), 0.0), 80.0);
          vec3 specGlaze = uColorHighlight * (spec1 * 2.4);

          // Deep Architectural Charcoal Body (#08090B)
          vec3 charcoalBody = vec3(0.03, 0.035, 0.04);

          vec3 finalColor = charcoalBody + bronzeRim + mintRim + specGlaze;
          gl_FragColor = vec4(finalColor, 0.96);
        }
      `;

      // -------------------------------------------------------------
      // SHADERS: Outer Crystalline Glass Ribbon Cage
      // -------------------------------------------------------------
      const glassVertexShader = `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const glassFragmentShader = `
        uniform vec3 uColorMint;
        uniform vec3 uColorBronze;
        uniform vec3 uColorHighlight;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);

          float NdotV = max(dot(N, V), 0.0);
          float fresnel = pow(1.0 - NdotV, 2.6);
          float rimThin = pow(1.0 - NdotV, 5.2);

          vec3 lightDir = normalize(vec3(-1.1, 1.3, 0.9));
          vec3 H = normalize(lightDir + V);
          float spec = pow(max(dot(N, H), 0.0), 96.0);

          vec3 edgeColor = mix(uColorBronze * 0.7, uColorMint, fresnel);
          vec3 specularLight = uColorHighlight * spec * 2.6 + uColorMint * (rimThin * 3.4);
          vec3 internalTint = uColorMint * 0.06;

          vec3 finalColor = internalTint + edgeColor * (fresnel * 1.8) + specularLight;
          float alpha = clamp(0.18 + fresnel * 0.68 + spec * 0.35, 0.0, 0.94);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      // 1. Inner Liquid Kernel Mesh
      const kernelGeo = new THREE.IcosahedronGeometry(1.85, 64);
      const kernelUniforms = {
        uTime: { value: 0 },
        uNoiseStrength: { value: prefersReducedMotion ? 0.06 : 0.4 * intensity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorMint: { value: new THREE.Color('#03E29C') },
        uColorBronze: { value: new THREE.Color('#C89B58') },
        uColorHighlight: { value: new THREE.Color('#FFFFFF') },
      };

      const kernelMat = new THREE.ShaderMaterial({
        vertexShader: kernelVertexShader,
        fragmentShader: kernelFragmentShader,
        uniforms: kernelUniforms,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
      });

      const kernelMesh = new THREE.Mesh(kernelGeo, kernelMat);
      masterGroup.add(kernelMesh);

      // 2. Outer Glass Crystalline Torus Cage
      const glassGeo = new THREE.TorusKnotGeometry(2.35, 0.26, 144, 28, 2, 3);
      const glassUniforms = {
        uTime: { value: 0 },
        uColorMint: { value: new THREE.Color('#03E29C') },
        uColorBronze: { value: new THREE.Color('#C89B58') },
        uColorHighlight: { value: new THREE.Color('#FFFFFF') },
      };

      const glassMat = new THREE.ShaderMaterial({
        vertexShader: glassVertexShader,
        fragmentShader: glassFragmentShader,
        uniforms: glassUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      masterGroup.add(glassMesh);

      // 3. Gyroscopic Orbital Precision Rings (Algorithmic Execution)
      const ringGroup = new THREE.Group();
      masterGroup.add(ringGroup);

      const ring1Geo = new THREE.TorusGeometry(3.1, 0.016, 16, 120);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#03E29C'),
        transparent: true,
        opacity: 0.55,
      });
      const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1Mesh.rotation.x = Math.PI * 0.38;
      ring1Mesh.rotation.y = Math.PI * 0.12;
      ringGroup.add(ring1Mesh);

      const ring2Geo = new THREE.TorusGeometry(3.55, 0.014, 16, 140);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#C89B58'),
        transparent: true,
        opacity: 0.42,
      });
      const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2Mesh.rotation.x = -Math.PI * 0.28;
      ring2Mesh.rotation.z = Math.PI * 0.22;
      ringGroup.add(ring2Mesh);

      // 4. Sparse Constellation Depth Particles
      const particleCount = 80;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 2.8 + Math.random() * 5.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        particlePos[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePos[i3 + 2] = radius * Math.cos(phi);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: new THREE.Color('#03E29C'),
        size: 0.045,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });

      const particlePoints = new THREE.Points(particleGeo, particleMat);
      masterGroup.add(particlePoints);

      // -------------------------------------------------------------
      // Smooth Mouse, Scroll & 3D Sliding Interpolation
      // -------------------------------------------------------------
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      let scrollY = 0;
      let targetScrollY = 0;

      const handlePointerMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };

      const handleScroll = () => {
        targetScrollY = window.scrollY;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      const clock = new THREE.Clock();

      // -------------------------------------------------------------
      // 3D Animation & Perspective Sliding Loop
      // -------------------------------------------------------------
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isVisible || document.hidden) return;

        const elapsed = clock.getElapsedTime();

        // Buttery smooth lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.045;
        mouse.y += (mouse.targetY - mouse.y) * 0.045;
        scrollY += (targetScrollY - scrollY) * 0.06;

        const timeRate = prefersReducedMotion ? 0.04 : 1.0;

        kernelUniforms.uTime.value = elapsed * timeRate;
        kernelUniforms.uMouse.value.set(mouse.x, mouse.y);
        glassUniforms.uTime.value = elapsed * timeRate;

        // Kinematic Harmonic Rotations
        kernelMesh.rotation.x = elapsed * 0.08 * timeRate + mouse.y * 0.22;
        kernelMesh.rotation.y = elapsed * 0.12 * timeRate + mouse.x * 0.32;
        kernelMesh.position.y = Math.sin(elapsed * 0.4 * timeRate) * 0.12;

        glassMesh.rotation.x = -elapsed * 0.09 * timeRate + mouse.y * 0.35;
        glassMesh.rotation.y = elapsed * 0.14 * timeRate + mouse.x * 0.42;
        glassMesh.rotation.z = Math.sin(elapsed * 0.22 * timeRate) * 0.18;

        ring1Mesh.rotation.z = elapsed * 0.16 * timeRate;
        ring2Mesh.rotation.y = -elapsed * 0.12 * timeRate;

        particlePoints.rotation.y = elapsed * 0.02 * timeRate + mouse.x * 0.08;

        // MK VISION STUDIO 3D PERSPECTIVE SLIDING TRAJECTORY:
        // As user scrolls, the sculpture glides across X, Y and Z perspective space
        const scrollNorm = Math.min(scrollY / 1000, 1.5);
        masterGroup.position.x = 1.2 - scrollNorm * 0.65; // Slides inwards to frame content
        masterGroup.position.y = 0.2 - scrollNorm * 1.1;  // Tracks gracefully downwards
        masterGroup.position.z = -scrollNorm * 1.4;       // Shifts slightly in depth
        masterGroup.rotation.x = mouse.y * 0.15 + scrollNorm * 0.35;
        masterGroup.rotation.y = mouse.x * 0.25 + scrollNorm * 0.45;

        if (camera && renderer && scene) {
          camera.position.x = mouse.x * 0.3;
          camera.position.y = mouse.y * 0.2;
          camera.lookAt(masterGroup.position.x * 0.35, masterGroup.position.y * 0.35, 0);
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }

        kernelGeo.dispose();
        kernelMat.dispose();
        glassGeo.dispose();
        glassMat.dispose();
        ring1Geo.dispose();
        ring1Mat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS luxury glow sculpture:', err);
      setHasWebGL(false);
    }
  }, [intensity, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#03E29C]/20 via-[#C89B58]/15 to-transparent blur-3xl animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-[#03E29C]/30 bg-[#08090B]/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(3,226,156,0.15)] flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-[#C89B58]/30 bg-gradient-to-br from-[#08090B] via-[#0E141B] to-[#03E29C]/20 blur-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
