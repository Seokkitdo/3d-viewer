<script>
  export let count = 50;
</script>

<div class="w-full h-full bg-sky-500 overflow-y-auto">
  {#each [...Array(count).keys()] as index}
    <p class="py-2">문장{index + 1} 번째 입니다</p>
  {/each}
</div>
