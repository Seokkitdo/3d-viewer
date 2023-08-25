<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
  import TextList from '$components/TextList.svelte';
  import ImageViewer from '$components/ImageViewer.svelte';
  import ModelViewer from '$components/ModelViewer.svelte';
  import CheckboxList from '$components/CheckboxList.svelte';

  export const objModel = '/3Dmesh.obj';
  let container: HTMLElement;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;

  function initScene(): THREE.Scene {
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      0.5,
    );
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    return scene;
  }

  function initCamera(): THREE.PerspectiveCamera {
    const cam: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    cam.position.z = 5;
    cam.position.y = 10;
    return cam;
  }

  function initRenderer(container: HTMLElement): THREE.WebGLRenderer {
    const rend: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    rend.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(rend.domElement);
    return rend;
  }

  function getContainerSize() {
    return {
      width: container.clientWidth,
      height: container.clientHeight,
    };
  }

  // 카메라 종횡비 및 렌더러 출력 크기 컨테이너에 맞게 조정
  function updateCameraAndRenderer() {
    console.log('??');
    const { width, height } = getContainerSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onWindowResize(): void {
    updateCameraAndRenderer();
  }

  function initControls(
    camera: THREE.PerspectiveCamera,
    rendererElement: HTMLElement,
  ): OrbitControls {
    const controls: OrbitControls = new OrbitControls(camera, rendererElement);
    controls.enableDamping = true;
    return controls;
  }

  function loadObj(scene: THREE.Scene): void {
    const objLoader: OBJLoader = new OBJLoader();
    objLoader.load(objModel, (object: THREE.Object3D) => {
      // 3D 모델 위치 조정
      const box: THREE.Box3 = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;

      // 카메라 위치 조절
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs((maxDim / 2) * Math.tan(fov * 2));
      cameraZ *= 1.1;
      const minZ = box.min.z;
      const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

      camera.position.z = center.z + cameraZ;
      const far = camera.position.z + cameraToFarEdge * 3;
      camera.far = far;
      camera.updateProjectionMatrix();

      scene.add(object);
      updateCameraAndRenderer();
    });
  }

  onMount(() => {
    const scene: THREE.Scene = initScene();
    camera = initCamera();
    renderer = initRenderer(container);
    const controls: OrbitControls = initControls(camera, renderer.domElement);
    controls.enableDamping = true;

    loadObj(scene);
    camera.position.z = 50;
    window.addEventListener('resize', onWindowResize, false);

    function animate(): void {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    animate();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    return () => {
      window.removeEventListener('resize', onWindowResize, false);
    };
  });

  const questions = [
    '이 프로젝트가 마음에 드시나요?',
    'Svelte를 사용하는 것이 어려우신가요?',
    '다른 프레임워크를 선호하시나요?',
    '이 예시가 도움이 되셨나요?',
    '추가적인 질문이 필요하신가요?',
    '다음에도 도움을 요청하실 건가요?',
    '이 대화를 즐기셨나요?',
  ];

  let checkedQuestions = [];

  function updateChecked(question, event) {
    checkedQuestions = event.target.checked
      ? [...checkedQuestions, question]
      : checkedQuestions.filter((q) => q !== question);
  }

  $: console.log('checkedQuestions', checkedQuestions);
</script>

<svelte:window on:resize={onWindowResize} />

<div class="grid grid-cols-4 h-screen">
  <TextList />
  <ImageViewer src="/facetoface.bmp" alt="정면이미지" />
  <ModelViewer bind:container />
  <CheckboxList {questions} {updateChecked} {checkedQuestions} />
</div>

<!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- <script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
  import Model from './lib/components/Model.svelte';

  export const objModel = '/3Dmesh.obj';
  let container: HTMLElement;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;

  function initScene(): THREE.Scene {
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      0.5,
    );
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    return scene;
  }

  function initCamera(): THREE.PerspectiveCamera {
    const cam: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    cam.position.z = 5;
    cam.position.y = 10;
    return cam;
  }

  function initRenderer(container: HTMLElement): THREE.WebGLRenderer {
    const rend: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    rend.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(rend.domElement);
    return rend;
  }

  function getContainerSize() {
    return {
      width: container.clientWidth,
      height: container.clientHeight,
    };
  }

  // 카메라 종횡비 및 렌더러 출력 크기 컨테이너에 맞게 조정
  function updateCameraAndRenderer() {
    const { width, height } = getContainerSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onWindowResize(): void {
    updateCameraAndRenderer();
  }

  function initControls(
    camera: THREE.PerspectiveCamera,
    rendererElement: HTMLElement,
  ): OrbitControls {
    const controls: OrbitControls = new OrbitControls(camera, rendererElement);
    controls.enableDamping = true;
    return controls;
  }

  function loadObj(scene: THREE.Scene): void {
    const objLoader: OBJLoader = new OBJLoader();
    objLoader.load(objModel, (object: THREE.Object3D) => {
      // 3D 모델 위치 조정
      const box: THREE.Box3 = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;

      // 카메라 위치 조절
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs((maxDim / 2) * Math.tan(fov * 2));
      cameraZ *= 1.1;
      const minZ = box.min.z;
      const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

      camera.position.z = center.z + cameraZ;
      const far = camera.position.z + cameraToFarEdge * 3;
      camera.far = far;
      camera.updateProjectionMatrix();

      scene.add(object);
      updateCameraAndRenderer();
    });
  }

  onMount(() => {
    const scene: THREE.Scene = initScene();
    camera = initCamera();
    renderer = initRenderer(container);
    const controls: OrbitControls = initControls(camera, renderer.domElement);
    controls.enableDamping = true;

    loadObj(scene);
    camera.position.z = 50;
    window.addEventListener('resize', onWindowResize, false);

    function animate(): void {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    animate();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    return () => {
      window.removeEventListener('resize', onWindowResize, false);
    };
  });

  const questions = [
    '이 프로젝트가 마음에 드시나요?',
    'Svelte를 사용하는 것이 어려우신가요?',
    '다른 프레임워크를 선호하시나요?',
    '이 예시가 도움이 되셨나요?',
    '추가적인 질문이 필요하신가요?',
    '다음에도 도움을 요청하실 건가요?',
    '이 대화를 즐기셨나요?',
  ];

  let checkedQuestions = [];

  function updateChecked(question, event) {
    checkedQuestions = event.target.checked
      ? [...checkedQuestions, question]
      : checkedQuestions.filter((q) => q !== question);
  }

  $: console.log('checkedQuestions', checkedQuestions);
</script>

<svelte:window on:resize={onWindowResize} />

<div class="grid grid-cols-4 h-screen">
  <div class="w-full h-full bg-sky-500 overflow-y-auto">
    {#each [...Array(50).keys()] as index}
      <p class="py-2">문장{index + 1} 번째 입니다</p>
    {/each}
  </div>
  <div class="w-full h-full">
    <img
      class="w-full h-auto object-cover"
      src="/facetoface.bmp"
      alt="정면이미지"
      srcset=""
    />
  </div>
  <div class="w-full h-full" bind:this={container}></div>
  <div>
    {#each questions as question}
      <label class="block mt-4">
        <input
          type="checkbox"
          bind:group={checkedQuestions}
          value={question}
          on:change={(event) => updateChecked(question, event)}
        />
        {question}
      </label>
    {/each}
  </div>
</div> -->
