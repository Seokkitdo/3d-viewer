<script lang="ts">
  export let questions = [];
  export let updateChecked;
  export let checkedQuestions = [];
</script>

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
