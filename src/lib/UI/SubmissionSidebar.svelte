<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { base } from "$app/paths";
  import { fly } from "svelte/transition";

  import { userLatLng, currentSidebar, currentMenuSection, formData } from "$lib/stores";

  import CustomSelect from "./CustomSelect.svelte";

  import { uploadImage } from "$lib/Map/utilities";

  import countermonumentOutlineIcon from "$lib/icons/countermonument-outline.svg";
  import monumentOutlineIcon from "$lib/icons/monument-outline.svg";
  import countermonumentIcon from "$lib/icons/countermonument.svg";
  import monumentIcon from "$lib/icons/monument.svg";
  import closeImage from "$lib/icons/close.svg";

  import { gestureTypes, stagingTactics, materialTypes, objectTypes, fields, senses, media, fieldMapping } from "$lib/data/types";

  export let objectView = false;

  const staticmanURL = "https://countermap.onrender.com/";
  const staticmanEndpoint = `${staticmanURL}v3/entry/github/hyphacoop/countermapland/staging/submissions/`;

  // Find the appropriate options to pass to CustomSelect based on the field name
  function getOptionsForField(technicalName) {
    switch (technicalName) {
      case "objectType":
        return objectTypes;
      case "material":
        return materialTypes;
      case "tactics":
        return stagingTactics;
      case "gestures":
        return gestureTypes;
      default:
        return []; // No options for fields that do not match
    }
  }

  let selectedSense = senses[0];
  let selectedMedia = media[0];

  // Reactive store to monitor screen width and toggle sidebar class
  let isScreenWidthLessThan768 = writable(false);
  let halfSidebarApplied = writable(false);

   // Function to check and update the screen width
   function updateScreenWidth() {
    isScreenWidthLessThan768.set(window.innerWidth < 768);
  }

   // Function to toggle the .half-sidebar class
   function toggleHalfSidebar() {
    if ($isScreenWidthLessThan768) {
      halfSidebarApplied.update(n => !n);
    }
  }

  const dispatch = createEventDispatcher();

  $: isFormValid = $formData.names.some(name => name.value.trim() !== '') && $formData.description && $userLatLng && $formData.email && $formData.consentGiven;

  // Reactive statement to manage the half-sidebar class application based on screen width and $userLatLng
  $: halfSidebarApplied.set($isScreenWidthLessThan768 && $userLatLng);

  $: console.log($halfSidebarApplied, 'is half sidebar applied');
  function resetForm() {
    formData.set({
      names: [{ id: "name1", value: "" }],
      altText: "",
      description: "",
      dynamicFieldValues: {},
      consentGiven: false,
      powerDominanceAnswer: null,
      success: false,
      submitting: false,
      errorMessage: false,
      email: "",
      files: null,
      file: null,
      activeInfoButtons: {},
      serverResponds: false,
      imageUrl: null,
    });
  }

  function isPower(value) {
    $formData.powerDominanceAnswer = value;
  }

  function addName() {
    if ($formData.names.length < 3) {
      const nextId = `name${$formData.names.length + 1}`;
      $formData.names.push({ id: nextId, value: "" });
      $formData.names = $formData.names;
    }
  }

  function getOptionsForFieldByFriendlyName(friendlyName) {
    const technicalName = fieldMapping[friendlyName]; 
    return getOptionsForField(technicalName);
  }

  function toggleInfoButton(info) {
    $formData.activeInfoButtons[info] = !$formData.activeInfoButtons[info];
  }

  function selectRandomFromArray(array, current, setterFunction) {
    const filteredArray = array.filter((item) => item !== current);
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    setterFunction(filteredArray[randomIndex]);
  }

  function closeSideBarEvent() {
    dispatch("closeSideBar");
  }

  // Function to upload the file as soon as it is received
  async function handleFileSelected(e) {
    console.log('File selected:', e.dataTransfer ? e.dataTransfer.files : e.target.files)
    e.preventDefault();
    $formData.files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if ($formData.files && $formData.files.length > 0) {
        $formData.file = $formData.files[0]; // only using one file for now
        // Immediately upload the file and store the URL
        try {
            $formData.imageUrl = await uploadImage($formData.file);
            console.log("File uploaded successfully:", $formData.imageUrl);
        } catch (error) {
            console.error("Error uploading file:", error);
            // Handle upload error (e.g., show an error message)
        }
    }
}
  async function handleSubmit() {
    $formData.submitting = true;

    // Assume imageUrl is already obtained from the file upload process
    $formData.imageUrl = $formData.file && $formData.file.url ? $formData.file.url : null;

    // Constructing the URLSearchParams directly without initially including potentially undefined values
    let payload = new URLSearchParams();

    // Add fields conditionally
    payload.append("fields[latLng]", `${$userLatLng.lat},${$userLatLng.lng}`);
    payload.append(
      "fields[challengesPower]",
      $formData.powerDominanceAnswer === "yes" ? "true" : "false"
    );
    if ($formData.description) payload.append("fields[description]", $formData.description);
    payload.append("fields[email]", $formData.email);
    if ($formData.imageUrl) {
      payload.append("fields[media]", $formData.imageUrl);
    }
    if ($formData.altText) {
      payload.append("fields[altMedia]", $formData.altText);
    }

    // Handle dynamic names and other fields
    $formData.names.forEach((name, index) => {
      if (name.value) payload.append(`fields[name${index + 1}]`, name.value);
    });

    Object.entries($formData.dynamicFieldValues).forEach(([userFriendlyName, value]) => {
      if (value) {
        const technicalName = fieldMapping[userFriendlyName];
        if (technicalName) {
          payload.append(`fields[${technicalName}]`, value);
        }
      }
    });
    try {
      console.log("Submitting form:", payload);
      const response = await fetch(
        staticmanEndpoint,
        {
          method: "POST",
          body: payload,
        }
      );

      if (response.ok) {
        $formData.success = true;
        $formData.submitting = false;
        console.log(
          "Form submitted successfully:",
          response.status,
          response.statusText
        );
        $userLatLng = null;
      } else {
        // Handle errors (e.g., show an error message)
        $formData.submitting = false;
        $formData.errorMessage = true;
        console.log(
          "Error submitting form:",
          response.status,
          response.statusText
        );
        $userLatLng = null;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      $formData.errorMessage = true;
      $userLatLng = null;
    }
  }

  $: missingFields = [];
  $: {
    missingFields = []; // Reset the array on each reactivity cycle
    if (!$formData.names.some(name => name.value.trim() !== '')) missingFields.push("Name");
    if (!$formData.description) missingFields.push("Description");
    if (!$userLatLng) missingFields.push("Location (latitude/longitude)");
    if (!$formData.email) missingFields.push("Email");
    if (!$formData.consentGiven) missingFields.push("Consent");
  }

  function goToContactForm() {
    currentSidebar.set("menu");
    currentMenuSection.set("Contact");
  }

  function gotoComAgr() {
    currentSidebar.set("menu");
    currentMenuSection.set("Community Agreements");
  }

  $: if ($formData.files && $formData.files.length > 0) {
    $formData.file = $formData.files[0];
  } else {
    $formData.file = null;
  }

  async function verifyServerResponds() {
    if (!$formData.serverResponds) {
      try {
          // Sending a request to wake up the server
          const response = await fetch(staticmanURL, {
              method: 'GET',
            });
            if (response.ok) {
              const text = await response.text(); // Retrieves the response body as plain text
              if (text.includes("Hello from Staticman version 3.0.0!")) {
                  console.log("Staticman is active:", text.match(/Hello from Staticman version 3.0.0!/g));
                  $formData.serverResponds = true;
              } else {
                  console.log('Server response does not include the expected message.');
              }
          } else {
              console.log('Server response:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Error waking up the server:', error);
      }
    }
  }

  onMount(async () => {
    verifyServerResponds();
    window.addEventListener('resize', updateScreenWidth);
    updateScreenWidth();
});

onDestroy(() => {
    window.removeEventListener('resize', updateScreenWidth);
  });


  $: submitText = $formData.submitting ? "Submitting" : "Submit";
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
  class:half-sidebar={$halfSidebarApplied}
>
  <button class="close-button" on:click={closeSideBarEvent}>
    <img src={closeImage} alt="Close Sidebar" />
  </button>
  {#if $formData.success}
    <h2>Thank you</h2>
    <p class="success">Your submission has been received.</p>
    <p>
      Our next review cycle starts on <span class="label ml-2 rounded"
        >date</span
      >
    </p>
    <p><a class="link" on:click={resetForm}>Add another submission</a></p>
    <p>Are you interested in volunteering to help review submissions?</p>
    <p>Reach out <a class="link" on:click={goToContactForm}>here</a></p>
  {:else if $formData.errorMessage}
    <h2>Something went wrong</h2>
    <p class="success">Your submission was not properly received.</p>
    <p>Get in touch or <a class='link' on:click={resetForm}>try again.</p>

    <button type="button" class="link" on:click={goToContactForm}>Reach out</button>
  {:else}
    <h2>Add to *countermap</h2>

    <p class="main-description">
      A monument can be an event, ecology, object, or site that is
      important to a community. It may have been erased, still exist, or be
      speculative.
    </p>
    <p class='main-description'>
      We define “countermonument” as a submission that challenges dominant systems of power.
    </p>
    <p class="main-description">
      We review each submission before adding it to the map in order to ensure
      this remains a safe digital space.
    </p>

    <p class="main-description">
      Please read our <a class='link' on:click={gotoComAgr}>Community Agreements</a> to learn more.
    </p>

    <h3>1. Leave a marker</h3>

        {#if $isScreenWidthLessThan768}
        {#if !$halfSidebarApplied}
          Click
          <button class="underline" on:click={toggleHalfSidebar}>here</button>
          to 

          expand the map in order to mark the location of this place.
          {:else}
          Place a marker on the map
          {/if}
        {:else if objectView}
          Click {@html `<a href="${base}/map" class='underline'>here</a>`} to mark the location of this place.
        {:else}
          Click on the countermap to mark the location of this place.
        {/if}

    </div>
    <h3>2. What do you call this place?</h3>
    <p>
      This can be an “official” name, a name that you use, or something else.
    </p>

    <div class="flex flex-col names items-start mb-4">
      {#each $formData.names as name, index (name.id)}
        <input
          type="text"
          bind:value={$formData.names[index].value}
          placeholder="Enter a name"
          id={name.id}
          required
        />
      {/each}
      {#if $formData.names.length < 3}
        <button class="add-another-name" on:click={addName}
          >Add another name</button
        >
      {/if}
    </div>

    
    <h3>3. Does this place challenge dominant systems of power?</h3>
    <div class="flex flex-col yes-no mb-11">
      <button on:click={() => isPower("yes")}>
        {#if $formData.powerDominanceAnswer === "yes"}
          <img src={countermonumentIcon} alt="Yes" class="icon" />
        {:else}
          <img
            src={countermonumentOutlineIcon}
            alt="Yes outline"
            class="icon"
          />
        {/if}
        yes
      </button>

      <button on:click={() => isPower("no")} class='monumentIcon'>
        {#if $formData.powerDominanceAnswer === "no"}
          <img src={monumentIcon} alt="No" />
        {:else}
          <img src={monumentOutlineIcon} alt="No outline" />
        {/if}
        no
      </button>
    </div>

    <h3>4. What do you know about this place?</h3>

    <h3>Add some tags:</h3>
    <div class="flex flex-row more-btns mb-4">
      {#each fields as info}
        <button
          class="rounded"
          class:active={$formData.activeInfoButtons[info]}
          on:click={() => toggleInfoButton(info)}
        >
          {info}
        </button>
      {/each}
    </div>
    <div class="flex flex-col more-info mb-4">
      {#each Object.keys($formData.activeInfoButtons).filter(info => $formData.activeInfoButtons[info]) as activeInfo}
        {#if ['objectType', 'material', 'tactics', 'gestures'].includes(fieldMapping[activeInfo])}
          <h4>{activeInfo}</h4>
          <CustomSelect
            options={getOptionsForFieldByFriendlyName(activeInfo)}
            bind:selected={$formData.dynamicFieldValues[activeInfo]}
            altBgColor={'#40b37c'}
          />
        {:else}
          <input
            type="text"
            bind:value={$formData.dynamicFieldValues[activeInfo]}
            placeholder={`Enter ${activeInfo} details`}
          />
        {/if}
      {/each}
    </div>

    <h3>5. How do you experience this place?</h3>
    </p>
    <p>Optional: Click on the labels to create a prompt.</p>

    <!-- Dynamic senses and media buttons -->
    <div
      class="prompt flex flex-row flex-wrap justify-center items-center mb-4 rounded"
    >
      Share something you can
      <button
        class="rounded"
        on:click={() =>
          selectRandomFromArray(
            senses,
            selectedSense,
            (value) => (selectedSense = value)
          )}>{selectedSense}</button
      >
      in the form of a
      <button
        class="rounded"
        on:click={() =>
          selectRandomFromArray(
            media,
            selectedMedia,
            (value) => (selectedMedia = value)
          )}>{selectedMedia}</button
      >
    </div>

    <p>Share a file (audio, video, image, text) that represents this place.</p>

    <!-- File input with drag and drop -->
    <label for="file" class="file-dropzone mb-4" on:drop|preventDefault={handleFileSelected} on:dragover|preventDefault>Choose a file or drop one here.</label>
    <input type="file" bind:files={$formData.files} id="file" hidden on:change={handleFileSelected} />
    
    {#if $formData.file}
      <p>File selected: {$formData.file.name}</p>
    {/if}
    <p>Describe this image</p>
    <textarea class="mb-4" bind:value={$formData.altText}></textarea>

    <h3>6. Email</h3>
    <input class="mb-4" id="email" type="email" bind:value={$formData.email} required />

    <p class="my-4">
      <label class="custom-radio">
        <input
          type="radio"
          bind:group={$formData.consentGiven}
          value={true}
          class="hidden-radio"
        />
        <svg
          class="radio-svg"
          viewBox="0 0 14 14"
          xmlns="http://www.w3.org/2000/svg"
          on:click={() => ($formData.consentGiven = true)}
        >
          <circle
            cx="7"
            cy="7"
            r="6.5"
            stroke="black"
            fill={$formData.consentGiven ? "black" : "none"}
          />
        </svg>
        Let *countermap record and reuse the information you shared. 
      </label>
    </p>

        <!-- Display missing fields -->
{#if missingFields.length > 0}
<p class="missing-fields">
  <strong>
    Missing required fields:
  </strong>
</p>
  <ul>
  {#each missingFields as field, index}
    <li style='background-image: url({countermonumentIcon});'>
    {field}
  </li>
  {/each}
</ul>

{/if}
{#if !$formData.serverResponds}
<p>There seems to be an issue with the submission server</p>
<p>Try closing and reopening this sidebar. Don't worry the data you submitted won't be lost.</p>
{/if}
    <button
      class="submit rounded mb-4"
      disabled={!isFormValid || !$formData.consentGiven}
      on:click={handleSubmit}>
      {submitText}
      {#if $formData.submitting}
        <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      {/if}
      </button
    >

  {/if}
</div>

<style>
  .link {
    text-decoration: underline;
    cursor: pointer;
  }

  .sidebar {
    width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    background: #40b37c;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9999;
    padding: 0 1.88rem;
    padding-top: 2.69rem;
  }
  h2 {
    color: #000;
    font-family: Itim;
    font-size: 2.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 2.19rem;
  }

  h3 {
    color: #000;
    font-family: Itim;
    font-size: 1.5rem; 
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 0.94rem;
  }
  .icon {
    width: 22px;
    height: auto;
  }
  p,
  label, li {
    font-size: 0.75rem;
  }
  p {
    color: #000;
    font-family: "BCSans";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 1.5rem;
  }
  p.main-description {
    font-size: 0.875rem;
  }
  .prompt {
    display: flex;
    font-size: 0.75rem;
    padding: 1.1875rem 1.4375rem;
    justify-content: center;
    align-items: center;
    gap: 0.4375rem;
    border: 1px solid #000;
  }
  .prompt button,
  .label {
    padding: 0.125rem 0.625rem;
    border: 1px solid #000;
  }
  .submit {
    padding: 0.4rem 2rem;
    border: 1px solid #000;
  }
  button.active {
    background-color: #000;
    color: #fff;
  }

  .file-dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    border: 2px dashed #000;
    margin-top: 20px;
    cursor: pointer;
  }
  .more-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }
  .more-btns button {
    margin-right: 0.5rem;
    border: 1px solid #000;
    padding: 0.125rem 0.625rem;
  }

  .more-info input {
    margin: 0.5rem 0;
  }

  .yes-no button {
    display: flex;
    justify-content: left;
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .yes-no button img {
    max-width: 22px;
  }
  .yes-no .monumentIcon img {
    max-width: 15px;
    margin-left:3px;
  }

  .add-another-name {
    color: #000;
    font-family: "BCSans";
    font-size: 0.625rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-decoration-line: underline;
  }
  textarea {
    width: 100%;
  }

  textarea,
  input {
    padding: 0.25rem;
    border-radius: 0.25rem;
    border: 1px solid #000; 
  }
  .names input {
    margin-bottom: 0.5rem;
    width: 50%;
  }
  .custom-radio {
    display: flex;
    align-items: center;
    gap: 8px; /* Adjust as needed */
    cursor: pointer;
  }

  .hidden-radio {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  .radio-svg {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
  }

  .radio-svg circle {
    stroke-width: 1px;
  }

  @keyframes blink {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
}

  .dot {
    animation: blink 1.4s infinite both;
    display: inline-block;
    margin-left: 4px;
  }

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

ul {
    list-style-type: none; /* Removes default list bullets */
    padding: 0;
    margin: 0;
  }

li {
    margin: 0.5rem 0.25rem;
    background-repeat: no-repeat;
    background-size: 10px 10px; /* Adjust size of the icon */
    background-position: 0 0px; /* Adjust position of the icon */
    padding-left: 10px; /* Adjust padding to make space for the icon */
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      padding: 0 0.88rem;
      padding-top: 2rem;
      top: 25%;
      height: 75%;
    }
  }
  .half-sidebar {
    top: 50%;
    height: 50%;
  }
</style>
