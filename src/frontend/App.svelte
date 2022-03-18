<style>
  .hidden {
    display: none;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script lang="ts">
  let fileinput: HTMLInputElement;
  let quality: number = 75;
  let hasFile = false;
  import { NotificationDisplay, notifier } from "@beyonk/svelte-notifications";

  function readFile(file: File) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((res, rej) => {
      reader.onload = (e) => res(e.target!.result);
      reader.onerror = rej;
    });
  }

  function onQualityDrag(e: Event) {
    console.Console;
  }

  window.api.receive("error", (err: string) => {
    notifier.danger(err, 4000);
    hasFile = false;
    fileinput.value = "";
  });

  const onFileSelected = async (e: Event) => {
    const files = Array.from((e.target as HTMLInputElement)?.files ?? []);
    hasFile = true;

    const imagesData = await Promise.all(
      files.map((file) =>
        readFile(file).then((fileBuffer) => {
          return {
            fileBuffer,
            fileName: file.name,
            quality,
          };
        })
      )
    );

    window.api.receiveOnce("file-uploaded", (fileNames: string[]) => {
      fileinput.value = "";
      hasFile = false;
      if (fileNames.length > 1) {
        return notifier.success(`${fileNames.length} files has been converted to webp`, 5000);
      }
      for (const fileName of fileNames) {
        notifier.success(`File converted as ${fileName} !`, 5000);
      }
    });

    window.api.send("file-uploaded", imagesData);
  };
</script>

<main>
  <h1>Drop some files !</h1>
  <div>
    <input
      class="{hasFile ? 'hidden' : ''}"
      type="file"
      accept="image/*"
      on:change="{(e) => onFileSelected(e)}"
      bind:this="{fileinput}"
      multiple
    />
    <br />
    <label for="quality">Quality ({quality})</label>
    <input
      on:input="{(e) => onQualityDrag(e)}"
      bind:value="{quality}"
      type="range"
      min="1"
      max="100"
      class="slider"
      id="quality"
    />
  </div>
  <p class="{!hasFile ? 'hidden' : ''}">Processing your file ...</p>
  <NotificationDisplay />
</main>
