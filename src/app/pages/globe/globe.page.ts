import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { Router } from '@angular/router';

interface RadioStation {
  id: number;
  name: string;
  frequency: string;
  genre: string;
  status: 'available' | 'unavailable' | 'searching' | 'busy';
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  verified: boolean;
  streamUrl?: string;
}

@Component({
  selector: 'app-globe',
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss']
})
export class GlobePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private globe!: THREE.Mesh;
  private markers: THREE.Mesh[] = [];
  private raycaster!: THREE.Raycaster;
  private mouse!: THREE.Vector2;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private animationId!: number;
  selectedStation: RadioStation | null = null;
  private audioPlayer: HTMLAudioElement | null = null;
  isPlaying = false;
  isLoading = false;
  currentPlayingStation: RadioStation | null = null;

  zoomLevel = 1;
  minZoom = 0.8;
  maxZoom = 3;

  radioStations: RadioStation[] = [
    {
      id: 1,
      name: 'BBC Radio 1',
      frequency: '97-99 FM',
      genre: 'Pop/Contemporary',
      status: 'available',
      latitude: 51.5074,
      longitude: -0.1278,
      city: 'London',
      country: 'United Kingdom',
      verified: true,
      streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one'
    },
    {
      id: 2,
      name: 'WFAN 660 AM',
      frequency: '660 AM',
      genre: 'Sports Talk',
      status: 'available',
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      country: 'United States',
      verified: true,
      streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WFANAM.mp3'
    },
    {
      id: 3,
      name: 'J-Wave 81.3',
      frequency: '81.3 FM',
      genre: 'Jazz/Adult Contemporary',
      status: 'available',
      latitude: 35.6762,
      longitude: 139.6503,
      city: 'Tokyo',
      country: 'Japan',
      verified: true,
      streamUrl: 'https://musicbird.leanstream.co/JCB08-MP3'
    },
    {
      id: 4,
      name: 'Radio France',
      frequency: '105.1 FM',
      genre: 'News/Talk',
      status: 'available',
      latitude: 48.8566,
      longitude: 2.3522,
      city: 'Paris',
      country: 'France',
      verified: true,
      streamUrl: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3'
    },
    {
      id: 5,
      name: 'ABC Radio',
      frequency: '702 AM',
      genre: 'News/Talk',
      status: 'available',
      latitude: -33.8688,
      longitude: 151.2093,
      city: 'Sydney',
      country: 'Australia',
      verified: true,
      streamUrl: 'https://live-radio01.mediahubaustralia.com/2LRW/mp3/'
    },
    {
      id: 6,
      name: 'Dubai FM',
      frequency: '92.0 FM',
      genre: 'Top 40',
      status: 'available',
      latitude: 25.2048,
      longitude: 55.2708,
      city: 'Dubai',
      country: 'UAE',
      verified: true,
      streamUrl: 'https://dubaifm.ice.infoman.ch/dubaifm'
    },
    {
      id: 7,
      name: 'Radio Nacional',
      frequency: '96.1 FM',
      genre: 'Variety',
      status: 'available',
      latitude: -34.6037,
      longitude: -58.3816,
      city: 'Buenos Aires',
      country: 'Argentina',
      verified: true,
      streamUrl: 'https://radiostreaming.com.ar:8000/radionacional'
    },
    {
      id: 8,
      name: 'Rádio Globo',
      frequency: '98.5 FM',
      genre: 'News/Talk',
      status: 'available',
      latitude: -22.9068,
      longitude: -43.1729,
      city: 'Rio de Janeiro',
      country: 'Brazil',
      verified: true,
      streamUrl: 'https://medias.sgr.globo.com/hls/aRGloboRJ/aRGloboRJ.m3u8'
    },
    {
      id: 9,
      name: 'Radio City 91.1',
      frequency: '91.1 FM',
      genre: 'Bollywood',
      status: 'available',
      latitude: 19.0760,
      longitude: 72.8777,
      city: 'Mumbai',
      country: 'India',
      verified: true,
      streamUrl: 'https://prclive1.listenon.in/RadioCity'
    },
    {
      id: 10,
      name: 'CBC Radio',
      frequency: '99.1 FM',
      genre: 'News/Talk',
      status: 'available',
      latitude: 43.6532,
      longitude: -79.3832,
      city: 'Toronto',
      country: 'Canada',
      verified: true,
      streamUrl: 'https://cbcliveradio-lh.akamaihd.net/i/CBCR1_TOR@507591/master.m3u8'
    },
    {
      id: 11,
      name: 'Radio Moscow',
      frequency: '101.2 FM',
      genre: 'Pop/Rock',
      status: 'available',
      latitude: 55.7558,
      longitude: 37.6173,
      city: 'Moscow',
      country: 'Russia',
      verified: true,
      streamUrl: 'https://icecast.vgtrk.cdnvideo.ru/mayakfm_mp3_128kbps'
    },
    {
      id: 12,
      name: 'Radio Beijing',
      frequency: '87.6 FM',
      genre: 'News/Talk',
      status: 'available',
      latitude: 39.9042,
      longitude: 116.4074,
      city: 'Beijing',
      country: 'China',
      verified: true,
      streamUrl: 'https://livecnm.cnr.cn/live/rmfygbed'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initGlobe();
      this.addMarkers();
      this.animate();
      this.setupEventListeners();
      this.handleResize();
    }, 100);
  }

  handleResize() {
    const resizeHandler = () => {
      if (this.camera && this.renderer && this.globeContainer) {
        const container = this.globeContainer.nativeElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        if (width > 0 && height > 0) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
      }
    };

    window.addEventListener('resize', resizeHandler);
    
    // También escuchar cambios en el contenedor
    if (this.globeContainer?.nativeElement) {
      const resizeObserver = new ResizeObserver(resizeHandler);
      resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.stopRadio();
  }

  initGlobe() {
    const container = this.globeContainer.nativeElement;
    // Usar tamaño completo de la pantalla
    const width = window.innerWidth;
    const height = window.innerHeight; // Sin restar header ya que lo eliminamos

    // Scene - fondo negro estilo Radio Garden
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    // Agregar estrellas al fondo
    this.addStars();

    // Camera - ajustar FOV según el tamaño de pantalla para ajustarse bien
    const aspect = width / height;
    const fov = 75; // FOV estándar para mejor ajuste
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.z = 2.8; // Posición ajustada para que el globo se vea bien

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Globe geometry - tamaño ajustado a la pantalla
    const globeRadius = 1.0; // Tamaño estándar que se ajusta bien
    const geometry = new THREE.SphereGeometry(globeRadius, 128, 64);
    
    // Crear material primero
    const material = new THREE.MeshPhongMaterial({
      shininess: 10,
      specular: new THREE.Color(0x222222)
    });
    
    // Cargar textura de mapa del mundo real
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
      () => {
        // Textura cargada exitosamente
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      () => {
        // Si falla la carga, usar textura generada
        const fallbackTexture = this.createEarthTexture();
        material.map = fallbackTexture;
        material.needsUpdate = true;
      }
    );
    
    // Asignar textura inicial (puede ser undefined hasta que cargue)
    material.map = texture;

    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);

    // Lighting mejorado
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 3, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, -3, -5);
    this.scene.add(directionalLight2);

    // Raycaster for mouse picking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  addStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    const starsCount = 8000; // Más estrellas para un fondo más rico

    // Crear estrellas distribuidas en una esfera grande alrededor del globo
    for (let i = 0; i < starsCount; i++) {
      // Distribución esférica para mejor efecto 3D
      const radius = 500 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));

    // Crear diferentes tamaños de estrellas
    const sizes = [];
    const colors = [];
    
    for (let i = 0; i < starsCount; i++) {
      // Tamaños variados (algunas más brillantes)
      const size = Math.random() * 4 + 0.5;
      sizes.push(size);
      
      // Colores variados (blancas, azules, doradas)
      const colorChoice = Math.random();
      if (colorChoice < 0.65) {
        colors.push(1, 1, 1); // Blanco - mayoría
      } else if (colorChoice < 0.85) {
        colors.push(0.7, 0.8, 1); // Azul claro
      } else if (colorChoice < 0.95) {
        colors.push(1, 0.9, 0.7); // Dorado
      } else {
        colors.push(1, 0.7, 0.7); // Rojo claro (estrellas rojas)
      }
    }

    starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material con variación de tamaño y color con parpadeo
    const starsMaterialAdvanced = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        uniform float time;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          vColor = color;
          // Parpadeo sutil basado en la posición
          vOpacity = 0.7 + sin(time * 2.0 + position.x * 0.01) * 0.3;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * vOpacity);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false
    });

    const stars = new THREE.Points(starsGeometry, starsMaterialAdvanced);
    this.scene.add(stars);

    // Guardar referencia del material para animación
    (stars as any).starsMaterial = starsMaterialAdvanced;
  }

  createEarthTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Fondo oceánico
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a3a5c'); // Azul oscuro arriba
    gradient.addColorStop(0.5, '#2d5a8a'); // Azul medio
    gradient.addColorStop(1, '#1a3a5c'); // Azul oscuro abajo
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar continentes simplificados
    ctx.fillStyle = '#2d5016'; // Verde oscuro para tierra
    
    // América del Norte
    this.drawContinent(ctx, 200, 150, 300, 200, '#3d6b1f');
    
    // América del Sur
    this.drawContinent(ctx, 250, 350, 200, 250, '#3d6b1f');
    
    // Europa
    this.drawContinent(ctx, 900, 100, 150, 150, '#4a7c2a');
    
    // África
    this.drawContinent(ctx, 950, 300, 150, 300, '#3d6b1f');
    
    // Asia
    this.drawContinent(ctx, 1200, 100, 400, 300, '#4a7c2a');
    
    // Australia
    this.drawContinent(ctx, 1400, 500, 150, 100, '#3d6b1f');
    
    // Antártida (base)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 900, canvas.width, 124);

    // Agregar detalles de costas
    ctx.strokeStyle = '#1a2d0a';
    ctx.lineWidth = 2;
    this.drawCoastlines(ctx);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  drawContinent(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Agregar variación de color
    ctx.fillStyle = '#5a8c3a';
    ctx.beginPath();
    ctx.ellipse(x - width * 0.1, y - height * 0.1, width * 0.3, height * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCoastlines(ctx: CanvasRenderingContext2D) {
    // Líneas de costa simplificadas
    ctx.strokeStyle = '#1a2d0a';
    ctx.lineWidth = 1;
    
    // Costa este de América
    ctx.beginPath();
    ctx.moveTo(250, 150);
    ctx.quadraticCurveTo(280, 200, 300, 250);
    ctx.quadraticCurveTo(280, 300, 250, 350);
    ctx.stroke();
    
    // Costa oeste de América
    ctx.beginPath();
    ctx.moveTo(450, 150);
    ctx.quadraticCurveTo(420, 200, 400, 250);
    ctx.quadraticCurveTo(420, 300, 450, 350);
    ctx.stroke();
    
    // Costa de Europa/África
    ctx.beginPath();
    ctx.moveTo(900, 100);
    ctx.quadraticCurveTo(950, 200, 1000, 300);
    ctx.quadraticCurveTo(1050, 400, 1100, 500);
    ctx.stroke();
    
    // Costa de Asia
    ctx.beginPath();
    ctx.moveTo(1200, 100);
    ctx.quadraticCurveTo(1400, 200, 1600, 300);
    ctx.stroke();
  }

  addMarkers() {
    this.radioStations.forEach(station => {
      const position = this.latLongToVector3(station.latitude, station.longitude, 1.02); // Ajustado al radio estándar
      const marker = this.createMarker(station, position);
      this.markers.push(marker);
      // Agregar marcador como hijo del globo para que rote con él
      this.globe.add(marker);
    });
  }

  createMarker(station: RadioStation, position: THREE.Vector3): THREE.Mesh {
    // Punto verde pequeño estilo Radio Garden
    const color = 0x4ade80; // Verde brillante como Radio Garden
    const geometry = new THREE.SphereGeometry(0.015, 12, 12); // Más pequeño
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.95
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    marker.userData = { station };

    // Efecto de brillo sutil (sin pulso grande)
    const glowGeometry = new THREE.SphereGeometry(0.02, 12, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    glow.userData = { station, glow: true };
    this.globe.add(glow);

    // Animate glow - efecto sutil estilo Radio Garden
    const animateGlow = () => {
      if (glow.userData['glow']) {
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time * 2) * 0.1;
        glow.scale.set(scale, scale, scale);
        const glowMat = glow.material as THREE.MeshBasicMaterial;
        glowMat.opacity = 0.2 + Math.sin(time * 2) * 0.1;
        requestAnimationFrame(animateGlow);
      }
    };
    animateGlow();

    return marker;
  }

  getStatusColor(status: string): number {
    switch (status) {
      case 'available':
        return 0x50C878; // Verde - Disponible
      case 'unavailable':
        return 0xff4444; // Rojo - No disponible
      case 'searching':
        return 0xFFD700; // Dorado - Por encontrar
      case 'busy':
        return 0xff8800; // Naranja - Ocupado
      default:
        return 0x888888;
    }
  }

  latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  setupEventListeners() {
    const canvas = this.renderer.domElement;

    // Mouse move for rotation
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.globe.rotation.y += deltaX * 0.01;
        this.globe.rotation.x += deltaY * 0.01;

        // Los marcadores rotan automáticamente con el globo al ser hijos de él

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });

    // Click to select person
    canvas.addEventListener('click', (e: MouseEvent) => {
      this.mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / canvas.clientHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.markers);

      if (intersects.length > 0) {
        const selectedMarker = intersects[0].object as THREE.Mesh;
        const station = selectedMarker.userData['station'] as RadioStation;
        this.selectStation(station);
      }
    });

    // Touch events for mobile
    canvas.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      this.isDragging = true;
      const touch = e.touches[0];
      this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
    });

    canvas.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault();
      if (this.isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.previousMousePosition.x;
        const deltaY = touch.clientY - this.previousMousePosition.y;

        this.globe.rotation.y += deltaX * 0.01;
        this.globe.rotation.x += deltaY * 0.01;

        // Los marcadores rotan automáticamente con el globo al ser hijos de él

        this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
      }
    });

    canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Zoom with wheel
    canvas.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel - delta));
      this.camera.position.z = 2.8 * this.zoomLevel; // Zoom basado en posición inicial ajustada
    });
  }

  selectStation(station: RadioStation) {
    this.selectedStation = station;
    // Zoom to station location
    this.zoomToStation(station);
  }

  zoomToStation(station: RadioStation) {
    const targetPosition = this.latLongToVector3(station.latitude, station.longitude, 1.02);
    
    // Animate camera to station
    const animate = () => {
      const currentPos = this.camera.position;
      const targetZ = 1.8; // Zoom ajustado
      
      currentPos.lerp(new THREE.Vector3(targetPosition.x * 2, targetPosition.y * 2, targetZ), 0.1);
      this.camera.lookAt(targetPosition);
      
      if (currentPos.distanceTo(new THREE.Vector3(targetPosition.x * 2, targetPosition.y * 2, targetZ)) > 0.1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  resetView() {
    this.selectedStation = null;
    this.camera.position.set(0, 0, 2.8); // Posición inicial ajustada
    this.camera.lookAt(0, 0, 0);
    this.zoomLevel = 1;
  }

  filterByStatus(status: string) {
    // Highlight markers by status
    this.markers.forEach(marker => {
      const station = marker.userData['station'] as RadioStation;
      const material = marker.material as THREE.MeshPhongMaterial;
      if (status === 'all' || station.status === status) {
        marker.visible = true;
        material.emissive.setHex(this.getStatusColor(station.status));
      } else {
        marker.visible = false;
      }
    });
  }

  updateMarkerPositions() {
    // Los marcadores son hijos del globo, así que rotan automáticamente con él
    // Solo necesitamos asegurarnos de que mantengan sus posiciones geográficas correctas
    this.markers.forEach(marker => {
      const station = marker.userData['station'] as RadioStation;
      // Recalcular posición basada en lat/long para mantener anclaje geográfico correcto
      const position = this.latLongToVector3(station.latitude, station.longitude, 1.02); // Radio estándar
      marker.position.copy(position);
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Actualizar animación de estrellas (parpadeo)
    const stars = this.scene.children.find(child => child instanceof THREE.Points) as THREE.Points;
    if (stars && (stars as any).starsMaterial) {
      const material = (stars as any).starsMaterial as THREE.ShaderMaterial;
      if (material.uniforms) {
        const timeUniform = material.uniforms['time'] as { value: number };
        if (timeUniform) {
          timeUniform.value += 0.01;
        }
      }
    }

    // Rotación suave automática del globo cuando no se está arrastrando (estilo Radio Garden)
    if (!this.isDragging) {
      this.globe.rotation.y += 0.002; // Rotación lenta y continua
    }

    // Los marcadores rotan automáticamente con el globo al ser hijos de él
    // No necesitamos actualizar posiciones manualmente

    this.renderer.render(this.scene, this.camera);
  }

  playRadio(station: RadioStation) {
    // Si hay una estación reproduciéndose, detenerla primero
    if (this.audioPlayer && this.currentPlayingStation) {
      this.stopRadio();
    }

    // Si la misma estación está seleccionada y está reproduciéndose, detener
    if (this.currentPlayingStation?.id === station.id && this.isPlaying) {
      this.stopRadio();
      return;
    }

    // Si la estación no tiene URL de stream, usar un stream de prueba
    const streamUrl = station.streamUrl || 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one';

    this.isLoading = true;
    this.currentPlayingStation = station;

    // Crear nuevo reproductor de audio
    this.audioPlayer = new Audio();
    this.audioPlayer.src = streamUrl;
    this.audioPlayer.crossOrigin = 'anonymous';
    
    // Event listeners
    this.audioPlayer.addEventListener('loadeddata', () => {
      this.isLoading = false;
      this.isPlaying = true;
    });

    this.audioPlayer.addEventListener('play', () => {
      this.isPlaying = true;
      this.isLoading = false;
    });

    this.audioPlayer.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.audioPlayer.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentPlayingStation = null;
    });

    this.audioPlayer.addEventListener('error', (e) => {
      console.error('Error al reproducir radio:', e);
      this.isLoading = false;
      this.isPlaying = false;
      this.currentPlayingStation = null;
      // Intentar con un stream alternativo o mostrar mensaje
    });

    // Intentar reproducir
    this.audioPlayer.play().catch(error => {
      console.error('Error al iniciar reproducción:', error);
      this.isLoading = false;
      this.isPlaying = false;
      this.currentPlayingStation = null;
    });
  }

  stopRadio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.src = '';
      this.audioPlayer = null;
    }
    this.isPlaying = false;
    this.isLoading = false;
    this.currentPlayingStation = null;
  }

  toggleRadio(station: RadioStation) {
    if (this.isPlaying && this.currentPlayingStation?.id === station.id) {
      this.stopRadio();
    } else {
      this.playRadio(station);
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'all':
        return 'globe-outline';
      case 'available':
        return 'checkmark-circle-outline';
      case 'unavailable':
        return 'close-circle-outline';
      case 'searching':
        return 'search-outline';
      case 'busy':
        return 'time-outline';
      default:
        return 'ellipse-outline';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'all':
        return 'Todos';
      case 'available':
        return 'Disponible';
      case 'unavailable':
        return 'No disponible';
      case 'searching':
        return 'Por encontrar';
      case 'busy':
        return 'Ocupado';
      default:
        return status;
    }
  }

  getStatusColorHex(status: string): string {
    switch (status) {
      case 'available':
        return '#50C878';
      case 'unavailable':
        return '#ff4444';
      case 'searching':
        return '#FFD700';
      case 'busy':
        return '#ff8800';
      default:
        return '#888888';
    }
  }

  selectedStatus = 'all';
}

